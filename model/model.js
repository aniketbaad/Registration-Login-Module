

var mongoose = require('mongoose');
var db = mongoose.connection;

var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  username:{
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileimage: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.hash(newUser.password, 10, function(err, hash){
    if(err) throw err;
    newUser.password = hash;
    newUser.save(callback);
  });
}
