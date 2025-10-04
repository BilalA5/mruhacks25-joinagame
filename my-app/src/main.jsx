// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Keep a reference to the React root so we can unmount later (optional)
let root;

const container = document.getElementById('root');
root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: export unmount for tests/hot swaps
export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}
