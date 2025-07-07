// client/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from './components/ui/sonner';
import { SocketProvider } from './context/SocketContext';
import ErrorBoundary from './components/ErrorBoundary'; // Impor ErrorBoundary

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <SocketProvider>
      <App />
      <Toaster closeButton />
    </SocketProvider>
  </ErrorBoundary>
);