
require('dotenv').config(); //level 2 security with environment variables
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");  //level 1 security

// const md5 = require("md5");   //level 3 Authentication using hash
const bcrypt = require("bcrypt"); //level 4 Authnetication using bcrypt package
const saltRounds = 10; //setting salt rounds


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));



mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true , useUnifiedTopology: true});



const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


// userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields: ["password"]}); //level 2 security with environment variable


const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {      //using  hash function to bcrypt password with saltrounds
    const newUser = new User ({
      email: req.body.username,
      password: hash              // Store hash in your password DB.
    });
    newUser.save(function(err){
      if (err){
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
    });

});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result){          //comparing the password that's already stored in our DB to get the user login back
          if (result === true){                   //if password matches
            res.render("secrets");                //then render secret page back
          }
        });
        }
      }

  });
});






app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
