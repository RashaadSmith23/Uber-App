const http = require('http');
const app = require('./src/app');
const { Server } = require('socket.io');
const runMigrations = require('./src/db/migrateOnStart');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Socket.io setup (keep your existing one)
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

// Run database migrations, then start listening
runMigrations().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});