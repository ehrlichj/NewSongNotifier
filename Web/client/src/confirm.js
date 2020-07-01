import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";

class error extends Component {
  constructor(props){
    super(props);
  this.handleRouteChange = this.handleRouteChange.bind(this);
  this.confirmUser = this.confirmUser.bind(this);
  this.state = {confirmBool:true}
}

handleRouteChange(event){
	console.log(event.target);
	if(event.target.id === "Home"){
		this.props.history.push("/");
	}
}

confirmUser(){
  var url="/api/emailConfirmed";
  var email = window.location.href;
  var questionmarkIndex = 0;
  for(var i = 0;i<email.length;i++){
    if (email[i] === "?"){
      questionmarkIndex = i;
    }
  }

  email = email.slice(questionmarkIndex+7,email.length);
  console.log("the email is",email);
  var user = {email:email}
  const req = new Request(url,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(user),
  });
  fetch(req)
  .then((res)=>{
    if(res.status===500){
    res.json()
    .then((json)=>{
        const {message,stackTrace}=json;
      })
      .catch((error)=>{
        return Promise.reject(error);
      });
    }
    else{
      return res.json();
    }
  })
  .then(() => this.setState({confirmBool:false}));

}

  render(){
    if(this.state.confirmBool){
      this.confirmUser()
    }
    return(
    <>
	<div className= "HeaderInfo">Your Email Has Been Confirmed, Please Log In</div>
	<button id = "Home" className = "Button" onClick = {this.handleRouteChange}>Home</button>
    </>
    );
  }

}
export default withRouter(error);
