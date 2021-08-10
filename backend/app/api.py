from fastapi import FastAPI, File, UploadFile, Depends, status, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from numba import jit
from sklearn.utils.linear_assignment_ import linear_assignment
from filterpy.kalman import KalmanFilter
import io
from base64 import b64decode
import math
import cv2
import numpy as np
import imutils
import time
import glob
import matplotlib.pyplot as plt
import sys
import numpy
import shutil
import os
import smtplib
numpy.set_printoptions(threshold=sys.maxsize)




#from motor.motor_asyncio import AsyncIOMotorClient

#from .config import settings
import motor.motor_asyncio

from fastapi_users import FastAPIUsers, models
from fastapi_users.db import MongoDBUserDatabase
from fastapi_users.authentication import CookieAuthentication, JWTAuthentication

#from models.user import User 
from .config.db import conn 
from .schemas.user import userEntity, usersEntity
from .schemas.video import videosEntity
from bson import ObjectId

######################################-----Inialize Email Server-----#############################

server = smtplib.SMTP(host='smtp.gmail.com', port=587)

server.starttls()

server.login("crestimator.website@gmail.com","CREzsa1998")

#send email

def sendEmail(email):

    msg="""\
Subject: Your results are prepared!

Hi there! \nYou can see your results on the website.""" 

    server.sendmail("crestimator.website@gmail.com",email,msg)

######################################-----Inialize Dict-----######################################
users = [
    {
        "fname": "Aseel",
        "lname": "Ahmed",
        "email": "assm@gmail.com"
    },
    {
        "fname": "Lama",
        "lname": "Mula",
        "email": "lmula@gmail.com"
    }
]

videos = [
    {"name": "Mena",
     "path": "./videos/Mena.avi",
     "Placename": "Mena",
     "setting": "Mass gathring",
     "country": "Saudi Arabia",
     "city": "Makkah",
     "duration": "2.00",
     "date": "2/3/2019",
     "sendEmail": "true",
     "publish": "true",}
]


######################################-----API-----######################################
app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

######################################-----AI Model-----######################################

weights = r'C:\Users\Asma\Desktop\Projects\CREstimator_website\backend\model\custom-yolov4-detector_last.weights'
config = r'C:\Users\Asma\Desktop\Projects\CREstimator_website\backend\model\custom-yolov4-detector.cfg'
classes = r'C:\Users\Asma\Desktop\Projects\CREstimator_website\backend\model\yolov4.names'


# Function to calculate bottom center for all bounding boxes and transform prespective for all points.
def get_transformed_points(boxes, prespective_transform):
    
    bottom_points = []
    for box in boxes:
        pnts = np.array([[[int(box[0]+(box[2]*0.5)),int(box[1]+box[3])]]] , dtype="float32")
        #pnts = np.array([[[int(box[0]+(box[2]*0.5)),int(box[1]+(box[3]*0.5))]]] , dtype="float32")
        bd_pnt = cv2.perspectiveTransform(pnts, prespective_transform)[0][0]
        pnt = [int(bd_pnt[0]), int(bd_pnt[1])]
        bottom_points.append(pnt)
        
    return bottom_points

# Function calculates distance between two points(humans). distance_w, distance_h represents number
# of pixels in 180cm length horizontally and vertically. We calculate horizontal and vertical
# distance in pixels for two points and get ratio in terms of 180 cm distance using distance_w, distance_h.
# Then we calculate how much cm distance is horizontally and vertically and then using pythagoras
# we calculate distance between points in terms of cm. 
def cal_dis(p1, p2, distance_w, distance_h):
    
    h = abs(p2[1]-p1[1])
    w = abs(p2[0]-p1[0])
    
    dis_w = float((w/distance_w)*180)
    dis_h = float((h/distance_h)*180)
    
    return int(np.sqrt(((dis_h)**2) + ((dis_w)**2)))

# Function calculates distance between all pairs and calculates closeness ratio.
def get_distances(boxes1, bottom_points, distance_w, distance_h):
    
    distance_mat = []
    bxs = []
    
    for i in range(len(bottom_points)):
        for j in range(len(bottom_points)):
            if i != j:
                dist = cal_dis(bottom_points[i], bottom_points[j], distance_w, distance_h)
                #dist = int((dis*180)/distance)
                if dist <= 150:
                    closeness = 0
                    distance_mat.append([bottom_points[i], bottom_points[j], closeness])
                    bxs.append([boxes1[i], boxes1[j], closeness])
                elif dist > 150 and dist <=180:
                    closeness = 1
                    distance_mat.append([bottom_points[i], bottom_points[j], closeness])
                    bxs.append([boxes1[i], boxes1[j], closeness])       
                else:
                    closeness = 2
                    distance_mat.append([bottom_points[i], bottom_points[j], closeness])
                    bxs.append([boxes1[i], boxes1[j], closeness])
                
    return distance_mat, bxs
 
# Function gives scale for birds eye view               
def get_scale(W, H):
    
    dis_w = 400
    dis_h = 600
    
    return float(dis_w/W),float(dis_h/H)

@jit
def iou(bb_test,bb_gt):
  """
  Computes IUO between two bboxes in the form [x1,y1,x2,y2]
  """
  xx1 = np.maximum(bb_test[0], bb_gt[0])
  yy1 = np.maximum(bb_test[1], bb_gt[1])
  xx2 = np.minimum(bb_test[2], bb_gt[2])
  yy2 = np.minimum(bb_test[3], bb_gt[3])
  w = np.maximum(0., xx2 - xx1)
  h = np.maximum(0., yy2 - yy1)
  wh = w * h
  o = wh / ((bb_test[2]-bb_test[0])*(bb_test[3]-bb_test[1])
    + (bb_gt[2]-bb_gt[0])*(bb_gt[3]-bb_gt[1]) - wh)
  return(o)

def convert_bbox_to_z(bbox):
  """
  Takes a bounding box in the form [x1,y1,x2,y2] and returns z in the form
    [x,y,s,r] where x,y is the centre of the box and s is the scale/area and r is
    the aspect ratio
  """
  w = bbox[2]-bbox[0]
  h = bbox[3]-bbox[1]
  x = bbox[0]+w/2.
  y = bbox[1]+h/2.
  s = w*h    #scale is just area
  r = w/float(h)
  return np.array([x,y,s,r]).reshape((4,1))

def convert_x_to_bbox(x,score=None):
  """
  Takes a bounding box in the centre form [x,y,s,r] and returns it in the form
    [x1,y1,x2,y2] where x1,y1 is the top left and x2,y2 is the bottom right
  """
  w = np.sqrt(x[2]*x[3])
  h = x[2]/w
  if(score==None):
    return np.array([x[0]-w/2.,x[1]-h/2.,x[0]+w/2.,x[1]+h/2.]).reshape((1,4))
  else:
    return np.array([x[0]-w/2.,x[1]-h/2.,x[0]+w/2.,x[1]+h/2.,score]).reshape((1,5))

class KalmanBoxTracker(object):
  """
  This class represents the internel state of individual tracked objects observed as bbox.
  """
  count = 0
  def __init__(self,bbox):
    """
    Initialises a tracker using initial bounding box.
    """
    #define constant velocity model
    self.kf = KalmanFilter(dim_x=7, dim_z=4)
    self.kf.F = np.array([[1,0,0,0,1,0,0],[0,1,0,0,0,1,0],[0,0,1,0,0,0,1],[0,0,0,1,0,0,0],  [0,0,0,0,1,0,0],[0,0,0,0,0,1,0],[0,0,0,0,0,0,1]])
    self.kf.H = np.array([[1,0,0,0,0,0,0],[0,1,0,0,0,0,0],[0,0,1,0,0,0,0],[0,0,0,1,0,0,0]])

    self.kf.R[2:,2:] *= 10.
    self.kf.P[4:,4:] *= 1000. #give high uncertainty to the unobservable initial velocities
    self.kf.P *= 10.
    self.kf.Q[-1,-1] *= 0.01
    self.kf.Q[4:,4:] *= 0.01

    self.kf.x[:4] = convert_bbox_to_z(bbox)
    self.time_since_update = 0
    self.id = KalmanBoxTracker.count
    KalmanBoxTracker.count += 1
    self.history = []
    self.hits = 0
    self.hit_streak = 0
    self.age = 0

  def update(self,bbox):
    """
    Updates the state vector with observed bbox.
    """
    self.time_since_update = 0
    self.history = []
    self.hits += 1
    self.hit_streak += 1
    self.kf.update(convert_bbox_to_z(bbox))

  def predict(self):
    """
    Advances the state vector and returns the predicted bounding box estimate.
    """
    if((self.kf.x[6]+self.kf.x[2])<=0):
      self.kf.x[6] *= 0.0
    self.kf.predict()
    self.age += 1
    if(self.time_since_update>0):
      self.hit_streak = 0
    self.time_since_update += 1
    self.history.append(convert_x_to_bbox(self.kf.x))
    return self.history[-1]

  def get_state(self):
    """
    Returns the current bounding box estimate.
    """
    return convert_x_to_bbox(self.kf.x)

def associate_detections_to_trackers(detections,trackers,iou_threshold = 0.3):
  """
  Assigns detections to tracked object (both represented as bounding boxes)

  Returns 3 lists of matches, unmatched_detections and unmatched_trackers
  """
  if(len(trackers)==0) or (len(detections)==0):
    return np.empty((0,2),dtype=int), np.arange(len(detections)), np.empty((0,5),dtype=int)
  iou_matrix = np.zeros((len(detections),len(trackers)),dtype=np.float32)

  for d,det in enumerate(detections):
    for t,trk in enumerate(trackers):
      iou_matrix[d,t] = iou(det,trk)
  matched_indices = linear_assignment(-iou_matrix)

  unmatched_detections = []
  for d,det in enumerate(detections):
    if(d not in matched_indices[:,0]):
      unmatched_detections.append(d)
  unmatched_trackers = []
  for t,trk in enumerate(trackers):
    if(t not in matched_indices[:,1]):
      unmatched_trackers.append(t)

  #filter out matched with low IOU
  matches = []
  for m in matched_indices:
    if(iou_matrix[m[0],m[1]]<iou_threshold):
      unmatched_detections.append(m[0])
      unmatched_trackers.append(m[1])
    else:
      matches.append(m.reshape(1,2))
  if(len(matches)==0):
    matches = np.empty((0,2),dtype=int)
  else:
    matches = np.concatenate(matches,axis=0)

  return matches, np.array(unmatched_detections), np.array(unmatched_trackers)

class Sort(object):
  def __init__(self,max_age=1,min_hits=3):
    """
    Sets key parameters for SORT
    """
    self.max_age = max_age
    self.min_hits = min_hits
    self.trackers = []
    self.frame_count = 0

  def update(self,dets):
    """
    Params:
      dets - a numpy array of detections in the format [[x,y,w,h,score],[x,y,w,h,score],...]
    Requires: this method must be called once for each frame even with empty detections.
    Returns the a similar array, where the last column is the object ID.

    NOTE: The number of objects returned may differ from the number of detections provided.
    """
    self.frame_count += 1
    #get predicted locations from existing trackers.
    trks = np.zeros((len(self.trackers),5))
    to_del = []
    ret = []
    for t,trk in enumerate(trks):
      pos = self.trackers[t].predict()[0]
      trk[:] = [pos[0], pos[1], pos[2], pos[3], 0]
      if(np.any(np.isnan(pos))):
        to_del.append(t)
    trks = np.ma.compress_rows(np.ma.masked_invalid(trks))
    for t in reversed(to_del):
      self.trackers.pop(t)
    matched, unmatched_dets, unmatched_trks = associate_detections_to_trackers(dets,trks)

    #update matched trackers with assigned detections
    for t,trk in enumerate(self.trackers):
      if(t not in unmatched_trks):
        d = matched[np.where(matched[:,1]==t)[0],0]
        trk.update(dets[d,:][0])

    #create and initialise new trackers for unmatched detections
    for i in unmatched_dets:
        trk = KalmanBoxTracker(dets[i,:])
        self.trackers.append(trk)
    i = len(self.trackers)
    for trk in reversed(self.trackers):
        d = trk.get_state()[0]
        if((trk.time_since_update < 1) and (trk.hit_streak >= self.min_hits or self.frame_count <= self.min_hits)):
          ret.append(np.concatenate((d,[trk.id+1])).reshape(1,-1)) # +1 as MOT benchmark requires positive
        i -= 1
        #remove dead tracklet
        if(trk.time_since_update > self.max_age):
          self.trackers.pop(i)
    if(len(ret)>0):
      return np.concatenate(ret)
    return np.empty((0,5))


# Function to draw Bird Eye View for region of interest(ROI). Red, Yellow, Green points represents risk to human. 
# Red: High Risk
# Yellow: Low Risk
# Green: No Risk
def bird_eye_view(frame, distances_mat, bottom_points, scale_w, scale_h):
    h = frame.shape[0]
    w = frame.shape[1]

    red = (0, 0, 255)
    green = (0, 255, 0)
    yellow = (0, 255, 255)
    white = (200, 200, 200)

    blank_image = np.zeros((int(h * scale_h), int(w * scale_w), 3), np.uint8)
    blank_image[:] = white
    warped_pts = []
    r = []
    g = []
    y = []
    for i in range(len(distances_mat)):

        if distances_mat[i][2] == 0:
            if (distances_mat[i][0] not in r) and (distances_mat[i][0] not in g) and (distances_mat[i][0] not in y):
                r.append(distances_mat[i][0])
            if (distances_mat[i][1] not in r) and (distances_mat[i][1] not in g) and (distances_mat[i][1] not in y):
                r.append(distances_mat[i][1])

            blank_image = cv2.line(blank_image, (int(distances_mat[i][0][0] * scale_w), int(distances_mat[i][0][1] * scale_h)), (int(distances_mat[i][1][0] * scale_w), int(distances_mat[i][1][1]* scale_h)), red, 2)
            
    for i in range(len(distances_mat)):
                
        if distances_mat[i][2] == 1:
            if (distances_mat[i][0] not in r) and (distances_mat[i][0] not in g) and (distances_mat[i][0] not in y):
                y.append(distances_mat[i][0])
            if (distances_mat[i][1] not in r) and (distances_mat[i][1] not in g) and (distances_mat[i][1] not in y):
                y.append(distances_mat[i][1])
        
            blank_image = cv2.line(blank_image, (int(distances_mat[i][0][0] * scale_w), int(distances_mat[i][0][1] * scale_h)), (int(distances_mat[i][1][0] * scale_w), int(distances_mat[i][1][1]* scale_h)), yellow, 2)
            
    for i in range(len(distances_mat)):
        
        if distances_mat[i][2] == 2:
            if (distances_mat[i][0] not in r) and (distances_mat[i][0] not in g) and (distances_mat[i][0] not in y):
                g.append(distances_mat[i][0])
            if (distances_mat[i][1] not in r) and (distances_mat[i][1] not in g) and (distances_mat[i][1] not in y):
                g.append(distances_mat[i][1])
    
    for i in bottom_points:
        blank_image = cv2.circle(blank_image, (int(i[0]  * scale_w), int(i[1] * scale_h)), 5, green, 10)
    for i in y:
        blank_image = cv2.circle(blank_image, (int(i[0]  * scale_w), int(i[1] * scale_h)), 5, yellow, 10)
    for i in r:
        blank_image = cv2.circle(blank_image, (int(i[0]  * scale_w), int(i[1] * scale_h)), 5, red, 10)
        
    return blank_image
    
# Function to draw bounding boxes according to risk factor for humans in a frame and draw lines between
# boxes according to risk factor between two humans.
# Red: High Risk
# Yellow: Low Risk
# Green: No Risk 
def social_distancing_view(frame, distances_mat, boxes,matrix,fps):
    
   
    for i in range(len(distances_mat)):

        per1 = distances_mat[i][0]
        per2 = distances_mat[i][1]
        closeness = distances_mat[i][2]
        
        if closeness == 0:
            x,y,w,h,m = per1[:]
            #frame = cv2.rectangle(frame,(x,y),(w,h),red,2)
          
                
            x1,y1,w1,h1,n = per2[:]
            matrix[m][n]=matrix[m][n]+1

    pad = np.full((140,frame.shape[1],3), [110, 110, 100], dtype=np.uint8)
            
    return matrix





 #Related to the model
def get_output_layers(net):
        
    layer_names = net.getLayerNames()
        
    output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    return output_layers



def draw_prediction(img, class_id, confidence, x, y, x_plus_w, y_plus_h):
        
    #Name of selected object
    label = str(classes[class_id])

    #Color for each class 
    color = COLORS[class_id]

    cv2.rectangle(img, (x,y), (x_plus_w,y_plus_h), color, 2)

    cv2.putText(img, label, (x-10,y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)


def compute_color_for_labels(label):
    palette = (2 ** 11 - 1, 2 ** 15 - 1, 2 ** 20 - 1)
    """
    Simple function that adds fixed color depending on the class
    """
    color = [int((p * (label ** 2 - label + 1)) % 255) for p in palette]
    return tuple(color)




def estimate_contact_rate(video,title,userDuration, weights,config,classes):
    weights = weights
    config = config
    classes = classes
    tracker = Sort()
    memory = {}
    counter = 0
    videoTitle = title

    with open(classes, 'r') as f:
        classes = [line.strip() for line in f.readlines()]

        # initialize a list of colors to represent each possible class label
    np.random.seed(42)
    COLORS = np.random.randint(0, 255, size=(200, 3),dtype="uint8")

    print(video)
    net = cv2.dnn.readNetFromDarknet(config, weights)
    count = 0
    vs = cv2.VideoCapture(video)
     

    #get the frames per second
    fps = vs.get(cv2.CAP_PROP_FPS)
        

    (W, H) = (None, None)
    writer = None
    coverPic= None
    outputVideoPath = None
    frameIndex = math.floor(fps)

    # try to determine the total number of frames in the video file
    try:
        prop = cv2.cv.CV_CAP_PROP_FRAME_COUNT if imutils.is_cv2() \
            else cv2.CAP_PROP_FRAME_COUNT
        total = int(vs.get(prop))
            

    # an error occurred while trying to determine the total
    # number of frames in the video file
    except:
        total = -1


   
        
    duration = float(userDuration)
    np.random.seed(4)
    s = (10000,10000)
    s=np.zeros(s)
    maxID=-1
    frameNumber=[]
    peopleInframe=[]

    while True:
        success, image = vs.read()
        print(success)
            
        if not success:
            break
            # if the frame dimensions are empty, grab them
        if W is None or H is None:
            (H, W) = image.shape[:2]
        scale_w, scale_h = get_scale(W, H)
        
        points= [(12, 13), (582, 13), (589, 328), (3, 326), (85, 238), (160, 225), (283, 227), (308, 231)]
              
            
            # Using first 4 points or coordinates for perspective transformation. The region marked by these 4 points are 
            # considered ROI. This polygon shaped ROI is then warped into a rectangle which becomes the bird eye view. 
            # This bird eye view then has the property property that points are distributed uniformally horizontally and 
            # vertically(scale for horizontal and vertical direction will be different). So for bird eye view points are 
            # equally distributed, which was not case for normal view.
        src = np.float32(np.array(points[:4]))
        dst = np.float32([[0, H], [W, H], [W, 0], [0, 0]])
        prespective_transform = cv2.getPerspectiveTransform(src, dst)
            
            
                # using next 3 points for horizontal and vertical unit length(in this case 180 cm)
        pts = np.float32(np.array([points[4:7]]))
            #print(pts)
        warped_pt = cv2.perspectiveTransform(pts, prespective_transform)[0]
            
            
        # since bird eye view has property that all points are equidistant in horizontal and vertical direction.
            # distance_w and distance_h will give us 180 cm distance in both horizontal and vertical directions
            # (how many pixels will be there in 180cm length in horizontal and vertical direction of birds eye view),
            # which we can use to calculate distance between two humans in transformed view or bird eye view
        distance_w = np.sqrt((warped_pt[0][0] - warped_pt[1][0]) ** 2 + (warped_pt[0][1] - warped_pt[1][1]) ** 2)
        distance_h = np.sqrt((warped_pt[0][0] - warped_pt[2][0]) ** 2 + (warped_pt[0][1] - warped_pt[2][1]) ** 2)
            
            
            # construct a blob from the input frame and then perform a forward
            # pass of the YOLO object detector, giving us our bounding boxes
            # and associated probabilities
        blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416),
                swapRB=True, crop=False)
        net.setInput(blob)
        start = time.time()
        layerOutputs = net.forward(get_output_layers(net))
        end = time.time()

            # initialize our lists of detected bounding boxes, confidences,
            # and class IDs, respectively
        boxes = []
        confidences = []
        classIDs = []
            
            
            # loop over each of the layer outputs
        for output in layerOutputs:
                # loop over each of the detections
            for detection in output:
                    # extract the class ID and confidence (i.e., probability)
                    # of the current object detection
                scores = detection[5:]
                classID = np.argmax(scores)
                confidence = scores[classID]
                if classID==0:
                    # filter out weak predictions by ensuring the detected
                    # probability is greater than the minimum probability
                    if confidence > 0.5:
                        # scale the bounding box coordinates back relative to
                        # the size of the image, keeping in mind that YOLO
                        # actually returns the center (x, y)-coordinates of
                        # the bounding box followed by the boxes' width and
                        # height
                        box = detection[0:4] * np.array([W, H, W, H])
                        (centerX, centerY, width, height) = box.astype("int")

                        # use the center (x, y)-coordinates to derive the top
                        # and and left corner of the bounding box
                        x = int(centerX - (width / 2))
                        y = int(centerY - (height / 2))

                        # update our list of bounding box coordinates,
                        # confidences, and class IDs
                        boxes.append([x, y, int(width), int(height)])
                        confidences.append(float(confidence))
                        classIDs.append(classID)

            # apply non-maxima suppression to suppress weak, overlapping
            # bounding boxes
        idxs = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

        dets = []
        if len(idxs) > 0:
                # loop over the indexes we are keeping
            for i in idxs.flatten():
                (x, y) = (boxes[i][0], boxes[i][1])
                (w, h) = (boxes[i][2], boxes[i][3])
                dets.append([x, y, x+w, y+h, confidences[i]])

        np.set_printoptions(formatter={'float': lambda x: "{0:0.3f}".format(x)})
        dets1 = np.asarray(dets)
        tracks = tracker.update(dets1)

        boxes = []
        indexIDs = []
        c = []
        previous = memory.copy()
        memory = {}
        
        for track in tracks:
                
            boxes.append([int(track[0]), int(track[1]), int(track[2]), int(track[3]),int(track[4])])
            indexIDs.append(int(track[4]))
                
            if maxID< (int(track[4])):
                maxID=int(track[4])
                    
            memory[indexIDs[-1]] = boxes[-1]
                
                # draw bbox on screen
            color = compute_color_for_labels(int(track[4]))
            label = '{}{:d}'.format("", int(track[4]))
            t_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, 1)[0]
            cv2.rectangle(image, (int(track[0]), int(track[1])), (int(track[2]), int(track[3])), color, 2)
            cv2.rectangle(image, (int(track[0]), int(track[1])), (int(track[0]) + t_size[0] + 3, int(track[1]) + t_size[1] + 4), color, -1)
                
                
                
            
            cv2.putText(image, label, (int(track[0]), int(track[1]) + t_size[1] + 4), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, [255, 255, 255], 1)
                
                
                
        if len(boxes) > 0:
            i = int(-1)
                # Here we will be using bottom center point of bounding box for all boxes and will transform all those
                # bottom center points to bird eye view
            person_points = get_transformed_points(boxes, prespective_transform)
                
                # Here we will calculate distance between transformed points(humans)
            distances_mat, bxs_mat = get_distances(boxes, person_points, distance_w, distance_h)
                #risk_count = utills.classify(distances_mat)

            frame1 = np.copy(image)
                
                # Draw bird eye view and frame with bouding boxes around humans according to risk factor    
                
            s = social_distancing_view(frame1, bxs_mat, boxes,s,fps)
                
                
            for box in boxes:
                    # extract the bounding box coordinates
                (x, y) = (int(box[0]), int(box[1]))
                (w, h) = (int(box[2]), int(box[3]))
                    #text = "{}".format(indexIDs[i])
                    #cv2.putText(image, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 2, (255,0,0), 2)
                i+=1

                    
            # saves image file
            #main_header = cv2.imread('logo.jpg')
            #main_header = cv2.resize(main_header,(image.shape[1],main_header.shape[0]))
            #deshboard_image  = np.concatenate((main_header,image), axis=0)
        if(frameIndex == math.floor(fps)):
            framesPath="C:/Users/Asma/Desktop/Projects/CREstimator_website/backend/app/videos/output/"
            coverPic= "{}-{}.png".format(videoTitle,frameIndex)

        cv2.imwrite("C:/Users/Asma/Desktop/Projects/CREstimator_website/frontend/src/components/output/{}-{}.png".format(videoTitle,frameIndex), image)
            
            
        

        # check if the video writer is None
        # check if the video writer is None
        if writer is None:
            # initialize our video writer
            fourcc = cv2.VideoWriter_fourcc(*"MJPG")
            outputVideoPath ='output/{}.avi'.format(videoTitle)
            savedVideoPath = 'C:/Users/Asma/Desktop/Projects/CREstimator_website/backend/app/videos/output/{}.avi'.format(videoTitle)
            writer = cv2.VideoWriter(savedVideoPath, fourcc, 30,
                (image.shape[1], image.shape[0]), True)
            
            # some information on processing single frame
            if total > 0:
                elap = (end - start)
                print("[INFO] single frame took {:.4f} seconds".format(elap))
                print("[INFO] estimated total time to finish: {:.4f}".format(
                    elap * total))

        # write the output frame to disk
        writer.write(image)
       
        
        frameNumber.append(frameIndex)
        peopleInframe.append(len(boxes))

        # increase frame index
        frameIndex += math.floor(fps)
        count += 1 

        if frameIndex > total:
            
            writer.release()
            vs.release()
            break

            # release the file pointers
        
    writer.release()
    vs.release()

    print(frameNumber)
    print(peopleInframe)


    x_pos = np.arange(len(frameNumber))
    # Create bars and choose color
    plt.bar(x_pos, peopleInframe, color =(0.2, 0.4, 0.6, 0.6))
    
    # Add title and axis names
    plt.title('A number of people in some processed frames.')
    plt.xlabel('Frames index')
    plt.ylabel('Number of people')
 
    # Create names on the x axis
    plt.xticks(x_pos, frameNumber)
    locs, labels = plt.xticks()
    plt.setp(labels, rotation=90)

    nameOfFguir= "C:/Users/Asma/Desktop/Projects/CREstimator_website/frontend/src/components/output/"+videoTitle+".png"
    plt.savefig(nameOfFguir,dpi=400)

    figurePath=videoTitle+".png"
        
    rows =  s[1:maxID+1, 1:maxID+1]
    print(maxID)

    
    AllContact = 0
    for index,r in enumerate(rows):
        contact=0
        for i in r:
            if i >= duration:
                contact +=1
         
        AllContact += contact

    
    average= math.ceil(AllContact/maxID)
            
            
    Contact_Rate =9 
    totalPeople=maxID
    Contact_Rate= average/int(duration)
    print(Contact_Rate)
    format_float = "{:.2f}".format(Contact_Rate)
    return (totalPeople,average,Contact_Rate,outputVideoPath,figurePath,coverPic)



######################################-----Defult Get-----######################################
        
@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to the CREstimator API."}

######################################-----GET and POST user information-----######################################


@app.get("/user", tags=["user"])
async def get_users() -> dict:
    return usersEntity(conn.blog.users.find())


@app.post("/user", tags=["user"])
async def add_user(user: dict) -> dict:
    users.append(user)
    user_exists = False
    
    # Checks if an email exists from the collection of users
    if conn.blog.users.find({'email': user['email']}).count() > 0:
        user_exists = True
        print("User Exists")
        activeuser = conn.blog.users.find({'email': user['email']})
        for actuser in activeuser:
            actuser = dict(actuser)
            # Converted the user ObjectId to str! so this can be stored into a session(how login works)
            actuser['_id'] = str(actuser['_id'])      
        return actuser['_id']

    # If the email doesn't exist, create the user
    elif user_exists == False:
        conn.blog.users.insert_one(user)
        print("User Created")
        activeuser = conn.blog.users.find({'email': user['email']})
        for actuser in activeuser:
            actuser = dict(actuser)
            # Converted the user ObjectId to str! so this can be stored into a session(how login works)
            actuser['_id'] = str(actuser['_id'])      
        return actuser['_id']

######################################-----GET and POST video information-----######################################

def get_user_email(id):
    activeuser = conn.blog.users.find()
    activeuser_id=""
    for actuser in activeuser:
        actuser = dict(actuser)
        # Converted the user ObjectId to str! so this can be stored into a session(how login works)
        activeuser_id= str(actuser['_id'])
        if activeuser_id == id:
            return actuser['email']
         
    return ""


@app.get("/video", tags=["video"])
async def get_video() -> dict:
    return videosEntity(conn.blog.videos.find())



@app.post("/videoPath")
async def create_upload_file(file: UploadFile = File(...)):

    media = 'C:/Users/Asma/Desktop/Projects/CREstimator_website/frontend/src/components/videos/'+file.filename
    with open(media, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # print(contact_rate)
    return {'C:/Users/Asma/Desktop/Projects/CREstimator_website/frontend/src/components/videos/'+file.filename}


@app.post("/video", tags=["video"])
async def add_video(video: dict) -> dict:
    videos.append(video)
    print(video['duration'])
    totalPeople,average, contact_rate, output_path,figurePath,coverPic = estimate_contact_rate(video['path'][0],video['name'],video['duration'], weights,config,classes)
    video["outputVideoPath"]=output_path
    video["contactRate"]=contact_rate
    video["average"]=average
    video["totalPeople"]=totalPeople
    video["coverPic"]=coverPic
    video["figurePath"]=figurePath
    print(video)
    conn.blog.videos.insert_one(dict(video))
    
    if  video["sendEmail"]:
        email=get_user_email(video["userId"])
        print(email)
        sendEmail(email)
   
    return dict(video)



@app.get("/card", tags=["card"])
async def get_cards() -> dict:
    n=videosEntity(conn.blog.videos.find())
    m=[]
    for x in n:
        if x['publish']:
            m.append(x)
            print(x)
    #print(m)
    return m


@app.get("/title", tags=["title"])
async def get_title() -> dict:
    n=videosEntity(conn.blog.videos.find())
    m=[]
    for x in n:
        m.append(x["name"])
    return m


@app.get("/countries", tags=["countries"])
async def get_countries() -> dict:
    n=conn.blog.videos.distinct("country")
    item = ["country"]

    m=[]
    for x in n:
        j=[]
        j.append(x)
        country_dictionary = dict(zip(item, j))
        m.append(country_dictionary)
      
    return m
    
@app.post("/contact")
async def send_email_contact(formMessege: dict) -> dict:

    print(formMessege)
    msg="""\
Subject: Contact Us messege

The sender: {} ,\nThe content: {}""".format(formMessege['email'],formMessege['message']) 

    server.sendmail("crestimator.website@gmail.com","crestimator.website@gmail.com",msg)
    return {'status':'success'}
