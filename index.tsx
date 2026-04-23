import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import './src/test-supabase'; // Descomente para testar a conexão com o Supabase

console.log("[App] Initializing Escalas DS/PMCE...");

// Check for Service Worker and log status
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for(let registration of registrations) {
      console.log("[SW] Found active registration:", registration.scope);
      // If we want to force clearing old SWs that might be hanging the app:
      // registration.unregister();
    }
  });
}

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