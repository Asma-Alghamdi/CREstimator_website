import React from "react";
import { Card } from "react-bootstrap";
import { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import "./crestimator_website.css";
import {
  withStyles,
} from '@material-ui/core/styles';


//Specific design for the textField
const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: "#000000",
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: "#FFFFFF",
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '',
      },
      '&:hover fieldset': {
        borderColor: '#FFFFFF',
      },
      '&.Mui-focused fieldset': {
        borderColor: "#FFFFFF",
      },
    },
  },
})(TextField);



export default class Cards extends Component {
 
  axios = require("axios");
  constructor(props) {
    super(props);
    this.state = {
      cardsInfo: [],
      countries: [],
      settings: [{ setting: "Public Place" }, { setting: "Mass Gathering" }],
      customCard: [],
      option: "",
      option2: "",
    };

    this.renderCard = this.renderCard.bind(this);
    this.getDatasets = this.getDatasets.bind(this);
    this.getCountries = this.getCountries.bind(this);
    this.handleCountryOption = this.handleCountryOption.bind(this);
    this.handleSettingOption = this.handleSettingOption.bind(this);
    this.getContect = this.getContect.bind(this);
    this.getDatasets();
    this.getCountries();
  }


//Render the datasets page as cards by retrieving the main information for each card. 
//(The main info are: the name of the video, the place where taken, the setting and the cover picture)
  renderCard(card, index) {
    const coverPicture = card.coverPic
    const logo = require(`./output/${coverPicture}`).default; 
 
    return (
      <Card key={index} className="box">
        <Card.Img className="bodyImg" variant="top" src={logo} />
        <Card.Body className="bodytext">
          <Card.Title>{card.name}</Card.Title>
          <Card.Text>{card.Placename}</Card.Text>
          <Card.Text>{card.setting}</Card.Text>
          <Link
            to={{
              pathname: "/CardInfo",
              state: card,
            }}
            style={{ textDecoration: "none" }}
            className="buttonStyle"
          >
            Show
          </Link>
        </Card.Body>
      </Card>
    );
  }

//Get the information of the cards
  getDatasets() {
    axios.get("http://localhost:8000/card").then((res) => {
      const cardInfo = res.data;
      this.setState({
        cardsInfo: cardInfo,
      });
    });
  }

//Get the existed countries
  getCountries() {
    axios.get("http://localhost:8000/countries").then((res) => {
      const country = res.data;
      console.log(country);
      this.setState({
        countries: country,
      });
    });
  }

  //handle the changes
  handleCountryOption(e) {
    this.setState({
      option: e.currentTarget.innerText,
    });
  }

  handleSettingOption(e) {
    this.setState({
      option2: e.currentTarget.innerText,
    });
  }

  //Get the content of page (the cards)
  getContect(e, e2) {
    const t = this.state.cardsInfo;
    if (e === "" && e2 === "") {
      return t.map(this.renderCard);
    } else if (e !== "" && e2 === "") {
      return t.filter((person) => person.country === e).map(this.renderCard);
    } else if (e === "" && e2 !== "") {
      return t.filter((person) => person.setting === e2).map(this.renderCard);
    } else if (e !== "" && e2 !== "") {
      return t
        .filter((person) => person.country === e)
        .filter((person) => person.setting === e2)
        .map(this.renderCard);
    }
  }

  render() {
    const countriesOptions = this.state.countries;
    const settingsOptions = this.state.settings;
    const selectedCountries = this.state.option;
    const selectedSettings = this.state.option2;
    

    return (
      <div style={{ padding: 60, margin: 40 }} className="rowC">
        <Grid container direction="column" spacing={1}>
          <Grid item xs={4}>
            <div style={{ paddingRight: 2 }} className="fillterPosisition">
            <Grid item xs={3} align="left">
                  <h3 style={{ color: "#EEEEEE", marginBottom: "30px" }}>FILTERS</h3>
                </Grid>
                <label style={{ color: '#FFFFFF'}} >Filter by country:</label>
              <Autocomplete
                id="combo-box-demo1"
                options={countriesOptions}
                getOptionLabel={(option) => option.country}
                style={{ width: 250, marginBottom: 17, marginTop: 5, backgroundColor: '#FFFFFF', borderRadius: 5}}
                onInputChange={this.handleCountryOption}
                renderInput={(params) => (
                  <CssTextField {...params}  variant="outlined" />
                )}
              />
              <label style={{ color: '#FFFFFF'}} >Filter by setting:</label>
              <Autocomplete
                id="combo-box-demo2"
                options={settingsOptions}
                getOptionLabel={(option) => option.setting}
                style={{ width: 250, marginBottom: 12, marginTop:5, backgroundColor: '#FFFFFF', borderRadius: 5 }}
                onInputChange={this.handleSettingOption}
                renderInput={(params) => (
                  <CssTextField {...params}  variant="outlined" hight />
                )}
              />

              
            </div>
          </Grid>
          <div className="grid">{this.getContect(selectedCountries, selectedSettings)}</div>
        </Grid>
      </div>
    );
  }
}


