var express           = require('express') ,
    expressValidator  = require('express-validator'),
    passport          = require('passport'),
    Strategy          = require('passport-local').Strategy,
    bodyParser        = require('body-parser'),
    util              = require('util'),
    passwordHash      = require('password-hash'),
    mongoose          = require('mongoose');

mongoose.connect('mongodb://localhost:27017/contactlist');

var Contacts = require(__dirname + "/public/models/contactsmodel.js"),
    Users = require(__dirname + "/public/models/usersmodel.js");


function mongoosetoexpress_error(err){
    var err_conv = [];
    var data_error = err.errors;
    for(var i in data_error){
      err_conv.push({msg:data_error[i].message,param:data_error[i].path,value:data_error[i].value});
    }
    console.log(err_conv);
    return err_conv;
}


passport.use(new Strategy(function(emailaddress, password, cb) {
    Users.findByEmailaddress(emailaddress, function(err, user) {
      if (err) {
         return cb(err);
       }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }

      return cb(null, user);
    });
  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });




var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(expressValidator());


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


/*---------------------------
SIGN IN MODULE
---------------------------*/
/*,  passport.authenticate('local', {failureRedirect: '/login' })*/
app.post("/signin",function(req,res){
  passport.authenticate('local');
  console.log(req.body);
  res.json(req.body);
});


/*---------------------------
SIGN UP MODULE
---------------------------*/
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


/*---------------------------
CONTACT LIST MODULE
---------------------------*/
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
