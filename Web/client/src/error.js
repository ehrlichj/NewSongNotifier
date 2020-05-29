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
		ERROR
    </>
    );
  }

}
export default withRouter(error);
