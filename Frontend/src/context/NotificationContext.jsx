import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Show a notification with type: 'success', 'error', 'info', 'warning'
  const showNotification = useCallback((message, type = 'info', timeout = 5000) => {
    const id = uuidv4();
    const notification = {
      id,
      message,
      type,
      timeout,
    };

    setNotifications(prev => [...prev, notification]);
    
    if (timeout !== null) {
      setTimeout(() => {
        closeNotification(id);
      }, timeout);
    }
    
    return id;
  }, []);

  const closeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, timeout = 5000) => {
    return showNotification(message, 'success', timeout);
  }, [showNotification]);

  const showError = useCallback((message, timeout = 6000) => {
    return showNotification(message, 'error', timeout);
  }, [showNotification]);

  const showInfo = useCallback((message, timeout = 4000) => {
    return showNotification(message, 'info', timeout);
  }, [showNotification]);

  const showWarning = useCallback((message, timeout = 5000) => {
    return showNotification(message, 'warning', timeout);
  }, [showNotification]);

  // Clean up old notifications on unmount
  useEffect(() => {
    return () => {
      setNotifications([]);
    };
  }, []);

  const value = {
    notifications,
    showNotification,
    closeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
