import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardOutlinedIcon from "@material-ui/icons/ArrowForwardOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip"; //The Tooltip is used to show the name should be unique for the user.  
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

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

export default class VideoName extends Component {
  axios = require("axios");
  constructor(props) {
    super(props);
    this.state = {
      video_title: "",
      video_path: "",
      titles: [],
      errors: {},
    };
    this.handlevideoNameChange = this.handlevideoNameChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickback = this.onClickback.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.getTitles = this.getTitles.bind(this);
    this.handleValidation = this.handleValidation.bind(this);

    this.getTitles();
  }

  ////////////////////////////////////////// Handle the changes //////////////////////////////////////////

  handlevideoNameChange(e) {
    this.setState({
      video_title: e.target.value,
    });
  }

  getInputValue(e) {
    this.setState({
      video_path: e.target.files[0],
    });
  }

  ////////////////////////////////////////// Get the exsist names from the database //////////////////////////////////////////

  getTitles() {
    axios.get("http://localhost:8000/title").then((res) => {
      const title = res.data;

      this.setState({
        titles: title,
      });
    });
  }

  ////////////////////////////////////////// Handle the validations //////////////////////////////////////////

  handleValidation() {
    let videoTitle = this.state.video_title;
    let videoPath = this.state.video_path;
    let titles = this.state.titles;
    let errors = {};
    let formIsValid = true;

    //Video Name
    if (videoTitle === "") {
      formIsValid = false;
      errors["title"] = "Cannot be empty";
    } else if (typeof videoTitle !== "undefined") {
      videoTitle = videoTitle.trim();
      //The name of video must start with letter.
      //The name of video can contain letters, numbers, spaces and underscore.
      //The name of the video must be unique.
      if (!videoTitle.match(/^[A-Za-z]+[A-Za-z0-9][A-Za-z0-9 _]*$/)) {
        formIsValid = false;
        errors["title"] =
          "There is an error in your name, please follow the instructions!";
      } else if (titles.indexOf(videoTitle) >= 0) {
        formIsValid = false;
        errors["title"] = "The name of the video exists, choose another name!";
      }
    }

    //Video Path
    if (videoPath === "") {
      formIsValid = false;
      errors["video"] = "Cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  ////////////////////////////// Pass data to the parent component & move to the next or previous page //////////////////////////////

  sendData(counter) {
    this.props.parentCallback([
      this.state.video_title,
      this.state.video_path,
      counter,
    ]);
  }

  onClickNext() {
    if (this.handleValidation()) {
      this.sendData(1);
    }
  }

  onClickback() {
    this.sendData(0);
  }
  ////////////////////////////// Rendering //////////////////////////////

  render() {
    return (
      <div style={{ padding: 40, margin: 40 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="subtitle1" gutterBottom>
              Upload your video along with its title:
            </Typography>
          </Grid>

          <Grid
            container
            item
            xs={12}
            spacing={1}
            justify="center"
            alignItems="center"
            style={{ marginTop: 12, marginLeft: 250, marginRight: 250 }}
          >
            <React.Fragment>
              <Grid item xs={10} align="center">
                <CssTextField
                  required
                  fullWidth
                  id="video_title"
                  label="video name"
                  variant="outlined"
                  onChange={this.handlevideoNameChange}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["title"]}
                </span>
              </Grid>
              <Tooltip title="Your video's title must be unique; if it isn't unique, the system will notify you.">
                <IconButton aria-label="delete">
                  <InfoOutlinedIcon fontSize="medium" />
                </IconButton>
              </Tooltip>

              <Grid
                item
                xs={12}
                justify="center"
                align="center"
                style={{ marginTop: 15 }}
              >
                <input
                  accept="video/*"
                  id="contained-button-file"
                  type="file"
                  onChange={this.getInputValue}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["video"]}
                </span>
              </Grid>
            </React.Fragment>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          spacing={1}
          style={{
            marginTop: 30,
            marginBottom: 30,
            paddingRight: 140,
            paddingLeft: 130,
          }}
        >
          <React.Fragment>
            <Grid item xs={6} align="left">
              <IconButton
                aria-label="delete"
                size="medium"
                variant="contained"
                onClick={this.onClickback}
                style={{
                  color: "#004850",
                }}
              >
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Grid>

            <Grid item xs={6} align="right">
              <IconButton
                aria-label="delete"
                size="medium"
                variant="contained"
                onClick={this.onClickNext}
                style={{
                  color: "#004850",
                }}
              >
                <ArrowForwardOutlinedIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </React.Fragment>
        </Grid>
      </div>
    );
  }
}

