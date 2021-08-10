import React, {Component} from "react";
import {render} from "react-dom";
import Homepage from "./components/HomePage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import  Navigation from "./components/Navigation";
//import UploadPage from "./components/UploadPage";
//import  Cards from "./components/cards";
import Footer from "./components/Footer";
//import About from "./components/About";
//import Contact from "./components/Contact";
//import Result from "./components/Result";
//import CardInfo from "./components/CardInfo";
import './App.css';




export default class App extends Component{
  constructor(props){
     super(props); 
  }

  render(){
      return( <div className="App" >
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Homepage />} />
        </Switch>
        <Footer />
      </Router>

     
    </div>);
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);


/**
     
          <Route path="/UploadPage" exact component={() => <UploadPage />} />
          <Route path="/DatasetPage" exact component={() => <Cards />} />
          <Route path="/About" exact component={() => <About />} />
          <Route path="/Contact" exact component={() => <Contact />} />
          <Route path="/Result" exact component={() => <Result />} />
          <Route path="/CardInfo" exact component={() => <CardInfo />} />
       
 */