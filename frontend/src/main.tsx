import { StrictMode } from 'react'
import * as ReactDOM from "react-dom/client"
import App from './App.tsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
