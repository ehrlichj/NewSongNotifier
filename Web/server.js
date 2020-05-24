const express = require("express");
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
import * as spotifyApi from './spotify.js';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.timeout = 0;

// open the database

let db = mysql.createConnection({
  host: "newsongnotifier.c6rbpssqfeyd.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "adminMusic",
  port: 3304
});

db.connect(function(err){
  if(err) throw err;
  console.log("conneted!");
});

app.post('/api/signup', function(req, res){

  var sql_query_string = "INSERT INTO Music_App.User VALUES (?,?)";

  var email = req.body.email
  var password = req.body.password

  db.query(sql_query_string, [email,password], function (err, result) {
    if (err) throw err;
    res.json(result);
    res.end()
  });

});

app.post('/api/login', function(req, res){
  var sql_query_string = "SELECT U.email \
                          FROM Music_App.User U \
                          WHERE U.email = ? AND U.PW = ?";

  var email = req.body.email
  var password = req.body.password

  db.query(sql_query_string, [email,password], function (err, result) {
    if (err) throw err;
    //res.json(result);
    //res.end();
    console.log("the backend says",result);

    if (result.length == 0){
      res.json("failed")
      res.end()
    }

    else{
      artistCheck(result)
    }

  });
  function artistCheck(query_result){
    var sql_query_string = "SELECT artist_name \
                            FROM Music_App.User_Artist UA, Music_App.Artists A \
                            WHERE UA.email = ? AND UA.aid = A.aid";

    var raw_email = query_result[0].email;
    db.query(sql_query_string, [raw_email], function (err, result) {
      if (err) throw err;

      if (result.length == 0){
        res.json([query_result,"no artists"])
      }

      else{
        res.json([query_result,result]);
      }
      res.end()
    });
  }

});

app.post('/api/userArtistSubmission', function(req,res){
  var sql_query_string = "SELECT aid\
                          FROM Music_App.Artists A \
                          WHERE A.artist_name = ?  ";

  var artist_name = req.body.artist_name;
  var email = req.body.email;

  db.query(sql_query_string,[artist_name], function(err,result){
    if(err) throw err;
    console.log("the backend says: ", result);

    //artist does not exist in Artists table must get artist_id from spotify.
    if(result.length == 0){
      var artist_id = spotifyApi.searchArtists(artist_name);
      var release_date = spotifyApi.mostRecentRelease(artist_id).release_date;
      insertArtist(artist_id, artist_name, release_date);
      insertUserArtist(email, artist_id);
    }
    else{ //artist does exist in the Artists table. Insert new row into User_Artists.
      insertUserArtist(email, result[0].aid);
    }
  });
  function insertArtist(artist_id, artist_name, release_date){
    var sql_query_string = "INSERT INTO Music_App.Artists (?, ?, ?)";
    
    db.query(sql_query_string, [artist_id, artist_name, release_date], function(err,result){
      if(err) throw err;
      console.log("succesfully inserted new Artist");
    })
  }

  function insertUserArtist(email, artist_id){
    var sql_query_string = "INSERT INTO Music.App.User_Artist (?,?)";

    db.query(sql_query_string, [email, artist_id], function(err, result){
      if(err) throw err;
      console.log("succesfully inserted new User_Artist");
    })
  }
})
//db.end();

const port = 5000;

app.listen(port,()=> console.log("port 5000"));
