const connection = require('../config/database');

module.exports = function (idAsunto, callback) {
  connection.query('Select s.* from  subordinado s, asunto a, asuntosubordinado x where s.rfc=x.rfcs and x.idasunto=a.idasunto and a.idasunto="' + idAsunto + '"', function (_err, _rows) {
    callback(_rows);
  });
};
