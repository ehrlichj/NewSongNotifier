const express = require("express");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// open the database

let db = new sqlite3.Database('/home/aintili/.dbeaver4/.metadata/sample-database-sqlite-1/Chinook.db', sqlite3.OPEN_READWRITE, (err) => {

if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});


app.get('/api/students', function(req, res){
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
});


app.get('/api/quiz', function(req, res){
    // WHERE user_name==?
    let sql = `SELECT * FROM Quizes JOIN questions ON Quizes.quiz_id=questions.quiz_id WHERE Quizes.quiz_name==?`
    //to get one thing, db.get() not db.all
    db.all(sql,"ALGEBRA_quadratics",(err,row)=>{
      if (err){
        return console.error(err.message);
      }
	setValue(row);
    });
	function setValue(value){
		x=value;
		//x=x.user_name
		res.json(x)
		res.end()
	}
});


app.post('/api/generatequiz', function(req, res){
    // WHERE user_name==?
    let sql = `SELECT * FROM Quizes JOIN questions ON Quizes.quiz_id=questions.quiz_id WHERE Quizes.quiz_name==?`
    //to get one thing, db.get() not db.all
    db.all(sql,req.body.quizname,[],(err,row)=>{
      if (err){
        return console.error(err.message);
      }
	setValue(row);
  //console.log(row);
    });
	function setValue(value){
    if(value==null){
      value=" ";
    }
		res.json(value);
		res.end();
	}
});



app.post('/api/login', function(req, res){
    let sql = `SELECT * FROM student_info WHERE user_name==?`
    var x = [];
    var name=req.body.user_name;
    db.get(sql,name,(err,row)=>{
      if (err){
        return console.error(err.message);
      }
      setValue(row);
    });
    function setValue(value){
      if (value == null){
        value=" ";
      }
      x=value;
      res.json(x);
      res.end();
    }
});


app.post('/api/signup', function(req, res){
    let sql = `SELECT user_id FROM student_info ORDER BY user_id DESC LIMIT 1`
    var x = [];
    db.get(sql,(err,row)=>{
      if (err){
        return console.error(err.message);
      }
      attemptValue(row);
    });
    function attemptValue(rowid){
      let sql = `SELECT * FROM student_info WHERE user_name==?`
      var name=req.body.user_name;
      db.get(sql,name,(err,row)=>{
        if (err){
          return console.error(err.message);
        }
        checkValue(row,rowid);
      });
    }
    function checkValue(value,num,pass){
      num=num.user_id+1;
      if(value==null){
        let sql=`INSERT INTO student_info(user_id,user_name,password,
        Num_Lessons_Compl_Alg,Num_Lessons_Compl_Geom,RecentLesson) VALUES
        (?,?,?,0,0,"No Prev Lesson")`
        name=req.body.user_name;
        var pass=req.body.password;
        db.run(sql,num,name,pass,function(err){
          if (err){
            return console.log.error(err.message);
          }
          //res.json(name);
          //res.end();
          successLogin(name);
        });
      }

      else{
        value=" "
        res.json(value);
        res.end();
      }
    }

    function successLogin(name){
      let sql = `SELECT user_id,user_name,Num_Lessons_Compl_Alg,Num_Lessons_Compl_Geom,RecentLesson FROM student_info WHERE user_name==?`
      var x = [];
      db.get(sql,name,(err,row)=>{
        if (err){
          return console.error(err.message);
        }
        setValueSignUp(row);
      });
      function setValueSignUp(value){
        if (value == null){
          value=" ";
        }
        x=value;
        res.json(x);
        res.end();
      }
    }
});


app.post('/api/update', function(req, res){
    let sql = `SELECT Num_Lessons_Compl_Alg FROM student_info WHERE user_name==?`
    var x = [];
    var name=req.body.user_name;
    db.get(sql,name,(err,row)=>{
      if (err){
        return console.error(err.message);
      }
      console.log("server says",row,typeof(row));
      value=row.Num_Lessons_Compl_Alg+1
      updateValue(value,name);
    });
    function updateValue(value,name){
      if (value == null){
        value=" ";
      }

      let sql = `UPDATE student_info SET Num_Lessons_Compl_Alg=? WHERE user_name==?`
      db.all(sql,value,name,(err,row)=>{
        if (err){
          return console.error(err.message);
        }
      });
      res.json("success");
      res.end();


    }
});

const port = 5000;

app.listen(port,()=> console.log("port 5000"));
