import React, {Component} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import mainLogo from './images/Main.png';
import numberOne from './images/One.png';
import numberTwo from './images/Two.png';
import numberThree from './images/Three.png';
import numberFour from './images/4.png';
import Logo from './images/linebigwhite@4x.png';
import "./crestimator_website.css";

export default class HomePage extends Component{
    constructor(props){
       super(props); 
    }

    render(){
       return( 

        <div className="home" style={{ padding: 1 }}>
        <div class="container" >
        
          <div class="row align-items-center my-5" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", 
            
          }}>
                <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", marginTop: 100
            
          }}>
          <div class="col-lg-5 " >
              
              <img src={Logo} width="80%" height="100%" alt="Logo" style={{ marginBottom: 20}}  />
              <p style={{fontSize: 22, color: "#EEEEEE", marginBottom: "45px", marginRight: "18px", textAlign: "justify"}}>
                We provide you with the best estimations of contact rates for your simulation model with the use of up-to-date video processing technologies.
              </p>
              
              <Link  className="estimateButtonStyle" style={{ textDecoration: "none" ,fontSize: 20}} to="/UploadPage">
                 Estimate
                  </Link>
    
          </div>


          <div >
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src={mainLogo} width="400 px" height="400 px"
              alt="Contact Rate Figure"
            />
          </div>
          </div>


          <Grid container  direction="row" justify="center" alignItems="center"spacing={1}>
          <div style={{ padding: 40, margin:40 }}>

          <div   style={{ paddingBottom: 40, color: "#EEEEEE"}} >
          <Grid item xs={12} align="center" >
          <Typography className="font-weight-bold" component="h4" variant="h4" >
          HOW TO ESTIMATE THE CONTACT RATE?
          </Typography>
        </Grid>
        </div>

            <Grid container item xs={12} spacing={40}>
                  <React.Fragment>
              <Grid item xs={3} align="center">
              <img src={numberOne} alt="numberOne" width="90 px" height="100 px" />
              </Grid>
              <Grid item xs={3} align="center">
              <img src={numberTwo} alt="numberTwo" width="90 px" height="100 px" />
              </Grid>
              <Grid item xs={3} align="center">
              <img src={numberThree} alt="numberThree" width="90 px" height="100 px" />
              </Grid>
              <Grid item xs={3} align="center">
              <img src={numberFour} alt="numberFour" width="90 px" height="100 px" />
              </Grid>
            </React.Fragment>
            </Grid>
            <Grid container item xs={12} spacing={3}>
                  <React.Fragment>
              <Grid item xs={3} align="center" >
                <h4 style={{fontSize: 17, color: "#FFFBEE"}}>Click "Estimate" or "Upload" from Navigation bar</h4>
              </Grid>
              <Grid item xs={3} align="center" >
              <h4 style={{fontSize: 18, color: "#FFFBEE"}}>Read the video specifications</h4>
              </Grid>
              <Grid item xs={3} align="center" >
              <h4 style={{fontSize: 18, color: "#FFFBEE"}}>Fill information and Upload video</h4>
              </Grid>
              <Grid item xs={3} align="center">
              <h4 style={{fontSize: 18, color: "#FFFBEE"}}>Click "Estimate" to start estimating</h4>
              </Grid>
            </React.Fragment>
            </Grid>
          
            </div>
          </Grid>
 
        </div>
        
      </div>
    </div>

    
       
        );
    }
}