import { Server } from 'socket.io';
import { authenticateToken } from '../middleware/auth.js';  // Changed from verifyToken to authenticateToken

// Socket.io server instance
let io;

/**
 * Initialize socket.io server
 * @param {Object} server - HTTP server instance
 */
export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
  // Add authentication middleware
  io.use(async (socket, next) => {
    try {
      // Get token from query params or headers
      const token = socket.handshake.auth.token || 
                   socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      // Verify the token
      const user = await authenticateToken(token);  // Changed from verifyToken to authenticateToken
      if (!user) {
        return next(new Error('Authentication error: Invalid token'));
      }
      
      // Store user data in socket
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const userId = socket.user?.uid;
    
    if (userId) {
      // Join a room specific to this user
      socket.join(`user:${userId}`);
      console.log(`User ${userId} connected`);
      
      // Listen for project joins
      socket.on('join-project', (projectId) => {
        if (projectId) {
          socket.join(`project:${projectId}`);
          console.log(`User ${userId} joined project ${projectId}`);
        }
      });
      
      // Listen for project leaves
      socket.on('leave-project', (projectId) => {
        if (projectId) {
          socket.leave(`project:${projectId}`);
          console.log(`User ${userId} left project ${projectId}`);
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
      });
    }
  });
  
  console.log('Socket.io server initialized');
  return io;
};

/**
 * Get the Socket.io server instance
 * @returns {Object} Socket.io server instance
 */
export const getIO = () => {
  if (!io) {
    console.warn('Socket.io has not been initialized yet!');
    return null;
  }
  return io;
};
