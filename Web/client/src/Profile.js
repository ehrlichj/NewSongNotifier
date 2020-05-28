import React,{Component} from "react";
import {Button} from "reactstrap";
import {withRouter} from "react-router-dom";
import "./css/GlobalCSS.css";
//import Dropdown from 'react-dropdown';
import { Dropdown, DropdownMenu } from 'reactstrap';

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
    this.toggle = this.toggle.bind(this);

    this.state={
      email:this.props.location.state[0][0].email,
      artists:this.props.location.state[1],
      dropdownOpen:false,
      value:"Your Artists"
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

UpdateArtistOnPage(){
  //console.log("the state before refresh",this.state);
// must mutate array outside of set state then setState with new array
  var current_artists = this.state.artists;
  current_artists.push({artist_name:this.state.True_Artist_Name})
  this.setState({artists:current_artists});
  this.setState({Artist_ID_status:""});
  this.setState({Spotify_Artist_ID_status:""});

  //to prevent reset on refresh, just update props with new state and send it
  //where it already is, that way refresh reverts to updated state
  this.props.history.push("/profile",this.props.history.location.state);
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
    .then(result => this.setState({Spotify_Artist_ID_status:result},this.UpdateArtistOnPage()));
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
  .then(result => this.setState({Artist_ID_status:result},()=> this.checkSpotify()));
}


  render(){
    var email = this.state.email
    //console.log("the state is",this.state);
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

        <DropdownMenu>
          <div className = "ArtistsDisplayWrapper">
            {this.state.artists.map(artists =>
              <div className = "ArtistDisplayElement">{artists.artist_name}</div>
            )}
          </div>
        </DropdownMenu>
    </Dropdown>

    return(
      <>
      <div className= "HeaderInfo" id="ProfileInfo">
        Hey! {email}<br></br>
      </div>

        <form className= "FormFields">
          <div className="FormField">
            <input onChange={this.handleChange} className= "FormField_Input" placeholder= "Artist Name" type="text" name="artist" />
            <Button onClick={this.checkLocalArtistID} className= "Button" >Add </Button>
          </div>
          {dropdown}
          <br/>
          An email will be sent to you at the email above when your artist releases new music.
        </form>

      </>
    );
  }

}
export default withRouter(Profile);
