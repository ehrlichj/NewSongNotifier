import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";

class error extends Component {
  constructor(props){
    super(props);
  this.handleRouteChange = this.handleRouteChange.bind(this);
}

handleRouteChange(event){
	console.log(event.target);
	if(event.target.id === "Home"){
		this.props.history.push("/");
	}
}

  render(){
    return(
    <>
	<div className= "HeaderInfo">An email has been sent, please confirm.</div>
    </>
    );
  }

}
export default withRouter(error);
