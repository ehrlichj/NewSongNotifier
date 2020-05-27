var request = require('request');
const express = require("express")
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');
var client_id = '10d822d62dff407987d136dede85caac';
var client_secret = 'b22cf3d5fb5947cea703555ba49a3afc';
var redirectURL = 'http://localhost:5000';


function searchArtists(artistName, callback){
    //console.log("The artist is ",artistName);
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
              //console.log(spotifyApi.getAccessToken())
              spotifyApi.searchArtists(artistName).then(
                  function(data){
                      //console.log(data.body.artists.items[0]);
                      //console.log(data.body.artists.items[0].id);
                      //console.log(data.body.artists.items[0].id);
                      if (data.body.artists.total == 0){
                        callback("");
                      }
                      else{
                        callback(data.body.artists.items[0].id);
                      }

                  }, function(err){
                      console.error("oh boy",err);
                  })
            },
            function(err) {
              console.log('Something went wrong when retrieving an access token', err);
            }
          );
    }

 function mostRecentRelease(artistID, callback){
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
                var albums = data.body.items;
                var d1=Date.parse("0000-01-01");
                var d2=Date.parse("0000-01-01");
                var album_num = 0;
                for(var i =0; i<albums.length; i++){
                    var d1 = Date.parse(albums[i].release_date);
                    if(d1 > d2){
                        d2 = d1;
                        album_num = i;
                    }
                }
                //console.log(d2.toString());
                //console.log("Most Recent Album Name", data.body.items[album_num].name);
                //console.log(data.body);
                //console.log("Release Date", data.body.items[album_num].release_date);
                //return data.body.items[album_num];
                console.log(data.body.items[album_num]);
                callback(data.body.items[album_num]);
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
//searchArtists("Picture This", () => console.log("finished"));

//mostRecentRelease('7jLSEPYCYQ5ssWU3BICqrW', () => console.log("hello there"));

module.exports = {searchArtists, mostRecentRelease};
