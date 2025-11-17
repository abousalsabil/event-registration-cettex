
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Es-shim
import 'core-js/actual/get-iterator-method';
import 'core-js/actual/iterator';
import 'core-js/actual/symbol';
import 'core-js/actual/symbol/iterator';
import 'core-js/features/get-iterator-method';
import 'core-js/features/iterator';
import 'core-js/features/symbol';
import 'core-js/features/symbol/iterator';

// Three.js and react-three-fiber rely on Symbol.iterator.
// The shims above are required for it to work in the sandbox environment.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
