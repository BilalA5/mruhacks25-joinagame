// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Keep a reference to the React root so we can unmount later
let root;

/**
 * Mount the app into a container and return the React root.
 * Consumers can pass initial props for <App />.
 */
export function mount(container = document.getElementById('root'), appProps = {}) {
  if (!container) throw new Error('mount: container element not found');
  root = createRoot(container);
  root.render(
    <StrictMode>
      <App {...appProps} />
    </StrictMode>
  );
  return root;
}

/** Unmount the app if it has been mounted. */
export function unmount() {
  if (root) {
    root.unmount();
    root = undefined;
  }
}

// SPA behavior: auto-mount when there's a #root on the page
if (document.getElementById('root')) {
  mount();
}

// Optional: export the component too (useful for testing or embedding)
export { App };

// Default export = mount function (handy for consumers)
export default mount;
