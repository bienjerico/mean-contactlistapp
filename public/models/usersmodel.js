var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');


// var emailValidator = [
//   validate({
//     validator: 'isEmail',
//     message: 'You have entered an invalid Email address. Please try again.'
//   })
// ];


var UserSchema = new mongoose.Schema({
  emailaddress : {
      type: String,
      required: [true, 'Email Address is required.'],
      // validate: emailValidator,
      unique: 'Email Address to be unique.'
    },
  password : {type: String, required: [true, 'Password is required.']},
  firstname : String,
  middlename : String,
  lastname : String,
  created_at : { type: Date, default: Date.now }
});

UserSchema.plugin(uniqueValidator);

var Users = mongoose.model('Users',UserSchema);

module.exports = Users;
