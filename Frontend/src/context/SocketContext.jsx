import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const { token, currentUser } = useAuth();

  useEffect(() => {
    let socketInstance = null;

    // Only attempt to connect if we have a valid user and token
    if (currentUser && token) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const socketUrl = apiUrl.replace('/api', '');
        
        console.log('Attempting socket connection to:', socketUrl);

        // Initialize socket with authentication token in extraHeaders
        socketInstance = io(socketUrl, {
          extraHeaders: {
            Authorization: `Bearer ${token}`
          },
          auth: {
            token
          },
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          transports: ['websocket', 'polling'] // Try WebSocket first, fallback to polling
        });

        // Connection success handler
        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          setConnected(true);
          setConnectionError(null);
          
          // Join user-specific room for targeted messages
          if (currentUser.uid) {
            socketInstance.emit('join-user-room', { 
              userId: currentUser.uid,
              email: currentUser.email
            });
          }
        });

        // Connection error handler
        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error.message);
          setConnectionError(`Connection error: ${error.message}`);
          setConnected(false);
        });

        // Authentication error handler
        socketInstance.on('error', (error) => {
          console.error('Socket error:', error);
          setConnectionError(`Socket error: ${error}`);
          setConnected(false);
        });

        // Disconnection handler
        socketInstance.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setConnected(false);
          
          // If the server disconnected us, try to reconnect
          if (reason === 'io server disconnect') {
            setTimeout(() => {
              socketInstance.connect();
            }, 2000);
          }
        });

        // Set the socket instance
        setSocket(socketInstance);
        
      } catch (error) {
        console.error('Error initializing socket connection:', error);
        setConnectionError(`Failed to initialize socket: ${error.message}`);
      }
    }

    // Clean up on unmount or when dependencies change
    return () => {
      if (socketInstance) {
        console.log('Cleaning up socket connection');
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      }
    };
  }, [currentUser, token]); // Re-initialize socket when token or user changes

  // Function to join a project room
  const joinProjectRoom = (projectId) => {
    if (socket && connected && projectId) {
      socket.emit('join-project-room', projectId);
      console.log(`Joined project room: ${projectId}`);
    }
  };

  // Function to leave a project room
  const leaveProjectRoom = (projectId) => {
    if (socket && connected && projectId) {
      socket.emit('leave-project-room', projectId);
      console.log(`Left project room: ${projectId}`);
    }
  };

  // Provide connection status component
  const ConnectionStatus = ({ showError = true }) => {
    if (!connectionError || !showError) return null;
    
    return (
      <div className="socket-connection-error">
        <p>{connectionError}</p>
        <button onClick={() => socket?.connect()}>
          Retry Connection
        </button>
      </div>
    );
  };

  // Value object with socket instance and helper functions
  const value = {
    socket,
    connected,
    connectionError,
    joinProjectRoom,
    leaveProjectRoom,
    ConnectionStatus
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
