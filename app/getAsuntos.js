const connection = require('../config/database');

module.exports = function (req, callback) {
  connection.query('select a.Actividad, a.Descripcion, a.FechaCreacion, a.IdAsunto, a.Estado, a.DiasTermino, s.RFC from asunto a, asuntosubordinado x, subordinado s where a.Estado="En progreso." and a.IdAsunto= x.IdAsunto and x.RFCS= s.RFC and s.RFC= "' + req.RFC + '"', function (_err, _rows) {
    callback(_rows);
  });
};
