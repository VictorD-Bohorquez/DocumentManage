const connection = require('../config/database');

module.exports = function (idAsunto, callback) {
  connection.query('Select x.descripcion, s.nombre from asunto a, asuntorechazado x, subordinado s where x.rfcs=s.rfc and x.idasunto=a.idasunto and a.idasunto="' + idAsunto + '"', function (_err, _rows) {
    callback(_rows);
  });
};
