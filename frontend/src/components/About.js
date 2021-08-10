import React, { Component } from "react";
import Logo from "./images/linebigwhite@4x.png";
import ConceptualModel from "./images/Conceptual model.png";
import AIModel from "./images/AIModel.png"
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Profile from "./images/Profile.png";

export default class About extends Component {
  render() {
    return (
      <div style={{ padding: 0, margin: 0 }}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={12} align="center">
            <img
              src={Logo}
              width="30%"
              height="100%"
              alt="Logo"
              style={{ paddingTop: 150, paddingBottom: 5 }}
            />
          </Grid>

          <Grid item xs={8} align="center">
            <div style={{ paddingBottom: 40 }}>
              <p align="center" style={{ fontSize: 20, color: "#EEEEEE" }}>
                {" "}
                <em>
                  CREstimator ( Contact Rate Estimator ) is an open-source tool
                  for estimating contact rates from videos using image
                  processing and deep learning algorithms.{" "}
                </em>
              </p>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            align="center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
          >
            <Grid item xs={12} align="center">
              <Typography
                className="font-weight-bold"
                color="text.secondary"
                component="h4"
                variant="h4"
                style={{ fontSize: 30 }}
              >
                <div style={{ paddingTop: 15 }}>
                  <p
                    style={{ color: "#4D3C3C", fontFamily: "Times New Roman" }}
                  >
                    OUR SERVICES
                  </p>{" "}
                </div>
              </Typography>
            </Grid>

            <Grid item xs={11} align="center">
              <div style={{ paddingBottom: 20 }}>
                <p align="center" style={{ fontSize: 20, color: "#4D3C3C" }}>
                  {" "}
                  CREstimator provides two services for the target users. The
                  first service allows the user to upload their video and add
                  information about it. The second service provides a library of
                  videos and their information and the estimated value for the
                  contact rate.{" "}
                </p>
              </div>
            </Grid>

            <Grid item xs={12} align="center">
              <img
                src={ConceptualModel}
                width="60%"
                height="100%"
                alt="Conceptual Model"
                style={{ paddingBottom: 10 }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} align="center">
            <Grid item xs={12} align="center">
              <Typography
                className="font-weight-bold"
                color="text.secondary"
                component="h4"
                variant="h4"
                style={{ fontSize: 30 }}
              >
                <div style={{ paddingTop: 15 }}>
                  <p
                    style={{ color: "#EEEEEE", fontFamily: "Times New Roman" }}
                  >
                    OUR SOLUTION
                  </p>{" "}
                </div>
              </Typography>
            </Grid>

            <Grid item xs={11} align="center">
              <div style={{ paddingBottom: 20 }}>
                <p align="center" style={{ fontSize: 20, color: "#EEEEEE" }}>
                  {" "}
                  Contact rate value estimated based on the Artificial
                  Intelligence (AI) model that worked on four steps. These steps
                  started with detecting individual humans from video frames,
                  then tracking those individuals throughout all the video
                  frames. After that, calculate the distance between each
                  individual and all the other individuals in the video frame.
                  Finally, estimate the average number of contacts in the video.{" "}
                </p>
              </div>
            </Grid>

            <Grid item xs={12} align="center">
              <img
                src={AIModel}
                width="60%"
                height="100%"
                alt="Conceptual Model"
                style={{ paddingBottom: 20 }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            align="center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
          >
          <Grid item xs={12} align="center">
            <Typography
              className="font-weight-bold"
              color="text.secondary"
              component="h4"
              variant="h4"
              style={{ fontSize: 30 }}
            >
              <div style={{ paddingTop: 15, paddingBottom: 15 }}>
                <p  style={{ color: "#4D3C3C", fontFamily: "Times New Roman" }}>OUR TEAM</p>{" "}
              </div>
            </Typography>
          </Grid>

          <Grid
            container
            item
            xs={8}
            spacing={3}
            justify="center"
            alignItems="center"
          >
            <React.Fragment>
              <Grid item xs={3} align="center">
                <img
                  src={Profile}
                  alt="duration"
                  width="100 px"
                  height="100 px"
                />
              </Grid>
              <Grid item xs={3} align="center">
                <img
                  src={Profile}
                  alt="resolation"
                  width="100 px"
                  height="100 px"
                />
              </Grid>
              <Grid item xs={3} align="center">
                <img
                  src={Profile}
                  alt="information"
                  width="100 px"
                  height="100 px"
                />
              </Grid>
            </React.Fragment>
          </Grid>
          <Grid
            container
            item
            xs={8}
            spacing={3}
            justify="center"
            alignItems="center"
          >
            <React.Fragment>
              <Grid item xs={3} align="center">
                <h4 style={{ color: "#595959",  fontFamily: "Times New Roman", fontSize: 25  }}>Asma Alghamdi</h4>
              </Grid>
              <Grid item xs={3} align="center">
                <h4 style={{ color: "#595959" ,  fontFamily: "Times New Roman", fontSize: 25  }}>Suha Bako</h4>
              </Grid>
              <Grid item xs={3} align="center">
                <h4 style={{ color: "#595959" ,  fontFamily: "Times New Roman", fontSize: 25  }}>Zahra Al Safwan</h4>
              </Grid>
            </React.Fragment>
          </Grid>
          <Grid
            container
            item
            xs={8}
            spacing={3}
            justify="center"
            alignItems="center"
            style={{ paddingBottom: 70 }}
          >
            <React.Fragment>
              <Grid item xs={3} align="center" style={{ color: "#595959" }}>
                Computer Science
              </Grid>
              <Grid item xs={3} align="center" style={{ color: "#595959" }}>
                Computer Science
              </Grid>
              <Grid item xs={3} align="center" style={{ color: "#595959" }}>
                Computer Science
              </Grid>
            </React.Fragment>
          </Grid>
        </Grid>
        </Grid>
      </div>
    );
  }
}
