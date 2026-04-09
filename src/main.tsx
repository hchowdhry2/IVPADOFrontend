import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App' // Extension is omitted in imports
import { BrowserRouter } from 'react-router-dom'

// The '!' is the "Non-null assertion operator". 
// It tells TS: "I am 100% sure this element exists in index.html"
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);