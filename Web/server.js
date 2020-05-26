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
  spotifyApi.searchArtists(artist_name, function(ret){
  console.log("the return is ",ret);
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
  var email = req.body.email

  db.query(sql_query_string,[artist_name], function(err,result){
    if(err) throw err;
    if(result.length == 0){
      res.json("check spotify");
      res.end();
    }
    else{
      CheckInsertUserArtist(email,result[0].aid);
    }
  })
  function CheckInsertUserArtist(email,aid){
    var sql_query_string = "SELECT * FROM Music_App.User_Artist WHERE email = ? AND aid = ?"
    db.query(sql_query_string, [email,aid], function (err, result){
      if(err) throw err;
      if(result.length == 0){
          InsertUserArtist(email,aid);
      }
      else{
        res.json("User has already added this artist")
        res.end()
      }
    })
    function InsertUserArtist(email,aid){
      var sql_query_string = "INSERT INTO Music_App.User_Artist VALUES (?,?)";
      db.query(sql_query_string,[email,aid], function(err,result){
        if(err) throw err;
        if(result.length == 0){
          res.json("check spotify");
          res.end();
        }
        else{
          CheckInsertUserArtist(email,result[0].aid);
        }
      })
      res.json("Successfuly Updated");
      res.end();
    }
  }
})


app.post('/api/userArtistSubmission', function(req,res){
  var email = req.body.email;
  var artist_id = req.body.artist_id;
  var artist_name = req.body.artist_name

  var sql_query_string = "INSERT INTO Music_App.Artists VALUES (?,?,?)";
  db.query(sql_query_string, [artist_id,artist_name,null], function (err, result){
    if(err) throw err;
    InsertUserArtist(email,artist_id);
  });
  function InsertUserArtist(email,aid){
    console.log("here");
    var sql_query_string = "INSERT INTO Music_App.User_Artist VALUES (?,?)";
    db.query(sql_query_string, [email,aid], function (err, result){
      if(err) throw err;
      res.json("Successfuly Updated");
      res.end();
    });
  }
})

const port = 5000;

app.listen(port,()=> console.log("port 5000"));
