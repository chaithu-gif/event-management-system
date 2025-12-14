const io = require('socket.io-client');

const url = 'http://localhost:5000';
const socket = io(url, { transports: ['websocket'] });

console.log('[SOCKET-LISTENER] connecting to', url);

socket.on('connect', () => {
  console.log('[SOCKET-LISTENER] connected, id=', socket.id);
});

socket.on('eventsUpdated', (data) => {
  console.log('[SOCKET-LISTENER] eventsUpdated received:');
  console.log(JSON.stringify(data, null, 2));
  // keep process alive a short while to ensure printing
  setTimeout(() => process.exit(0), 500);
});

socket.on('connect_error', (err) => {
  console.error('[SOCKET-LISTENER] connect_error:', err && err.message);
  process.exit(2);
});

socket.on('disconnect', (reason) => {
  console.log('[SOCKET-LISTENER] disconnected:', reason);
});
