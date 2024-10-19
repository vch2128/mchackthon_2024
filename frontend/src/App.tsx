// @ts-ignore
import './App.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageRouter from './PageRouter';
import React, { useContext, useEffect } from 'react';
import { UserContext } from './context/UserContext';
import { Avatar, Popover} from 'antd';
import { UserOutlined } from '@ant-design/icons'
import axios from 'axios';

interface Employee {
  id: string;
  name: string;
  account: string;
  password: string;
  department: string;
  age: number;
  position: string;
  seniority: number;
  region: string;
  wallet: number;
  score: number;
}

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [techPost, setTechPost] = useState(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (user && user.id) {
          const response = await axios.get<Employee>(`/api/employees/${user.id}`);
          setUser(response.data);  // Update the user in UserContext
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchEmployee()
  }, [])
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

  const userInfoContent = (
    <div>
      <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
      <p><strong>Wallet:</strong> {user?.wallet || 'N/A'}</p>
      <p><strong>Score:</strong> {user?.score || 'N/A'}</p>
    </div>
  );
  return (
    <div>
      <PageRouter />
      {isAuthenticated && (
        <>
          <nav>
            <Link to="/home">Home</Link> |{' '}
            <Link to="/campaign">Campaign</Link> |{' '}
            <Link to="/tech">Tech</Link> |{' '}
            <Link to="/emo">Emo</Link> |{' '}
            <a
              href="/login"
              onClick={() => {
                localStorage.removeItem('token');
              }}
            >
              Logout
            </a>
          </nav>
          <br />
          {/* Popover with Avatar positioned at the top-right corner */}
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Popover 
            content={userInfoContent} 
            title="User Info" 
            trigger="click"
            placement="bottomRight"  // Ensure popover appears near the button (comment outside JSX)
          >
          <Avatar
            style={{ cursor: 'pointer' }}
            icon={<UserOutlined />}
            size="large"
          />


            </Popover>
          </div>
        </>
      )}
    </div>


  );  
}

export default App
