import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";

class error extends Component {
  constructor(props){
    super(props);
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
