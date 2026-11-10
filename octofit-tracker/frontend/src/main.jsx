import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('The app root element was not found.');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
