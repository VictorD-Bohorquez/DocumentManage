const connection = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'
module.exports = function (req) {
  connection.query("select * from subordinado where email = '" + req.body.email + "'", function (err, rows) {
    console.log(rows);
    console.log('above row object');
    if (err) { return err; }
    if (rows.length) {
      return req.flash('signupMessage', 'Esa dirección de correo electronico ya existe.');
    } else {
      var encrypt;
      bcrypt.hash(req.body.RFC, saltRounds, function (_err, hash) {
        encrypt = hash;
      });
      // if there is no user with that email
      // create the user
      var newUserMysql = {
        RFC: req.body.RFC,
        Nombre: req.body.name,
        ApPaterno: req.body.apPaterno,
        ApMaterno: req.body.apMaterno,
        colonia: req.body.colonia,
        tel: parseInt(req.body.tel),
        Email: req.body.email,
        Contrasena: encrypt // use the generateHash function in our user model
      };
      var insertQuery = 'INSERT INTO subordinado SET ?';
      console.log(insertQuery);
      connection.query(insertQuery, newUserMysql, function (_err, _rows) {
        return true;
      });
    }
  });
};
