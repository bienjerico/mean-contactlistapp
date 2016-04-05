var express = require('express') ,
    expressValidator = require('express-validator');
var app = express();
var bodyParser = require('body-parser');
var util = require('util');
var passwordHash = require('password-hash');

var Contacts = require(__dirname + "/public/models/contactsmodel.js");
var Users = require(__dirname + "/public/models/usersmodel.js");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(expressValidator());

function mongoosetoexpress_error(err){
    var err_conv = [];
    var data_error = err.errors;
    for(var i in data_error){
      err_conv.push({msg:data_error[i].message,param:data_error[i].path,value:data_error[i].value});
    }
    console.log(err_conv);
    return err_conv;
}


/* SIGN UP MODULE*/
app.post("/signup",function(req,res){


  var emailaddress    = req.body.emailaddress;
  var password        = req.body.password;
  var hashedPassword  = '';
  var confirmpassword = req.body.confirmpassword;

  //field validation
  req.assert('emailaddress')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid');
  req.assert('password')
    .notEmpty().withMessage('Password is required');
  req.assert('confirmpassword')
    .notEmpty().withMessage('Password is required')
    .equals(password).withMessage('Passwords do not match');

  // field sanitize
  req.sanitizeBody(emailaddress).toBoolean();
  req.sanitizeBody(password).toBoolean();
  //
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.status(500).json(errors);
    return;
  }

  hashedPassword = passwordHash.generate(password);

      var users = new Users({emailaddress: emailaddress ,password: hashedPassword});

      users.save(function(err,docs){
        if(err){
          var errors = mongoosetoexpress_error(err);
          res.status(500).json(errors);
        }else{
          console.log(docs);
          res.json(docs);
        }
      });

});


/* CONTACT LIST MODULE*/
app.get('/contactlist',function(req,res){

  Contacts.find(function(err,docs){
    if(err)
      console.log(err);
    else
      console.log(docs);
      res.json(docs);
  });

});

app.post('/contactlist',function(req,res){

  console.log(req.body);

  var contacts = new Contacts(req.body);

  contacts.save(function(err,docs){
    if(err)
      console.log(err);
    else
      res.json(docs);
  });


});

app.delete('/contactlist/:id',function(req,res){

  var id = req.params.id;
  console.log(id);

  Contacts.findByIdAndRemove(id, function (err, doc) {
    if (err)
      console.log(err);
    else
      res.json(doc);
  });


});

app.get('/contactlist/:id',function(req,res){

  var id = req.params.id;
  console.log(id);
  Contacts.findById(id,function(err,doc){
    if (err)
      console.log(err);
    else
      res.json(doc);
  });

});


app.put('/contactlist/:id',function(req,res){
  var id = req.params.id;
  console.log(req.body.name);
    Contacts.findByIdAndUpdate(id, req.body , function(err,doc){
      if (err)
        console.log(err);
      else
          res.json(doc);
    });
});

app.listen(3000);
console.log("Server running on port 3000");
util.puts('hello world running on port 3000')
