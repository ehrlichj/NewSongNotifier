import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
const bcrypt = require('bcrypt-nodejs');

class SignUp extends Component {
  constructor(props){
    super(props);
    this.routeChange=this.routeChange.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleChange2=this.handleChange2.bind(this);
    this.test=this.test.bind(this);
    this.state={
      name:"",
      switcher:true
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
  console.log(this.state);
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
  .then(user => this.setState({name:user},()=> console.log("success",user)));
}


  render(){
    return(
      <>
      <div className= "FormTitle" id="TitleTextSignUp">
      Sign Up!
      </div>

    <center>
    <form className= "FormFields">

    <div className="FormField">
      <label className= "FormField_Label" >Username </label>
      <input onChange={this.handleChange} className= "FormField_Input" placeholder= "Create a Username" type="text" name="Email" />
    </div>

    <div className="FormField">
      <label className= "FormField_Label">Password </label>
      <input onChange={this.handleChange2} className= "FormField_Input" placeholder= "Create a Password" type="Password" name="Password" />
    </div>

        <Button onClick={this.test} className= "Buttons" >Sign Up </Button>
        <Button className="Buttons" id="Back" onClick={this.routeChange}>Back</Button>
    </form>
</center>


      </>
    );
  }

}
export default withRouter(SignUp);
