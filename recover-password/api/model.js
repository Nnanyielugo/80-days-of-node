import { model, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { SECRET } from '~/config/config';

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'can\'t be blank'],
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  hash: String,
  salt: String,
}, { timestamps: true });

UserSchema.plugin(validator, { message: '{PATH} is already taken' });

UserSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, SECRET);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
  };
};

const User = model('user', UserSchema);

export default User;
