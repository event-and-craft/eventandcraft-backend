import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (!window.location.pathname.startsWith('/admin')) {
  const newPath = '/admin' + (window.location.pathname === '/' ? '/' : window.location.pathname);
  window.location.replace(newPath + window.location.search + window.location.hash);
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
