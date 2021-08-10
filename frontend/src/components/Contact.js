import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import contact from "./images/contact.png";
import "./crestimator_website.css";
import axios from 'axios';

export default class Contact extends Component{
    constructor(props){
       super(props); 
       this.state = {
        name: '',
        email: '',
        message: ''
      }
    }

    //Handle the changes
    onNameChange(event) {
        this.setState({name: event.target.value})
      }
    
      onEmailChange(event) {
        this.setState({email: event.target.value})
      }
    
      onMessageChange(event) {
        this.setState({message: event.target.value})
      }

      //Submit the form
      handleSubmit(e){
        console.log(this.state);
        e.preventDefault();
        axios({
          method: "POST",
          url:"http://localhost:8000/contact",
          data:  this.state
        }).then((response)=>{
          if (response.data.status === 'success') {
            alert("Message Sent.");
            this.resetForm()
          } else if (response.data.status === 'fail') {
            alert("Message failed to send.")
          }
        })
      }

      //Reset the form
      resetForm(){
        this.setState({name: '', email: '', message: ''})
      }

    
    render(){
       return( 

        <div style={{ padding: 40, margin:40 }}>
       <Grid container spacing={1} justify="center" alignItems="center">

       <Grid item xs={6}>
                
                    
                    <div style={{ padding: 40}}>
                    <img src={contact} width="80%" height="100%" alt="Logo"  />
                    </div>
                   
                </Grid>

           <Grid item xs={6} >
            <div className="App" style={{ padding: 40}}>
            <div >
                    <p className="font-weight-bold" style={{fontSize: 30, color: "#EEEEEE"}}>CONTACT US</p>
                    <p style={{fontSize: 20, color: "#EEEEEE"}}>We are welcome your suggestions and questions!</p>
                    </div>
            <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">

                <div className="form-group">
                <label style={{fontSize: 18, color: "#EEEEEE"}} htmlFor="name">Name</label>
                <input type="text" className="form-control" value={this.state.name} onChange={this.onNameChange.bind(this)} />
                </div>

                <div className="form-group">
                <label style={{fontSize: 18, color: "#EEEEEE"}} htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" aria-describedby="emailHelp" value={this.state.email} onChange={this.onEmailChange.bind(this)} />
                </div>

                <div className="form-group">
                <label style={{fontSize: 18, color: "#EEEEEE"}} htmlFor="message">Message</label>
                <textarea className="form-control" rows="5" value={this.state.message} onChange={this.onMessageChange.bind(this)} />
                </div>

                <button type="submit" className="btn btn-primary" >Send</button>
            </form>
            </div>
     </Grid>
     </Grid>
     </div>
     );
    }
}