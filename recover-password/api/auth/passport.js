import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { model } from 'mongoose';

const User = model('user');

// login
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  User.findOne({email: email})
    .then(user => {
      
      if (!user) {
        return done(null, false, { errors: { error: 'User does not exist!'}});
      }
      if (!user.validPassword(password)) {
        return done(null, false, { errors: { error: 'Email or Password is incorrect!'}});
      }
      return done(null, user);
    })
    .catch(done)
}));