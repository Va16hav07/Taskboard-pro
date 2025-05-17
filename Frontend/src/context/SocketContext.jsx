import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser, token } = useAuth();
  const { showInfo, showSuccess, showWarning } = useNotification();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    if (!currentUser || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }
    
    const socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', 
      {
        auth: { token },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5
      }
    );
    
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });
    
    setSocket(socketInstance);
    
    // Listen to notification events
    if (socket) {
      socket.on('task-assigned', (data) => {
        showInfo(`You have been assigned to task "${data.taskTitle}"`);
      });

      socket.on('task-updated', (data) => {
        if (data.assignee?.userId === currentUser.uid) {
          showInfo(`Task "${data.title}" was updated`);
        }
      });

      socket.on('comment-added', (data) => {
        if (data.task.assignee?.userId === currentUser.uid && data.comment.author.userId !== currentUser.uid) {
          showInfo(`New comment on task "${data.task.title}"`);
        }
      });

      socket.on('automation-triggered', (data) => {
        showSuccess(`Automation "${data.automationName}" was triggered`);
      });
      
      socket.on('project-invitation', (data) => {
        showWarning(`You've been invited to project "${data.projectTitle}"`);
      });
    }
    
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setConnected(false);
      if (socket) {
        socket.off('task-assigned');
        socket.off('task-updated');
        socket.off('comment-added');
        socket.off('automation-triggered');
        socket.off('project-invitation');
      }
    };
  }, [currentUser, token, showInfo, showSuccess, showWarning]);
  
  const joinProject = (projectId) => {
    if (socket && connected) {
      socket.emit('join-project', projectId);
    }
  };
  
  const leaveProject = (projectId) => {
    if (socket && connected) {
      socket.emit('leave-project', projectId);
    }
  };
  
  const value = {
    socket,
    connected,
    joinProject,
    leaveProject
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
