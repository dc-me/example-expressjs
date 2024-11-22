import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error('User Not Found');
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    let user;
    const err = {
      status: 400,
      message: 'Invalid username or password',
    };
    try {
      user = await User.findOne({ email });
      if (!user) {
        return done(err, false);
      }
    } catch (error) {
      return done(error);
    }
    if (user.password !== password) {
      return done(err, false);
    }
    return done(null, user);
  })
);
