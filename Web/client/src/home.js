import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";
const bcrypt = require('bcrypt-nodejs');

class Home extends Component {
  constructor(props){
    super(props);
    this.routeChange=this.routeChange.bind(this);
    this.state={}
  }

  routeChange(value){
    if (value.target.id == "Login"){
        this.props.history.push("/login",this.props.history.location.state);
      }

    else if(value.target.id == "Sign Up"){
      this.props.history.push("/signup",this.props.history.location.state);
    }

  }

  render(){
    return(
      <>
        <center>
        <div className= "HeaderInfo" id = "TitleTextSignUp">
          Note-ify
        </div>
        <div className = "buttonsDiv">
        <Button id = "Login"   className = "Button" onClick={this.routeChange}>Login</Button>
        <Button id = "Sign Up" className = "Button" onClick={this.routeChange}>Sign Up</Button>
        </div>
        </center>
      </>
    );
  }

}
export default withRouter(Home);
