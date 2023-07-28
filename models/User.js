require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// after validate data in methods
// here we validate all data that Sent to our database one more time
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide Username'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide Email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      'Please Provide valid Email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide Password'],
    minlength: 6,
  },
});

// hashing password using bcryptjs
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JWT_TOKEN generator method
UserSchema.methods.creatJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// compare password
UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
