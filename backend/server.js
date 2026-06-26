const http = require('http');
const app = require('./src/app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',  // In production, restrict to your frontend domain
    methods: ['GET', 'POST']
  }
});

// Store the io instance so controllers can access it
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a driver comes online, they join the 'drivers' room
  socket.on('driver:online', (driverId) => {
    console.log(`Driver ${driverId} is online (socket ${socket.id})`);
    socket.join('drivers');
    socket.driverId = driverId;  // attach for later use
  });

  // Driver sends location updates (you'll call this from the driver client)
  socket.on('driver:location', (data) => {
    // data: { tripId, lat, lng }
    // Forward to the specific rider room
    io.to(`trip_${data.tripId}`).emit('driver:location', {
      lat: data.lat,
      lng: data.lng
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('join:trip', (tripId) => {
    socket.join(`trip_${tripId}`);
    console.log(`Socket ${socket.id} joined room trip_${tripId}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});