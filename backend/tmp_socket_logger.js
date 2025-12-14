const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');

const LOG = path.join(__dirname, 'socket_broadcasts.log');
const url = 'http://localhost:5000';
const socket = io(url, { transports: ['websocket'] });

function log(msg){
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG, line);
}

log('Socket logger starting, connecting to ' + url);

socket.on('connect', () => {
  log('connected: ' + socket.id);
});

socket.on('eventsUpdated', (data) => {
  log('eventsUpdated: ' + JSON.stringify(data));
  // exit after a short delay so caller knows we received something
  setTimeout(() => process.exit(0), 300);
});

socket.on('connect_error', (err) => {
  log('connect_error: ' + (err && err.message));
  process.exit(2);
});

socket.on('disconnect', (reason) => {
  log('disconnected: ' + reason);
});
