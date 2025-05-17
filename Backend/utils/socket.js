/**
 * Socket utilities for real-time notifications
 */
import { getIO } from '../websocket/socketServer.js';

/**
 * Send a real-time notification to a specific user
 * @param {string} userId - The user's ID to send the notification to
 * @param {string} eventName - The event name/type
 * @param {Object} data - The notification data
 */
export const notifyUser = (userId, eventName, data) => {
  try {
    if (!userId) return;
    
    const io = getIO();
    if (!io) {
      console.warn('Socket IO instance not available');
      return;
    }
    
    io.to(`user:${userId}`).emit(eventName, data);
  } catch (error) {
    console.error('Error sending socket notification:', error);
  }
};

/**
 * Send a real-time notification to all members of a project
 * @param {string} projectId - The project ID
 * @param {string} eventName - The event name/type 
 * @param {Object} data - The notification data
 */
export const notifyProjectMembers = (projectId, eventName, data) => {
  try {
    if (!projectId) return;
    
    const io = getIO();
    if (!io) {
      console.warn('Socket IO instance not available');
      return;
    }
    
    io.to(`project:${projectId}`).emit(eventName, data);
  } catch (error) {
    console.error('Error sending socket notification to project:', error);
  }
};

/**
 * Send a real-time notification to all connected clients except the sender
 * @param {string} senderId - The sender's ID to exclude
 * @param {string} eventName - The event name/type
 * @param {Object} data - The notification data
 */
export const broadcastNotification = (senderId, eventName, data) => {
  try {
    const io = getIO();
    if (!io) {
      console.warn('Socket IO instance not available');
      return;
    }
    
    // If we have a sender ID, exclude them
    if (senderId) {
      io.except(`user:${senderId}`).emit(eventName, data);
    } else {
      io.emit(eventName, data);
    }
  } catch (error) {
    console.error('Error broadcasting socket notification:', error);
  }
};

// Export getIO directly from this module to fix the import error
export { getIO } from '../websocket/socketServer.js';

export default {
  notifyUser,
  notifyProjectMembers,
  broadcastNotification,
  getIO // Include in default export as well
};
