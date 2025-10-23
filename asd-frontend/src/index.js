import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Don't forget Tailwind CSS imports!
import App from './App'; // Imports your component
// import * as serviceWorker from './serviceWorker'; // You can remove this line if it exists

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
