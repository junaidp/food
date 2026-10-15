import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);

const root = document.getElementById('root')!;

// Hydrate only when this HTML was pre-rendered for this exact URL and the visitor is signed out
// (signed-in visitors get redirected, so their first render differs from the static markup).
if (root.dataset.prerendered === window.location.pathname && !localStorage.getItem('token')) {
  ReactDOM.hydrateRoot(root, app);
} else {
  root.innerHTML = '';
  ReactDOM.createRoot(root).render(app);
}
