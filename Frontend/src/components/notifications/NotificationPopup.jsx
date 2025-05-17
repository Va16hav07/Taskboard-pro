import { useNotification } from '../../context/NotificationContext';
import './NotificationPopup.css';
import { useState, useEffect } from 'react';

function NotificationPopup() {
  const { notifications, closeNotification } = useNotification();
  
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification}
          onClose={closeNotification}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  
  // Handle notification exit animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Match this time with the CSS animation duration
  };
  
  // Auto-progress bar for notification timeout
  useEffect(() => {
    if (notification.timeout !== null) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onClose(notification.id);
        }, 300);
      }, notification.timeout - 300);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      default: // info
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };
  
  return (
    <div className={`notification-item ${notification.type} ${isExiting ? 'exiting' : ''}`}>
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        <div className="notification-message">
          {notification.message}
        </div>
        {notification.timeout !== null && (
          <div className="notification-progress">
            <div 
              className="notification-progress-bar"
              style={{ 
                animationDuration: `${notification.timeout}ms`,
                animationPlayState: isExiting ? 'paused' : 'running'
              }}
            ></div>
          </div>
        )}
      </div>
      <button className="notification-close" onClick={handleClose}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

export default NotificationPopup;
