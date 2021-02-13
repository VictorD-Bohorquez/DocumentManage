var mysql = require('mysql');
var connection;

function handleDisconnect () {
  connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'Jr1WfAbUKD',
    password: 'MPg3ZYIIWE'
  });
  connection.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnect();

connection.query('USE Jr1WfAbUKD');
console.log('connected to the database');
setInterval(function () {
  connection.query('SELECT 1');
}, 60000);
module.exports = connection;
