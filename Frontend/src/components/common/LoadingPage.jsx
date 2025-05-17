import React from 'react';
import './Common.css';

function LoadingPage({ message = "Loading...", size = "large" }) {
  return (
    <div className={`loading-page ${size}`}>
      <div className="spinner-container">
        <div className="spinner">
          <svg className="spinner-svg" viewBox="0 0 50 50">
            <circle
              className="spinner-path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            ></circle>
          </svg>
        </div>
      </div>
      <div className="loading-message">{message}</div>
    </div>
  );
}

export default LoadingPage;
