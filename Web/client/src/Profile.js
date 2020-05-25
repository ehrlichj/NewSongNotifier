import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";
const bcrypt = require('bcrypt-nodejs');


class Profile extends Component {
  constructor(props){
    super(props);
    this.routeChange=this.routeChange.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.test=this.test.bind(this);
    this.state={
      email:this.props.location.state[0][0].email,
      artists:this.props.location.state[1]
    }

  }

  handleChange(event) {
   this.setState({artist_to_add: event.target.value});
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
  var user={
    email:this.state.email,
    artist_name : this.state.artist_to_add
  }
  //console.log(user);
  var url="/api/userArtistSubmission";
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
  .then(result => this.setState({didItWork:result},()=> console.log("fin")));
}


  render(){
    console.log("prof state says",this.props.location.state)
    var email = this.state.email
    var artists = this.state.artists
    var all_artists_string = ""

    console.log(artists)
    if (artists === "no artists" || artists.length == 0){ // from signup it returns a blank array,
                                                          // from query or login it returns the string
                                                          // no artists :(
      all_artists_string = "You are not following any artists"
    }

    else{
      all_artists_string = "Your current artists are: "
      for(var i = 0;i < artists.length;i++){
        all_artists_string += artists[i].artist_name
        if(i != artists.length -1){
          all_artists_string += ", "
        }
      }
    }

    return(
      <>
      <div className= "HeaderInfo" id="ProfileInfo">
        Profile for {email}<br></br>
        {all_artists_string}
      </div>

      <center>
        <form className= "FormFields">

          <div className="FormField">
            <label className= "FormField_Label" > Artist to Add: </label>
            <input onChange={this.handleChange} className= "FormField_Input" placeholder= "Create a Username" type="text" name="Email" />
          </div>

          <Button onClick={this.test} className= "Buttons" >Add </Button>
          <Button className="Buttons" id="Back" onClick={this.routeChange}>Back</Button>
        </form>
      </center>

      </>
    );
  }

}
export default withRouter(Profile);
