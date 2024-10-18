// Login.tsx
import './Login.css';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Access setUser from context

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const { access_token, user } = response.data;
      // Store the token (e.g., in localStorage)
      localStorage.setItem('token', access_token);
      // Update the global user state
      setUser(user);
      console.log(user)
      // Redirect to the protected page
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure (e.g., display error message)
    }
  };
  const onpage = ( location.pathname == '/login' )
  return (<>
    { onpage && 
      (<form onSubmit={handleLogin}>
      <div>
        <label>Account:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">submit</button>
    </form>)
    }
  </>);
};

export default Login;
