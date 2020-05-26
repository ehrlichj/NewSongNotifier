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
    this.checkLocalArtistID=this.checkLocalArtistID.bind(this);
    this.addUserArtist=this.addUserArtist.bind(this);
    this.checkSpotify = this.checkSpotify.bind(this);
    this.checkDuplicate = this.checkDuplicate.bind(this);
    this.UpdateArtistOnPage = this.UpdateArtistOnPage.bind(this);
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

checkDuplicate(){
  var user={
    email: this.state.email,
    artist_name : this.state.artist_to_add,
    artist_id : this.state.Spotify_Artist_ID_status
  }
  var url = "/api/userArtistSubmission"
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
  .then(result => this.setState({Spotify_Artist_ID_status:result},this.UpdateArtistOnPage()));
}

UpdateArtistOnPage(){
// must mutate array outside of set state then setState with new array
  var current_artists = this.state.artists;
  current_artists.push({artist_name:this.state.artist_to_add})
  this.setState({artists:current_artists});
  //to prevent reset on refresh, just update props with new state and send it
  //where it already is, that way refresh reverts to updated state
  this.props.history.push("/profile",this.props.history.location.state);
}

addUserArtist(){
  if(this.state.Spotify_Artist_ID_status !== "artist not found."){
    var user={
      email: this.state.email,
      artist_name : this.state.artist_to_add,
      artist_id : this.state.Spotify_Artist_ID_status
    }
    var url = "/api/userArtistSubmission"
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
    .then(result => this.setState({Spotify_Artist_ID_status:result},this.UpdateArtistOnPage()));
  }
  else{
    alert("artist not found.");
  }


}

checkSpotify(){
  if(this.state.Artist_ID_status === "check spotify"){
    var user={
      artist_name : this.state.artist_to_add
    }
    var url = "/api/getArtistID"
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
    .then(result => this.setState({Spotify_Artist_ID_status:result},()=> this.addUserArtist()));
  }
  else if(this.state.Artist_ID_status === "User has already added this artist"){
    alert("You already subscribe to this artist");
  }
  else{
    this.setState({},()=>this.UpdateArtistOnPage());
  }

}

checkLocalArtistID(){
  console.log("status 1",this.state.Artist_ID_status);
  var user={
    email:this.state.email,
    artist_name : this.state.artist_to_add
  }
  var url = "/api/checkLocalArtists"
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
  .then(result => this.setState({Artist_ID_status:result},()=> this.checkSpotify()));
}


  render(){
    var email = this.state.email
    var artists = this.state.artists
    //console.log("the state is",this.state);
    var all_artists_string = ""
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
            <input onChange={this.handleChange} className= "FormField_Input" placeholder= "Create a Username" type="text" name="artist" />
          </div>

          <Button onClick={this.checkLocalArtistID} className= "Buttons" >Add </Button>
          <Button className="Buttons" id="Back" onClick={this.routeChange}>Back</Button>
        </form>
      </center>

      </>
    );
  }

}
export default withRouter(Profile);
