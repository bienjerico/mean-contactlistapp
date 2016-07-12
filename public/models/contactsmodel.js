var mongoose = require('mongoose');


var ContactListSchema = new mongoose.Schema({
  name : String,
  email : String,
  number : String
});


var Contacts = mongoose.model('Contacts',ContactListSchema);

module.exports = Contacts;
