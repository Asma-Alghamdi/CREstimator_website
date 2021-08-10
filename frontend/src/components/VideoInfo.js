import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "axios";
import countryList from "react-select-country-list";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import LoadingScreen from "react-loading-screen";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles } from "@material-ui/core/styles";

//Specific design for the text field
const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#4D3C3C",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#4D3C3C",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "",
      },
      "&:hover fieldset": {
        borderColor: "#595959",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4D3C3C",
      },
    },
  },
})(TextField);

export default class VideoInfo extends Component {
  axios = require("axios");
  defaultDuration = 15;
  options = countryList().getData();
  settings = [{ setting: "Public Place" }, { setting: "Mass Gathering" }];

  constructor(props) {
    super(props);
    this.state = {
      Placename: "",
      setting: "select",
      country: "select",
      duration: this.defaultDuration,
      date: "2021-07-25",
      sendEmail: true,
      publish: true,
      personalInfo: this.props.children[1][1],
      videoname: this.props.children[1][0],
      errors: {},
      loadig: false,
      Result: false,
      vedioResult: "",
    };

    this.handlePlacenameChange = this.handlePlacenameChange.bind(this);
    this.handlesettingChange = this.handlesettingChange.bind(this);
    this.handlecountryChange = this.handlecountryChange.bind(this);
    this.handledurationChange = this.handledurationChange.bind(this);
    this.handledateChange = this.handledateChange.bind(this);
    this.handlesendEmailChange = this.handlesendEmailChange.bind(this);
    this.handlepublishChange = this.handlepublishChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.onClickEstimate = this.onClickEstimate.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleOptionSelects = this.handleOptionSelects.bind(this);
  }

  ////////////////////////////////////////// Handle the changes //////////////////////////////////////////

  handlePlacenameChange(e) {
    this.setState({
      Placename: e.target.value,
    });
  }

  handlesettingChange(e) {
    const inputValue = e;

    this.setState({
      setting: inputValue.label,
    });
    let t = this.state.country;
    console.log(inputValue, t);
    return inputValue;
  }
  
  handledurationChange(e) {
    this.setState({
      duration: e.target.value,
    });
  }

  handledateChange(e) {
    this.setState({
      date: e.target.value,
    });
  }

  handlecountryChange(e) {
    console.log(e.currentTarget.innerText);
    this.setState({
      country: e.currentTarget.innerText,
    });
  }

  handlesendEmailChange() {
    this.setState({
      sendEmail: !this.state.sendEmail,
    });
  }

  handlepublishChange() {
    this.setState({
      publish: !this.state.publish,
    });
  }

  handleOptionSelects(e) {
    this.setState({
      setting: e.currentTarget.innerText,
    });
  }
  
  ////////////////////////////////////////// Handle the validations //////////////////////////////////////////

  handleValidation() {
    let Placename = this.state.Placename;
    let setting = this.state.setting;
    let country = this.state.country;
    let date = this.state.date;
    let errors = {};
    let formIsValid = true;

    //Place Name
    if (Placename === "") {
      formIsValid = false;
      errors["Placename"] = "Cannot be empty";
    } else if (typeof Placename !== "undefined") {
      Placename = Placename.trim();
      //The name of place must start with letter.
      //The name of place can contain letters, numbers, spaces and underscore.
      if (!Placename.match(/^[A-Za-z]+[A-Za-z0-9][A-Za-z0-9 _ -]*$/)) {
        formIsValid = false;
        errors["Placename"] =
          "There is an error in the place name, please try again!";
      }
    }

    //Setting
    if (setting === "select") {
      formIsValid = false;
      errors["setting"] = "Cannot be empty";
    }

    //Country
    if (country === "select") {
      formIsValid = false;
      errors["country"] = "Cannot be empty";
    }

    //Date
    if (date === "") {
      formIsValid = false;
      errors["date"] = "Cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  ////////////////////////////// Move to the previous page //////////////////////////////

  sendData(counter) {
    this.props.parentCallback([
      this.state.Placename,
      this.state.setting,
      this.state.country,
      this.state.duration,
      this.state.date,
      this.state.sendEmail,
      this.state.publish,
      counter,
    ]);
  }

  onClickBack() {
    //this.sendData(0);
  }

  ////////////////////////////// Store data in the database //////////////////////////////
  onClickEstimate() {
    
    if (this.handleValidation()) {
      this.setState({
        loadig: true,
      });
      ////////////////////////Send user information/////////////////////
      var userId = 0;
      let user = {
        fname: this.state.personalInfo[0],
        lname: this.state.personalInfo[1],
        email: this.state.personalInfo[2],
      };
      console.log(user);
      axios.post("http://localhost:8000/user", user).then(
        (response) => {
          userId = response.data;
          console.log(userId);
        },
        (error) => {
          console.log(error);
        }
      );

      ////////////////////////Send video information/////////////////////
      let fileData = new FormData();
      fileData.append("file", this.state.videoname[1]);
      console.log(this.state.videoname[1]);
      var path = "no file";

      axios.post("http://localhost:8000/videoPath", fileData).then(
        (response) => {
          path = response.data;
          console.log(path);
          let video = {
            name: this.state.videoname[0],
            path: path,
            Placename: this.state.Placename,
            setting: this.state.setting,
            country: this.state.country,
            //city: this.state.city,
            duration: this.state.duration,
            date: this.state.date,
            sendEmail: this.state.sendEmail,
            publish: this.state.publish,
            outputVideoPath: "",
            contactRate: 0,
            average: 0,
            userId: userId,
          };

          console.log(video);
          axios.post("http://localhost:8000/video", video).then(
            (response) => {
              const r = response.data;
              console.log(r);
              this.setState({
                vedioResult: r,
                loading: false,
                Result: true,
              });
              console.log("testing...");
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  ////////////////////////////// Rendering //////////////////////////////
  render() {
    let checkLoading = this.state.loadig;
    let checkResult = this.state.Result;
    const settingsOptions = this.settings;
    return (
      <>
        {checkLoading ? (
          [
            checkResult ? (
              <Redirect
                to={{
                  pathname: "/Result",
                  state: this.state.vedioResult,
                }}
              />
            ) : (
              <LoadingScreen
                loading={true}
                bgColor="#004850e7"
                spinnerColor="#EEEEEE"
                textColor="#EEEEEE"
                text="Your video is still processing..."
              />
            ),
          ]
        ) : (
          <div style={{ padding: 40, margin: 40 }}>
            <Grid container xs={12} spacing={1}>
              <Grid item xs={12} align="center">
                <Typography variant="subtitle1" gutterBottom  >
               Provide the following information about your video:
                </Typography>
              </Grid>

              <Grid
                container
                item
                xs={12}
                spacing={2}
                justify="center"
                alignItems="center"
                style={{ marginTop: 16, marginLeft: 250, marginRight: 250 }}
              >
                <React.Fragment>
                  <Grid item xs={12} align="center">
                    <CssTextField
                      required
                      id="Placename"
                      label="Place name"
                      variant="outlined"
                      placeholder="Madina Station, Al-andalus Mall, etc..."
                      onChange={this.handlePlacenameChange}
                      fullWidth
                      style={{
                        borderRadius: 5,
                      }}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["Placename"]}
                    </span>
                  </Grid>
                </React.Fragment>
              </Grid>

              <Grid
                container
                item
                xs={12}
                spacing={2}
                justify="center"
                alignItems="center"
                style={{ marginTop: 12, marginLeft: 250, marginRight: 250 }}
              >
                <React.Fragment>
                  <Grid item xs={6} align="center">
                    <Autocomplete
                      id="combo-box-demo3"
                      options={this.options}
                      getOptionLabel={(option) => option.label}
                      style={{
                        marginBottom: 12,
                        marginTop: 12,
                        borderRadius: 5,
                      }}
                      onInputChange={this.handlecountryChange}
                      renderInput={(params) => (
                        <CssTextField
                          {...params}
                          label="country"
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["country"]}
                    </span>
                  </Grid>
                  <Grid item xs={6} align="center">
                    <Autocomplete
                      id="combo-box-demo2"
                      options={settingsOptions}
                      getOptionLabel={(option) => option.setting}
                      style={{
                        marginBottom: 12,
                        marginTop: 12,
                        borderRadius: 5,
                      }}
                      onInputChange={this.handleOptionSelects}
                      renderInput={(params) => (
                        <CssTextField
                          {...params}
                          label="Setting"
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["setting"]}
                    </span>
                  </Grid>
                </React.Fragment>
              </Grid>

              <Grid
                container
                item
                xs={12}
                spacing={2}
                justify="center"
                alignItems="center"
                style={{ marginTop: 12, marginLeft: 250, marginRight: 250 }}
              >
                <React.Fragment>
                  <Grid item xs={6} align="center">
                    <CssTextField
                      required
                      id="duration"
                      label="Duration (in seconds)"
                      variant="outlined"
                      type="number"
                      onChange={this.handledurationChange}
                      defaultValue={this.defaultDuration}
                      fullWidth
                      inputProps={{
                        min: 1,
                        style: { textAlign: "center", fontSize: 16 },
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} align="center">
                    <CssTextField
                      required
                      id="date"
                      type="Date"
                      variant="outlined"
                      label="Date of video"
                      defaultValue="2021-07-17"
                      fullWidth
                      onChange={this.handledateChange}
                      inputProps={{
                        min: 1,
                        style: { textAlign: "center", fontSize: 16 },
                      }}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["date"]}
                    </span>
                  </Grid>
                </React.Fragment>
              </Grid>

              <Grid
                container
                item
                xs={12}
                spacing={1}
                justify="center"
                alignItems="center"
                style={{ marginTop: 12, marginLeft: 200, marginRight: 200 }}
              >
                <React.Fragment>
                  <Grid item xs={12} align="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.sendEmail}
                          onChange={this.handlesendEmailChange}
                          name="sendEmail"
                        />
                      }
                      label="Send me an email when the processing ends"
                    />
                  </Grid>

                  <Grid item xs={12} align="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.publish}
                          onChange={this.handlepublishChange}
                          name="publish"
                        />
                      }
                      label="Allow publishing my results in the website datasets"
                    />
                  </Grid>
                </React.Fragment>
              </Grid>

              <Grid item xs={12} align="center">
                <IconButton
                  aria-label="delete"
                  size="medium"
                  variant="contained"
                  onClick={this.onClickBack}
                  style={{
                    color: "#004850",
                    marginRight: 950,
                    marginTop: 30,
                    marginBottom: 30,
                  }}
                >
                  <ArrowBackIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>

            <Button
              color="rgb(255, 255, 255)"
              variant="contained"
              onClick={this.onClickEstimate}
              style={{
                marginBottom: 10,
                width: 200,
                padding: 10,
                border: "1px solid wight",
                borderRadius: "10px",
              }}
            >
              Estimate
            </Button>
          </div>
        )}
      </>
    );
  }
}

