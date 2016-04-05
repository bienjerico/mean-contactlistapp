var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/contactlist');
var ContactListSchema = new mongoose.Schema({
  name : String,
  email : String,
  number : String
});

var SignUpSchema = new mongoose.Schema({
  emailaddress : String,
  password : String,
  created_at : { type: Date, default: Date.now }
});


var Contacts = mongoose.model('Contacts',ContactListSchema);
var SignUp = mongoose.model('SignUp',SignUpSchema);

// module.exports = Contacts;
// module.exports = SignUp;
