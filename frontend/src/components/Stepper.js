import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Stepper from "react-stepper-horizontal";
import PersonalInfo from "./PersonalInfo";
import VideoName from "./VideoName";
import VideoInfo from "./VideoInfo";


export default class StepperDemo extends Component {
  axios = require("axios");
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      fname: "",
      personalInfo: [],
      videoname: [],
      videoInfo: [],
    };
    this.incCurrent = this.incCurrent.bind(this);
    this.decCurrent = this.decCurrent.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
  }

  //Increase the current step by 1.
  incCurrent() {
    this.setState({
      currentStep: this.state.currentStep + 1,
    });
  }

  //Decrease the current step by 1. 
  decCurrent() {
    this.setState({
      currentStep: this.state.currentStep - 1,
    });
  }

  //Present the content of each step
  getStepContent(activeStep) {
    switch (activeStep) {
      case 0:
        return (
          //Pass data from the child component (PersonalInfo) to the parent component (Stepper).
          <PersonalInfo parentCallback={this.callbackFunction}></PersonalInfo>
        );
      case 1:
        //Pass data from the child component (VideoName) to the parent component (Stepper).
        return <VideoName parentCallback={this.callbackFunction}></VideoName>;
      case 2:
        //Pass data from the parent component (Stepper) to the child component (VideoInfo).
        return (
          <VideoInfo>
            dataParentToChild ={[this.state.videoname, this.state.personalInfo]}
          </VideoInfo>
        );
      default:
        return <p></p>;
    }
  }

  //Store the passed data from children components into its state. Also, update the current state. 
  callbackFunction = (childData) => {
    let currentStep = this.state.currentStep;

    switch (currentStep) {
      case 0:
        if (childData[childData.length - 1] === 1) {
          this.incCurrent();
        } else {
          this.decCurrent();
        }
        return this.setState({ personalInfo: childData });
      case 1:
        if (childData[childData.length - 1] === 1) {
          this.incCurrent();
        } else {
          this.decCurrent();
        }
        return this.setState({ videoname: childData });
      case 2:
        if (childData[childData.length - 1] === 1) {
          this.incCurrent();
        } else {
          this.decCurrent();
        }

        return this.setState({ videoInfo: childData });
      default:
        return "Unknown step";
    }
  };

  render() {
    //The "activeStep" variable stores the value of the current step.
    let activeStep = this.state.currentStep;

    //Show the Stepper
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          border: "1px solid black",
          borderRadius: "20px",
        }}
      >
        <Stepper
          activeStep={activeStep} /*Active step index, starts at 0 */
          steps={[
            { title: "User Information" },
            { title: "Video Uploading" },
            { title: "Video Information" },
          ]} /*List of steps titles*/
          activeColor="#FFD966" /*Active circle color*/
          completeColor="#0097A7" /*Completed circle color*/
          defaultColor="#0097A7" /*Default circle color - not active or completed*/
          size={40} /*Circle size*/
          circleFontSize={20} /*Circle text size*/
          titleFontSize={18} /*	Title text size */
          circleTop={20} /* Top margin of Stepper component */
          titleTop={18} /* Space between circle and title */
          activeBorderColor="#FFD966" /* Color of border surrounding active circle */
          lineMarginOffset={20} /* Offset for line margin */
          defaultBorderWidth={10} /* Default Border Width */
        />

        <Typography>{this.getStepContent(activeStep)}</Typography>
      </div>
    );
  }
}



