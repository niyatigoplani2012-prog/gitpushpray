const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST", "PATCH"]
    }
  });

  // JWT Middleware for Handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const secret = process.env.JWT_SECRET || 'hackathon_secret';
      const decoded = jwt.verify(token, secret);
      socket.user = decoded; // { userId, role, orgId }
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} | User: ${socket.user.userId} | Role: ${socket.user.role}`);

    // Join granular scoped rooms
    socket.join(`user_${socket.user.userId}`);
    
    // Recipient Orgs join their explicit org room
    if (socket.user.role === 'recipient_org' && socket.user.orgId) {
      socket.join(`org_${socket.user.orgId}`);
      console.log(`Socket ${socket.id} joined room: org_${socket.user.orgId}`);
    }
    
    // Drivers join a generic pool to receive new available assignments
    if (socket.user.role === 'driver') {
      socket.join('role_driver');
      console.log(`Socket ${socket.id} joined room: role_driver`);
    }

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { initializeSocket };
