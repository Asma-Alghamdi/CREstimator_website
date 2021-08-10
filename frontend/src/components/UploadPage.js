import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import StepperDemo from "./Stepper"
import crowd from "./images/crowd.png";
import information from "./images/information.png";
import resolation from "./images/resolation.png";
import duration from "./images/duration.png";


export default class UploadPage extends Component {


  render() {
    
    return (
      <div style={{ padding: 40, margin: 40 }}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <div style={{ padding: 40, margin: 40 }}>
            <div style={{ paddingBottom: 20, color: "#FFFFFF" }}>
              <Grid item xs={12} align="center">
                <Typography
                  className="font-weight-bold"
                  component="h4"
                  variant="h4"
                >
                  VIDEO SPECIFICATIONS
                </Typography>
              </Grid>
            </div>

            <Grid container item xs={12} spacing={3}>
              <React.Fragment>
                <Grid item xs={3} align="center">
                  <img
                    src={duration}
                    alt="duration"
                    width="100 px"
                    height="100 px"
                  />
                </Grid>
                <Grid item xs={3} align="center">
                  <img
                    src={resolation}
                    alt="resolation"
                    width="100 px"
                    height="100 px"
                  />
                </Grid>
                <Grid item xs={3} align="center">
                  <img
                    src={information}
                    alt="information"
                    width="100 px"
                    height="100 px"
                  />
                </Grid>
                <Grid item xs={3} align="center">
                  <img src={crowd} alt="crowd" width="100 px" height="100 px" />
                </Grid>
              </React.Fragment>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <React.Fragment>
                <Grid item xs={3} align="center">
                  <h4 style={{ color: "#FFFFFF" }}>DURATION</h4>
                </Grid>
                <Grid item xs={3} align="center">
                  <h4 style={{ color: "#FFFFFF" }}>QUALITY</h4>
                </Grid>
                <Grid item xs={3} align="center">
                  <h4 style={{ color: "#FFFFFF" }}>INFORMATION</h4>
                </Grid>
                <Grid item xs={3} align="center">
                  <h4 style={{ color: "#FFFFFF" }}>CROWD TYPE</h4>
                </Grid>
              </React.Fragment>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <React.Fragment>
                <Grid item xs={3} align="center" style={{ color: "#FFFFFF" }}>
                  The video should be 15 min or more
                </Grid>
                <Grid item xs={3} align="center" style={{ color: "#FFFFFF" }}>
                  360p, 480p, 720p quality
                </Grid>
                <Grid item xs={3} align="center" style={{ color: "#FFFFFF" }}>
                  Provide the required information
                </Grid>
                <Grid item xs={3} align="center" style={{ color: "#FFFFFF" }}>
                  Spares crowd type is accepted
                </Grid>
              </React.Fragment>
            </Grid>
          </div>
        </Grid>

        <Grid  align="center">
        
        <StepperDemo/>  
        </Grid>
      </div>
    );
  }
}
