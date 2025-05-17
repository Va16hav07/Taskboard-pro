import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css';

function ErrorPage({ 
  message = "Something went wrong", 
  details = null, 
  onRetry = null, 
  backTo = null 
}) {
  return (
    <div className="error-page">
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 className="error-title">{message}</h2>
      {details && <p className="error-details">{details}</p>}
      <div className="error-actions">
        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Try Again
          </button>
        )}
        {backTo && (
          <Link to={backTo.path} className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {backTo.label || "Go Back"}
          </Link>
        )}
      </div>
    </div>
  );
}

export default ErrorPage;
