const express = require("express");
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const spotifyApi = require('./spotify.js');


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

app.post('/api/loginToVerify', function(req, res){
  var sql_query_string = "SELECT * \
                          FROM Music_App.User U \
                          WHERE U.email = ?";

  var email = req.body.email

  db.query(sql_query_string, [email], function (err, result) {
    if (err) throw err;
    //res.json(result);
    //res.end();
    if (result.length == 0){
      res.json("No User By That Email")
      res.end()
    }

    else{
      res.json(result);
    }
  });
});

app.post('/api/loginToGetArist', function(req, res){
  var sql_query_string = "SELECT artist_name \
                          FROM Music_App.User_Artist UA, Music_App.Artists A \
                          WHERE UA.email = ? AND UA.aid = A.aid";

  var email = req.body.email

  db.query(sql_query_string, [email], function (err, result) {
    if (err) throw err;
    if (result.length == 0){
      res.json("no artists")
      res.end()
    }

    else{
      res.json(result)
    }

  });
});
app.post('/api/getArtistID', function(req,res){
  var artist_name = req.body.artist_name;
  //console.log(artist_name);



  console.log("hello");

  spotifyApi.searchArtists(artist_name, function(ret){
    console.log("DKLFJDLKF", ret);
    if(ret.length == 0){
      res.json("artist not found.");
    }
    else{
      res.json(ret);
    }
    res.end();
  });

})

app.post('/api/checkLocalArtists', function(req,res){
  var sql_query_string = "SELECT aid \
                          FROM Music_App.Artists A \
                          WHERE A.artist_name = ? ";
  var artist_name = req.body.artist_name;

  db.query(sql_query_string,[artist_name], function(err,result){
    if(err) throw err;
    console.log("the backend says: ", result);
    if(result.length == 0){
      res.json("check spotify");
    }
    else{
      res.json(result);
    }
    res.end();
  })
})


app.post('/api/userArtistSubmission', function(req,res){
  var email = req.body.email;
  var artist_id = req.body.artist_id;

  var sql_query_string = "INSERT INTO Music_App.User_Artist(?,?)";


  db.query(sql_query_string, [email,artist_id], function (err, result){
    if(err) throw err;
    res.json("artist succesfully added");
    res.end();
  });
  
})
//db.end();

const port = 5000;

app.listen(port,()=> console.log("port 5000"));
