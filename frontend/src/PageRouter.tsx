// PageRouter.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Tech from './pages/Tech/Tech';
import Emo from './pages/Emo/Emo';
import Login from './pages/Login/Login';
import PrivateRoute from './PrivateRoute';
import TechPost from './pages/Tech/TechPost';

const PageRouter: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/tech"
        element={
          <PrivateRoute>
            <Tech />
          </PrivateRoute>
        }
      />
      <Route 
        path="/tech/post/:techpost_id"
        element={
          <PrivateRoute>
            <TechPost />
          </PrivateRoute>
        }
      />
      <Route
        path="/emo"
        element={
          <PrivateRoute>
            <Emo />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default PageRouter;
