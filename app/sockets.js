module.exports = function (io) {
  io.on('connection', function (socket) {
    socket.on('rechazar', (asunto) => {
      require('../services/changeEstado')(asunto, 1);
      io.emit('rechazado', asunto.asuntoid);
    });
    socket.on('concluir', (asuntoId) => {
      require('../services/changeEstado')(asuntoId, 5);
      io.emit('concluido', asuntoId);
    });
    socket.on('obtener subordinados', (idAsunto) => {
      require('./getSubordinadosAsignados')(idAsunto, (result) => {
        io.emit('subordinados asignados', result, idAsunto);
      });
    });
    socket.on('obtener rechazo', (idAsunto) => {
      require('./getInfoRechazo')(idAsunto, (result) => {
        io.emit('info rechazo', result, idAsunto);
      });
    });
  });
};
