const connection = require('../config/database');

module.exports = function (req) {
  connection.query('select idAsunto from asunto order by idAsunto DESC', function (_err, rows) {
    const lastId = Number(rows[0].idAsunto);
    const newAsunto = {
      IdAsunto: (lastId + 1),
      Actividad: req.body.Actividad,
      Descripcion: req.body.Descripcion,
      FechaCreacion: new Date(),
      DiasTermino: ((parseInt(req.body.DiasTermino) === 0) ? -1 : req.body.DiasTermino),
      Estado: 'En progreso.'
    };
    connection.query('INSERT INTO asunto SET ?', newAsunto, function (_err, _rows) {
    });
    const asignAsunto = {
      IdAsunto: (lastId + 1),
      RFCS: req.body.RFCS
    };
    connection.query('INSERT INTO asuntosubordinado SET ?', asignAsunto, function (_err, _rows) {
    });
  });
};
