import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";
const bcrypt = require('bcrypt-nodejs');

class SignUp extends Component {
  constructor(props){
    super(props);
    this.routeChange=this.routeChange.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleChange2=this.handleChange2.bind(this);
    this.test=this.test.bind(this);
    this.state={
	password:""
    }
  }

  handleChange(event) {
   this.setState({email: event.target.value});
 }
 handleChange2(event) {
  this.setState({password: event.target.value});
}

  routeChange(value){
    if (value.target.id=="Back"){
        this.props.history.push("/",this.props.history.location.state);
  }
  else if(value.target.id=="Home"){
    this.props.history.push("/home",this.props.history.location.state);
  }
}

test(){
  var secureCheck = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  if(this.state.password.match(secureCheck)){
    var user={
      email:this.state.email,
      password:bcrypt.hashSync(this.state.password)
    }
    //console.log(user);
    var url="/api/signup";
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
    .then(query_result => this.setState({query:[[{email:this.state.email}],[]],SignStatus:query_result},()=> console.log(query_result)));
  }
  else{
   alert("Password must have 7 to 15 characters and contain at least one numeric digit and a special character");
  }

}


  render(){
    console.log("Sign Status",this.state.SignStatus)

    if (this.state.SignStatus === "Unconfirmed User Added"){
  	     this.props.history.push("/confirm2");
    }

    else if (this.state.SignStatus === "Duplicate Email"){
  	  this.state.SignStatus = "";
		    alert("Email Is Currently In Use")
    }
    var color = "white";
    if(this.state.password == null || this.state.password.length == 0){
      color = "white";
    }
    else if(this.state.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)){
      color = "green";
    }
    else{
      color = "red"
    }
    var styleAttr = {borderBottom:"2px solid "+color}
    var passwordInput = <input style = {styleAttr} onChange={this.handleChange2} className= "FormField_Input_LS" placeholder= "Create a Password" type="Password" name="Password" />

    var leftarrow = "\u2190"
    return(
    <>
    <div className = "CenterWrapper">
      <div className= "HeaderInfo" id="TitleTextSignUp">
      Sign Up!
      </div>

      <div className = "FormWrap">

        <div className="FormField">
          <input onChange={this.handleChange} className= "FormField_Input_LS" placeholder= "Email" type="text" name="Email" />
        </div>

        <div className="FormField">
		{passwordInput}
        </div>

        <Button className="Button" id="Back" onClick={this.routeChange}>{leftarrow}</Button>
        <Button onClick={this.test} className= "Button" id = "SignButton">Note-ify Me! </Button>

      </div>
    </div>
    </>
    );
  }

}
export default withRouter(SignUp);
