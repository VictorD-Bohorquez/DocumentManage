// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const bcrypt = require('bcrypt');

// expose this function to our app using module.exports
module.exports = function (passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.RFC);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    connection.query('select * from encargado where RFC = "' + id + '"', function (err, rows) {
      if (!rows.length) {
        connection.query('select * from subordinado where RFC = "' + id + '"', function (err, rows) {
          return done(err, rows[0]);
        });
      } else if (rows.length) {
        return done(err, rows[0]);
      }
    });
  });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function (req, email, password, done) { // callback with email and password from our form
    console.log('????', req.params.lib);
    connection.query("SELECT * FROM `encargado` WHERE `email` = '" + email + "'", function (err, rows) {
      if (err) { return done(err); }
      if (!rows.length) {
        connection.query("SELECT * FROM `subordinado` WHERE `email` = '" + email + "'", function (err, rows) {
          if (err) { return done(err); }
          if (!rows.length) {
            return done(null, false, req.flash('loginMessage', 'Esa direccion de correo electronico no esta registrada.')); // req.flash is the way to set flashdata using connect-flash
          }
          bcrypt.compare(password, rows[0].Contrasena, function (_err, res) {
            console.log('subordinado');
            if (!(res)) { return done(null, false, req.flash('loginMessage', 'Oops! Contraseña incorrecta.')); } // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            return done(null, rows[0], req.flash('loginMessage', req.params.lib));
          });
        });
      } else if (rows.length) {
        bcrypt.compare(password, rows[0].Contrasena, function (_err, res) {
          console.log('encargado', password, rows[0].Contrasena);
          if (!(res)) { return done(null, false, req.flash('loginMessage', 'Oops! Contraseña incorrecta.')); } // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, rows[0], req.flash('loginMessage', req.params.lib));
        });
      }
      // if the user is found but the password is wrong
    });
  }));
};
