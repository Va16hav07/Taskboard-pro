import React from 'react';
import './Common.css';

const ErrorPage = ({ 
  message = 'Something went wrong',
  details = 'We encountered an unexpected error. Please try again later.',
  onRetry = null
}) => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2>{message}</h2>
        <p>{details}</p>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
