const mongoose = require('mongoose');
var crypto = require('crypto'); 


const userSchema = new mongoose.Schema({
  local: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: Number,
      required: true,
      maxlength: 10
    },
    password: {
      type: String,
      required: true
    }
  },
  salt: String
});

userSchema.methods.setPassword = function(password) { 
     
  // Creating a unique salt for a particular user 
  this.salt = crypto.randomBytes(16).toString('hex'); 
    
  // Hashing user's salt and password with 1000 iterations, 
  //  64 length and sha512 digest 
  this.local.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
  return this.local.password;
}; 

userSchema.methods.validPassword = function(password) { 
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
  return this.local.password === hash; 
}; 

module.exports = mongoose.model("User", userSchema);