import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let io = null;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    try {
      // Check for token in both auth object and headers
      const token = socket.handshake.auth?.token || 
                    socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        console.log('No token provided for socket connection');
        return next(new Error('Authentication error: No token provided'));
      }
      
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('Socket auth JWT error:', err.message);
          return next(new Error('Authentication error: Invalid token'));
        }
        
        // Add the decoded user to the socket object
        socket.user = decoded;
        console.log(`Socket authenticated: ${decoded.email || decoded.uid}`);
        next();
      });
    } catch (error) {
      console.error('Socket middleware error:', error);
      next(new Error('Authentication error: ' + (error.message || 'Internal server error')));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user?.email || socket.user?.uid || 'Unknown'}`);

    // Join user-specific room
    socket.on('join-user-room', (userData) => {
      const userId = userData.userId || socket.user?.uid;
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their personal room`);
      }
    });

    // Join project room
    socket.on('join-project-room', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.user?.email} joined project room: ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project-room', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.user?.email} left project room: ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.email || socket.user?.uid || 'Unknown'}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export default { initSocketServer, getIO };
