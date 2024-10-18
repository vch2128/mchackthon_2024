import { StrictMode } from 'react'
import * as ReactDOM from "react-dom/client"
import App from './App.tsx'
import './index.css'
import { UserProvider } from './context/UserContext';

import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
