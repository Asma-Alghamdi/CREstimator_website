import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardOutlinedIcon from "@material-ui/icons/ArrowForwardOutlined";
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

export default class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      errors: {},
    };
    this.handlefnameChange = this.handlefnameChange.bind(this);
    this.handlelnameChange = this.handlelnameChange.bind(this);
    this.handleemailChange = this.handleemailChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }
  ////////////////////////////////////////// Handle the changes //////////////////////////////////////////
  handlefnameChange(e) {
    this.setState({
      fname: e.target.value,
    });
  }

  handlelnameChange(e) {
    this.setState({
      lname: e.target.value,
    });
  }

  handleemailChange(e) {
    this.setState({
      email: e.target.value,
    });
  }

  ////////////////////////////////////////// Handle the validations //////////////////////////////////////////
  //Reference: https://stackoverflow.com/questions/41296668/reactjs-form-input-validation

  handleValidation() {
    let fname = this.state.fname;
    let lname = this.state.lname;
    let email = this.state.email;
    let errors = {};
    let formIsValid = true;

    //First Name
    if (fname === "") {
      formIsValid = false;
      errors["fname"] = "Cannot be empty";
    } else if (typeof fname !== "undefined") {
      fname = fname.trim();
      if (!fname.match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors["fname"] = "Only letters";
      }
    }

    //last Name
    if (lname === "") {
      formIsValid = false;
      errors["lname"] = "Cannot be empty";
    } else if (typeof fname !== "undefined") {
      lname = lname.trim();
      if (!lname.match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors["lname"] = "Only letters";
      }
    }

    //Email
    if (email === "") {
      formIsValid = false;
      errors["email"] = "Cannot be empty";
    } else if (typeof email !== "undefined") {
      email = email.trim();
      let lastAtPos = email.lastIndexOf("@");
      let lastDotPos = email.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          email.indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  ////////////////////////////// Pass data to the parent component & move to the next page //////////////////////////////
  sendData(counter) {
    this.props.parentCallback([
      this.state.fname,
      this.state.lname,
      this.state.email,
      counter,
    ]);
  }

  onClickNext() {
    if (this.handleValidation()) {
      this.sendData(1);
    }
  }

  ////////////////////////////// Rendering //////////////////////////////
  render() {
    return (
      <div style={{ padding: 40, margin: 40 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="subtitle1" gutterBottom>
              Add your personal information:
            </Typography>
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
            <Grid item xs={6} align="center">
              <CssTextField
                required
                fullWidth
                id="fname"
                label="First name"
                variant="outlined"
                onChange={this.handlefnameChange}
              />
              <span style={{ color: "red" }}>{this.state.errors["fname"]}</span>
            </Grid>

            <Grid item xs={6} align="center">
              <CssTextField
                required
                fullWidth
                id="lname"
                label="Last name"
                variant="outlined"
                onChange={this.handlelnameChange}
              />
              <span style={{ color: "red" }}>{this.state.errors["lname"]}</span>
            </Grid>
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
            <Grid item xs={12} align="center">
              <CssTextField
                required
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                onChange={this.handleemailChange}
              />
              <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} align="right">
          <IconButton
            aria-label="delete"
            size="medium"
            variant="contained"
            onClick={this.onClickNext}
            style={{
              color: "#004850",
              marginRight: 150,
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            <ArrowForwardOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Grid>
      </div>
    );
  }
}
