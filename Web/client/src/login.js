import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";

const bcrypt = require('bcrypt-nodejs');


class Login extends Component {
  constructor(props){
    super(props);
    this.routeChange=this.routeChange.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleChange2=this.handleChange2.bind(this);
    this.verify=this.verify.bind(this);
    this.test=this.test.bind(this);

    this.state={
      login_toggle : false
      }
  }

  handleChange(event) {
   this.setState({email: event.target.value});
 }
 handleChange2(event) {
  if(event.target.value == null){
    this.setState({password:""});
  }
  else{
    this.setState({password: event.target.value});
  }

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
  //console.log(this.state);
  if(this.state.email!=null){
    var user={
      email:this.state.email,
    }
    //console.log(user);
    var url="/api/loginToVerify";
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
    .then(query_result => this.setState({query:query_result},() => this.verify()));
 }
 else{
  alert("Invalid Email or Password");
 }

}

verify(){
  if(this.state.query === "No User By That Email"){
      alert("Not Valid Email");
  }
  else if(this.state.query == null){
	this.props.history.push("/error");
  }
  else{
    var email = this.state.query[0].email
    var secured = this.state.query[0].PW
    if(bcrypt.compareSync(this.state.password,secured)){
      var user={
        email:email
      }
      //console.log(user);
      var url="/api/getUserArtists";
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
      .then(query_result => this.setState({query:[[{email:this.state.email}],query_result],login_toggle:true},()=> console.log("login success")));
    }
    else{
      alert("Invalid Password")
    }
  }
}


  render(){
    if (this.state!=null){
      if (this.state.query != null){
        if(this.state.query.length > 0 && this.state.login_toggle){// you can login
            this.props.history.push("/profile",this.state.query);
        }
      }
    }

    var leftarrow = "\u2190"

    return(
      <>
        <div className = "CenterWrapper">
          <div className= "HeaderInfo" id="TitleTextSignUp">
          Login!
          </div>

          <form className= "FormFields">

            <div className="FormField">
              <input onChange={this.handleChange} className= "FormField_Input_LS" placeholder= "Email" type="text" name="Email" />
            </div>

            <div className="FormField">
              <input onChange={this.handleChange2} className= "FormField_Input_LS" placeholder= "Password" type="Password" name="Password" />
            </div>

            <Button className="Button" id="Back" onClick={this.routeChange}>{leftarrow}</Button>
            <Button onClick={this.test} className= "Button" id = "SignButton" >Login </Button>

          </form>
        </div>

      </>
    );
  }

}
export default withRouter(Login);
