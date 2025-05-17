import React from 'react';
import './Common.css';

const LoadingPage = ({ message = 'Loading...', description = 'This may take a few moments' }) => {
  return (
    <div className="loading-page">
      <div className="loading-spinner-container">
        <div className="loading-spinner-large">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
        </div>
        <h2>{message}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
