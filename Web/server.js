const express = require("express");
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

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


/* app.get('/api/students', function(req, res){
    // WHERE user_name==?
    let sql = `SELECT * FROM student_info`
    //to get one thing, db.get() not db.all
    db.all(sql,[],(err,row)=>{
      if (err){
        return console.error(err.message);
      }
	setValue(row);
	//console.log(row.user_name);
    });
	function setValue(value){
		x=value;
		//x=x.user_name
		res.json(x)
		res.end()
	}
});*/




const port = 5000;

app.listen(port,()=> console.log("port 5000"));
