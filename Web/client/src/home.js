import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
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
        <div className= "FormTitle" id="TitleTextSignUp">
          The Home Page
        </div>
        <Button id = "Login"   onClick={this.routeChange}>Login</Button>
        <Button id = "Sign Up" onClick={this.routeChange}>Sign Up</Button>
      </>
    );
  }

}
export default withRouter(Home);
