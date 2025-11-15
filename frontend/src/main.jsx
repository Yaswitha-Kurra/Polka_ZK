import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Buffer is provided globally by vite-plugin-node-polyfills
// No need to import it manually

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

