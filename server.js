var express = require('express');
var app = express();
var mongojs = require('mongojs');
// var db = mongojs('contactlist',['contactlist']);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/contactlist');
var ContactListSchema = new mongoose.Schema({
  name : String,
  email : String,
  number : String
});

var Contacts = mongoose.model('Contacts',ContactListSchema);


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

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
  console.log("beforesave");
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
