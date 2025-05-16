import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initDebugMode } from './utils/debugTools.js';
import { applyTheme, initThemeListener } from './utils/theme.js';

// Initialize debug tools
initDebugMode();

// Initialize theme
applyTheme();
initThemeListener();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
