import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './app/routes';
import './index.css'

const root = createRoot(document.getElementById('root'));
if(!root) {
  console.log("wth");
}

root.render(
  <StrictMode>
    <BrowserRouter>
        <Routes></Routes>
    </BrowserRouter>
  </StrictMode>,
)
