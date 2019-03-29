import { model } from 'mongoose';
import passport from 'passport';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid';

import { SENDGRID_APIKEY as apiKey } from '~/config/config';

const User = model('user');

export const getUser = (req, res, next) => {
  User
    .findById(req.payload.id)
      .then(user => {
        if (!user) return res.sendStatus(401);
        return res.json({
          user: user.toAuthJSON()
        });
      })
      .catch(next)
}

export const signup = (req, res, next) => {
  const user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user
    .save()
    .then(() => {
      return res.json({
        user: user.toAuthJSON()
      });
    })
    .catch(next);
}

export const login = (req, res, next) => {
  if (!req.body.email) {
    return res.status(422).json({
      errors: {
        error: 'Email can\'t be blank'
      }
    })
  }

  if (!req.body.password) {
    return res.status(422).json({
      errors: {
        error: 'Password can\'t be blank'
      }
    })
  }

  passport.authenticate('local', {session: false}, function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(422).json(info);

      user.token = user.generateJWT();
      return res.json({
        user: user.toAuthJSON()
      })
  })(req, res, next)
}

export const forgotpwd = (req, res, next) => {
  function generateToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, function(err, buffer) {
        const token = buffer.toString('hex');
        resolve(token)
      })
    })
  }

  function updateUserToken (token) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          return res.status(422).json({
            errors: {
              error: 'No account with that email address exists'
            }
          });
        }
  
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        
        user.save((err) => {
         
          if (err) reject(err);
          resolve({
            token,
            user
          })
        })
      })
    })
  }

  function sendEmail (promiseObj) {
    return new Promise((resolve, reject) => {
      const transport = nodemailer.createTransport(
        sendgrid({
          apiKey: apiKey
        })
      );

      const options = {
        to: promiseObj.user.email,
        from: 'Password Reset <noreply@passwordReset.com>',
        subject: 'Password Reset',
        text: 'You are recieving this because blah blah blah. ' +
          'Please click on the link to reset your password: ' + '\n\n' +
          'http://' + req.headers.host + '/reset/' + promiseObj.token
      }

      transport.sendMail(options)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    });
  }

  function errorResponse (err) {
    res.status(422).json({
      errors: {
        error: err
      }
    });
  }

  function successResponse (response) {
    res.status(202).json({
      message: "Password reset token sent successfully"
    })
  }
  
  generateToken()
  .then(updateUserToken)
  .then(sendEmail)
  .then(successResponse)
  .catch(errorResponse)
}

export const resetToken = (req, res, next) => {
  function pwdresetToken () {
    return new Promise((resolve, reject) => {
      User.findOne({ resetPasswordToken: req.params.token , resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (err) reject(err);
        if (!user) {
          return res.status(422).json({
            errors: {
              error: 'No account with that email address exists'
            }
          });
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.setPassword(req.body.password);

        user.save()
          .then(() => {
            resolve(user)
          })
          .catch(next)
      })
    })
  }

  function sendEmail (user) {
    return new Promise((resolve, reject) => {
      const transport = nodemailer.createTransport(
        sendgrid({
          apiKey: apiKey
        })
      );

      const options = {
        to: user.email,
        from: 'Password Reset <noreply@passwordReset.com>',
        subject: 'Your password has been changed',
        text: 'Hello ' + user.username + '\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.'      
      }

      transport.sendMail(options)
        .then(() => {
          resolve(user)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  function errorResponse (err) {
    res.status(422).json({
      errors: {
        error: err
      }
    });
  }

  function successResponse (user) {
    res.status(202).json({
      message: 'Success! Your password has been changed.',
      user: user.toAuthJSON()
    });
  }

  pwdresetToken()
    .then(sendEmail)
    .then(successResponse)
    .catch(errorResponse);
}