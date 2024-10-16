// Login.tsx
import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', {
        username: account,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const { access_token } = response.data;
      // Store the token (e.g., in localStorage)
      localStorage.setItem('token', access_token);
      // Redirect to the protected page
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure (e.g., display error message)
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Account:</label>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
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
    </form>
  );
};

export default Login;
