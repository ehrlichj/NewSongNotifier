import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";
//import Dropdown from 'react-dropdown';
import { Dropdown, DropdownMenu } from 'reactstrap';

import spotifylogo from "./spotify-logo-png-7078.png";

import 'react-dropdown/style.css';
const bcrypt = require('bcrypt-nodejs');


class Profile extends Component {
    constructor(props){
    super(props);
    this.routeChange = this.routeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkLocalArtistID = this.checkLocalArtistID.bind(this);
    this.addUserArtist = this.addUserArtist.bind(this);
    this.checkSpotify = this.checkSpotify.bind(this);
    this.checkDuplicate = this.checkDuplicate.bind(this);
    this.UpdateArtistOnPage = this.UpdateArtistOnPage.bind(this);
    this.UpdateArtistOnPageRemove = this.UpdateArtistOnPageRemove.bind(this);
    this.beginRemove = this.beginRemove.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.playSample = this.playSample.bind(this);
    this.setUserArtists = this.setUserArtists.bind(this);
    this.toggle = this.toggle.bind(this);
    this.ForPrint = this.ForPrint.bind(this);
    if(this.props.location.state == null || this.props.location.state[0] == null || this.props.location.state[0][0] == null || this.props.location.state[1] == null  ){
	this.props.history.push("/error");
}
    this.state={
      email:this.props.location.state[0][0].email,
      artists:this.props.location.state[1],
      dropdownOpen:false,
      value:"Your Artists",
    }

  }

handleChange(event) {
   this.setState({artist_to_add: event.target.value});
 }

playSample(event,aid) {
  event.preventDefault();
  var user={
    artist_id:aid,
  }
  var url = "/api/getPlayerTracks"
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
  .then(result => this.setState({track:result}));
 }

  routeChange(value){
    if (value.target.id=="Back"){
        this.props.history.push("/",this.props.history.location.state);
    }
    else if(value.target.id=="Home"){
      this.props.history.push("/home",this.props.history.location.state);
    }
}

handleRemove(){
  if (this.state.Remove_Status === "Not subscribed to artist"){
    alert("Artist Queued For Deletion, Please Login In Again");
  }
  else if(this.state.Remove_Status === "Successfully removed"){
    this.UpdateArtistOnPageRemove();
  }
}



beginRemove(event,artist){
  event.preventDefault();
  var user={
    email: this.state.email,
    artist_name : artist//this.state.artist_to_add
  }
  var url = "/api/removeUserArtist"
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
  .then(result => this.setState({Remove_Status:result[0],artist_to_remove:result[1]},()=>this.handleRemove()));
}


toggle(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      value: event.currentTarget.textContent
    });
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

setUserArtists(){
  var user={
    email: this.state.email,
  }
  var url = "/api/getUserArtists"
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
  .then(result => this.setState({artists:result},()=>this.ForPrint()));
}

ForPrint(){
	console.log("for print says",this.state.artists)
	this.props.history.push("/profile",[[{email:this.state.email}],this.state.artists])
}

UpdateArtistOnPage(){
  if(this.state.Spotify_Artist_ID_status === "User has already added this artist"){
    alert("Already subscribed to this artist")
  }

  else if(this.state.Spotify_Artist_ID_status == null){
    this.props.history.push("/error")
  }

  else{
    this.setState({Artist_ID_status:"",Remove_Status:""},()=>this.setUserArtists());
  }
}

UpdateArtistOnPageRemove(){
  this.setState({artist_to_remove:"",Remove_Status:""},()=>this.setUserArtists());
}


addUserArtist(){
  if(this.state.Spotify_Artist_ID_status !== "artist not found."){
    var user={
      email: this.state.email,
      artist_name : this.state.True_Artist_Name,
      artist_id : this.state.Spotify_Artist_ID_status,
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
    .then(result => this.setState({Spotify_Artist_ID_status:result},()=>this.UpdateArtistOnPage()));
  }
  else{
    alert("artist not found.");
  }
}

checkSpotify(){
  //console.log("Artist ID status",this.state.Artist_ID_status);
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
    .then(result => this.setState({Spotify_Artist_ID_status:result[0],True_Artist_Name:result[1]},()=> this.addUserArtist()));
  }
  else if(this.state.Artist_ID_status === "User has already added this artist"){
    alert("You already subscribe to this artist");
  }
  else{
    this.setState({},()=>this.UpdateArtistOnPage());
  }

}

checkLocalArtistID(){
  //console.log("Artist to add",this.state.artist_to_add);
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
  .then(result => this.setState({Artist_ID_status:result[0],True_Artist_Name:result[1]},()=> this.checkSpotify()));
}


  render(){

    if (this.state.email == null || this.state.artists == null){
	this.props.history.push("/error");
    }

    else{
    var email = this.state.email
    var CurrentSong = ""
    console.log("render says",this.state.artists)

    if (this.state.track != null){
	var source = "https://open.spotify.com/embed/album/"+this.state.track
	CurrentSong = <iframe src={source} width="300" height="250" frameborder="0" allowtransparency="false" allow="encrypted-media"></iframe>
    }

    else{
	CurrentSong = <img className = "image" src = {spotifylogo}></img>
    }

    var MessageArrowDir = "Your Artitsts"

    if(this.state.dropdownOpen){
      MessageArrowDir += " \u25BC"
    }

    else{
      MessageArrowDir += " \u25B2"
    }

    var dropdown =

    <Dropdown isOpen={this.state.dropdownOpen}>
        <Button onClick={this.toggle} className = "FakeDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
        {MessageArrowDir}
        </Button>

        <DropdownMenu className = "DDM">
          <div className = "ArtistsDisplayWrapper">
            {this.state.artists.map(artists =>
		<div className = "ArtistLine">
			<span id = {artists.artist_name} className = "ArtistDisplayElement">{artists.artist_name}</span>
			<span className = "play">
				<button className = "playButton" onClick={(e) => {this.playSample(e,artists.aid)}}>Get Sample</button><button className = "removeButton" onClick = {(e)=>{this.beginRemove(e,artists.artist_name)}}>X</button>
			</span>
		</div>
            )}
          </div>
        </DropdownMenu>
    </Dropdown>
    }



    return(
      <div className = "ALL">
      <div className= "HeaderInfo" id="ProfileInfo">
        Hey! {email}<br></br>
      </div>

        <form className= "FormFields">
          <div className="FormField">
            <input onChange={this.handleChange} className= "FormField_Input" placeholder= "Artist Name" type="text" name="artist" />
            <span className = "play"><Button onClick={this.checkLocalArtistID} className= "Button" >Add </Button></span>
          </div>

        {dropdown}

	{CurrentSong}

          <br/>

          <text style = {{fontSize:12}}>An email will be sent to you at the email above when your artist releases new music.</text>

        </form>

      </div>
    );
  }

}
export default withRouter(Profile);
