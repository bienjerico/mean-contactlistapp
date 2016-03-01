var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Contacts = require('./db.js');


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
