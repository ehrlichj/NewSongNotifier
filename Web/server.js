const express = require("express");
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const spotifyApi = require('./spotify.js');
const emailApi = require('./emailer.js')



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
  console.log("connected!");
});

function MinutesToMilleSeconds(min){
    return min*60*1000;
}

app.post('/api/getUserArtists', function(req, res){
  var sql_query_string = "SELECT A.aid,A.artist_name \
                          FROM Music_App.User_Artist UA, Music_App.Artists A \
                          WHERE UA.email = ? AND UA.aid = A.aid";

  var email = req.body.email

  db.query(sql_query_string, [email], function (err, result) {
    if (err) throw err;
    console.log("backend says",result);
    res.json(result);
  });
});

app.post('/api/signup', function(req, res){

  var email = req.body.email
  var password = req.body.password

  var sql_query_string = "SELECT * From Music_App.User WHERE email=?";

  db.query(sql_query_string, [email], function(err, result){
    if(err) throw err;
    console.log(result);
    if(result.length == 0){
      createNewUser(email,password)
    }
    else{
      res.json("Duplicate Email");
      res.end();
    }
  })

function createNewUser(email,password){
  var sql_query_string = "INSERT INTO Music_App.User VALUES (?,?)";

  db.query(sql_query_string, [email,password], function (err, result) {
    if (err) throw err;
    res.json("User Added");
    res.end()
  });
  }
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

/*
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
*/

app.post('/api/getArtistID', function(req,res){
  var artist_name = req.body.artist_name;
  //console.log("Searching for aid for",artist_name);
  spotifyApi.searchArtists(artist_name, function(ret){
  //console.log("the return is ",ret);
  if(ret.length == 0){
    res.json(["artist not found.","artist not found."]);
  }
  else{
    res.json(ret);
  }
  res.end();
});

})

app.post('/api/checkLocalArtists', function(req,res){
  var sql_query_string = "SELECT aid,artist_name \
                          FROM Music_App.Artists A \
                          WHERE A.artist_name = ? ";
  var artist_name = req.body.artist_name;
  var email = req.body.email

  db.query(sql_query_string,[artist_name], function(err,result){
    if(err) throw err;
    if(result.length == 0){
      res.json(["check spotify","check spotify"]);
      res.end();
    }
    else{
      CheckInsertUserArtist(email,result[0].aid,result[0].artist_name);
    }
  })
  function CheckInsertUserArtist(email,aid,artist_name){
    var sql_query_string = "SELECT * FROM Music_App.User_Artist WHERE email = ? AND aid = ?"
    db.query(sql_query_string, [email,aid], function (err, result){
      if(err) throw err;
      if(result.length == 0){
          InsertUserArtist(email,aid,artist_name);
      }
      else{
        res.json(["User has already added this artist","User has already added this artist"])
        res.end()
      }
    })
    function InsertUserArtist(email,aid,artist_name){
      var sql_query_string = "INSERT INTO Music_App.User_Artist VALUES (?,?)";
      db.query(sql_query_string,[email,aid], function(err,result){
        if(err) throw err;
        res.json(["Successfuly Updated",artist_name]);
        res.end();
      })
    }
  }
});


app.post('/api/userArtistSubmission', function(req,res){
  var email = req.body.email;
  var artist_id = req.body.artist_id;
  var artist_name = req.body.artist_name

  var sql_query_string = "SELECT * FROM Music_App.Artists WHERE aid = ?";
  db.query(sql_query_string, [artist_id,artist_name,null], function(err, result){
    if(err) throw err;
    if(result.length==0){
      InsertNewArtist(artist_id, artist_name)
    }
    else{
      InsertUserArtist(email, artist_id, function(ret){
        res.json(ret);
        res.end();
      });
    }
  })
  function InsertNewArtist(artist_id, artist_name){
    var sql_query_string = "INSERT INTO Music_App.Artists VALUES (?,?,?)";
    db.query(sql_query_string, [artist_id,artist_name,null], function (err, result){
      if(err) throw err;
      InsertUserArtist(email,artist_id, function(ret){
        res.json(ret);
        res.end();
      });
    });
  }
})


function InsertUserArtist(email,aid, callback){
  console.log("here");
  var sql_query_string = "INSERT INTO Music_App.User_Artist VALUES (?,?)";
  db.query(sql_query_string, [email,aid], function (err, result){
    if(err) throw err;
    callback("Successfuly Updated");
  });
}

setInterval(updateReleaseDates,MinutesToMilleSeconds(15));

function updateReleaseDates(){
  var sql_query_string = "SELECT aid, artist_name, last_album_uploaded_date FROM Music_App.Artists";
  db.query(sql_query_string, [], function(err, result){
    if (err) throw err;
    if(result.length ==0){
      console.log("there are no artists in the Artists Table");
    }
    else{
      for(var i=0; i<result.length; i++){
        getRecentReleaseDate(result[i].aid, result[i].last_album_uploaded_date, result[i].artist_name)
      }
    }
  })

  function getRecentReleaseDate(aid, db_release_date, artist_name){
    spotifyApi.mostRecentRelease(aid, function(ret){
      //console.log("the return is: " ,ret.release_date);
      updateRecentReleaseDate(aid, db_release_date, ret.release_date, artist_name);
    });
  }

  function updateRecentReleaseDate(artist_ID, db_release_date, spotify_release_date, artist_name){
    var db_rd = new Date(db_release_date)
    var db_rd_zoneOffset = db_rd.getTimezoneOffset() * 60 * 1000;
    db_rd = db_rd.getTime();
    var sp_rd = new Date(spotify_release_date)
    sp_rd = sp_rd.getTime();

    if(db_release_date == null){
      var sql_query_string = "UPDATE Music_App.Artists SET last_album_uploaded_date = ? WHERE aid = ?  ";
      db.query(sql_query_string, [spotify_release_date, artist_ID], function(err,result){
        if(err) throw err;
        })
    }

    else if(sp_rd > db_rd){
      //console.log("Updating Artist",artist_name);
      var sql_query_string = "UPDATE Music_App.Artists SET last_album_uploaded_date = ? WHERE aid = ?  ";
      db.query(sql_query_string, [spotify_release_date, artist_ID], function(err, result){
        if(err) throw err;
        sendUserEmail(artist_ID, artist_name);
      })
      function sendUserEmail(artist_ID, artist_name){
        var sql_query_string = "SELECT email FROM Music_App.User_Artist WHERE aid =?";
        db.query(sql_query_string, [artist_ID], function(err, result){
          if(err) throw err;
          if(result.length == 0){
            console.log("no one is following the artistID: ", artist_ID);
          }
          for(var i=0; i<result.length; i++){
           // console.log("send email to: ",result[i].email);
            emailApi.sendEmail(result[i].email, artist_name);
          }
        })
      }
    }
  }
}

app.post("/api/removeUserArtist",function(req, res){
  var email = req.body.email;
  var artist_name = req.body.artist_name;

  var sql_query_string = "SELECT aid, artist_name FROM Music_App.Artists WHERE artist_name = ?";
  db.query(sql_query_string, [artist_name], function(err, result){
    if(err) throw err;
    else{
      if(result.length == 0){
        res.json(["Not subscribed to artist", "Not subscribed to artist"]);
        res.end();
      }
      else{
        checkUserArtist(email, result[0].aid, result[0].artist_name);
        }
      }
    })
    function checkUserArtist(email, artist_id, artist_name){
      var sql_query_string = "SELECT email FROM Music_App.User_Artist WHERE email = ? AND aid = ?";

      db.query(sql_query_string, [email, artist_id], function(err, result){
        if(err) throw err;
        if(result.length == 0){
          res.json(["Not subscribed to artist","Not subscribed to artist"]);
          res.end();
        }
        else{
          removeUserArtist(email, artist_id, artist_name);
        }
      })
    }

    function removeUserArtist(email, artist_id, artist_name){
      console.log("The backend says: ",email);
      var sql_query_string = "DELETE FROM Music_App.User_Artist WHERE aid = ? AND email = ?";

      db.query(sql_query_string, [artist_id, email], function(err, result){
        if(err) throw err;
        res.json(["Successfully removed", artist_name]);
        res.end();
      })
    }
  })

app.post("/api/getPlayerTracks", function(req,res){
    var artist_id = req.body.artist_id;
    console.log("aid",artist_id);
    spotifyApi.getAlbumTrackIDs(artist_id, function(ret){
      var rand_sample_choice = ret[Math.floor(Math.random() * ret.length)];;
      var choice_id = rand_sample_choice.substring(14);
      res.json(choice_id);
      res.end();
    })

  })


//updateReleaseDates();


const port = 5000;

app.listen(port,()=> console.log("port 5000"));
