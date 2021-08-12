# CREstimator website

This repository contains the code of our graduation project. It is a system called Contact Rate Estimator (CREstimator) to provide the public health authorities and epidemic modelling researchers with the value of contact rate. CREstimator provides two services for the target users. The first service allows the user to upload their video and add information about it, such as the location name, the date in which the video was taken, the setting type, and the event name. Then the system estimates the value of the contact rate for this video based on image processing algorithms. Also, the system gives the user option to publish their data on the website. Additionally, the user can receive a notification when the process is done. The second service provides a library of videos and their information and the estimated value of the contact rate. The user can search about the value of the contact rate for a specific place and filter the results. The following figure shows the conceptual model of the CREstimator system. 


![Conceptual Model of CREstimator System](https://user-images.githubusercontent.com/85047564/129221349-e4d087f5-8cec-4c30-b005-ba95338f6784.png)*Conceptual Model of CREstimator System.*

## Demo
To see a demo of the CREstimator website, click on the image!

[![The demo of the CREstimator website](https://user-images.githubusercontent.com/85047564/129220437-c4449376-6c93-45c2-8cc9-2b30dcad67a5.png)](https://youtu.be/gpTlLaBJQLI)

## The Requirments
This website was created by integrating FastAPI, MongoDB, and React JS. I'll show you the used versions of each tool as well as the required packages!

**for the backend:**

The used version of Python is ***( Python 3.7.6 )***

The used version of MongoDB is ***( db version v4.4.6 )***

To install the required packages, in your *Command-line*:
1. cd to the directory of the project.
2. run: `pip install -r requirements.txt` in your shell.

**for the frontend:**

The used version of Node.js is ***(v14.16.0)***

The required packages for the project are:
```
  npm install --save react-router-dom
  npm install @material-ui/core
  npm install @material-ui/icons
  npm install @material-ui/lab
  npm install axios --save
  npm install --save react-loading-screen
  npm install react-select-country-list --save
  npm install react-stepper-horizontal --save
  npm install react-bootstrap bootstrap
```

## Run

**To run the server:**
1. cd to the project directory.
2. cd backend directory. 
3. run: `python main.py` in your shell.

**To run the interface**:
1. cd to the project directory.
2. cd frontend directory. 
3. run: `npm start` in your shell.

