import React, { useEffect } from 'react';
import './App.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageRouter from './PageRouter';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user is authenticated by looking for a token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');
  useEffect(() => {
    // Redirect to /login if not authenticated and not already on /login
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
    // Redirect to /home if authenticated and currently on /login
    else if (isAuthenticated && location.pathname === '/login') {
      navigate('/home');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <>
      <div>
        <PageRouter />
        {isAuthenticated && (
          <>
            <nav>
              <Link to="/home">Home</Link> |{' '}
              <Link to="/tech">Tech</Link> |{' '}
              <Link to="/emo">Emo</Link> |{' '}
              <Link to="/login">Login</Link> |{' '}
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
              >
                Logout
              </button>
            </nav>
          </>
        )}
      </div>
    </>
  )
}

export default App
