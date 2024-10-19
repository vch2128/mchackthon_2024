import React, { useEffect } from 'react';
import './App.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps, Menu } from 'antd';
import PageRouter from './PageRouter';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <MailOutlined />,
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { label: 'Option 3', key: 'setting:3' },
          { label: 'Option 4', key: 'setting:4' },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    ),
  },
];

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
      <div style={{ color: 'black' }}>
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
