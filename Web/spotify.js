var request = require('request');
const express = require("express")
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');
var client_id = '10d822d62dff407987d136dede85caac';
var client_secret = 'b22cf3d5fb5947cea703555ba49a3afc';
var redirectURL = 'http://localhost:5000';
//var token = 'BQBf1HI3qWJ4VNEU-B79SIO2s-1n6Kq9frr3G56FMct5jt2KKgEVMRL3H3x1uSYHc1Np5F-5yvQF7Xy0JWI';


function searchArtists(artistName){
    var spotifyApi = new SpotifyWebApi({
            clientId: client_id,
            clientSecret: client_secret,
            redirectUri: redirectURL
        });
    
        spotifyApi.clientCredentialsGrant().then(
            function(data) {    
              // Save the access token so that it's used in future calls
              //console.log(data.;
              spotifyApi.setAccessToken(data.body.access_token);
              spotifyApi.searchArtists(artistName).then(
                  function(data){
                      //console.log(data.body.artists.items[0]);
                      return data.body.artists.items[0].external_urls.id;
                  }, function(err){
                      console.error(err);
                  })
            },
            function(err) {
              console.log('Something went wrong when retrieving an access token', err);
            }
          );
    }

 function mostRecentRelease(artistID){
    //const id =  searchArtists(artistName);
    //console.log(id);

    var spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirectURL
    });
    spotifyApi.clientCredentialsGrant().then(
        function(data) {    
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body.access_token);
          //console.log(id)
          spotifyApi.getArtistAlbums(artistID).then(
            function(data){
               // console.log("Artist Name: ", data.body.artists.name);
                console.log("Most Recent Album Name", data.body.items[0].name);
                console.log("Release Date", data.body.items[0].release_date);
            },
            function(err){
                console.log(err);
            }
        )
        },
        function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        }
      );
}

mostRecentRelease("3qm84nBOXUEQ2vnTfUTTFC");

