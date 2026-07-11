import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // هذا الملف هو الذي يحتوي على واجهة متجرك

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
