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
	<div className= "HeaderInfo">This page will be used to confirm emails</div>
	<a href="https://www.google.com/search?q=covid+19+cases+meme&tbm=isch&ved=2ahUKEwjioOCq7qzqAhVYjOAKHfXmA5gQ2-cCegQIABAA&oq=covid+19+cases+meme&gs_lcp=CgNpbWcQAzICCAAyBggAEAUQHjoECCMQJzoHCAAQsQMQQzoFCAAQsQM6BggAEAoQGDoGCAAQCBAeOgQIABAYUIO2A1jOzQNg388DaAFwAHgAgAFIiAHqBZIBAjEymAEAoAEBqgELZ3dzLXdpei1pbWc&sclient=img&ei=6-38XqL_A9iYggf1zY_ACQ&bih=801&biw=1533#imgrc=d608ZrMT-ggD0M">Heres a meme link for now</a>
	<br></br>
	<br></br>
	<button id = "Home" className = "Button" onClick = {this.handleRouteChange}>Home</button>
    </>
    );
  }

}
export default withRouter(error);
