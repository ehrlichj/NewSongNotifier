const express = require("express");
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');


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
    console.log(result);
  });

});

app.post('/api/login', function(req, res){
  var sql_query_string = "SELECT U.email
                          FROM Music_App.User
                          WHERE email = ? AND password = ?";

  var email = req.body.email
  var password = req.body.password

  db.query(sql_query_string, [email,password], function (err, result) {
    if (err) throw err;
    res.json(result)
    res.end();
  });

});

//db.end();

const port = 5000;

app.listen(port,()=> console.log("port 5000"));
