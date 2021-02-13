const connection = require('../config/database');

module.exports = function (req, callback) {
  connection.query("select * from subordinado where RFCE = '" + req.RFC + "'", function (_err, _rows) {
    return callback(_rows);
  });
};
