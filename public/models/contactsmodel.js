var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/contactlist');
var ContactListSchema = new mongoose.Schema({
  name : String,
  email : String,
  number : String
});


var Contacts = mongoose.model('Contacts',ContactListSchema);

module.exports = Contacts;
