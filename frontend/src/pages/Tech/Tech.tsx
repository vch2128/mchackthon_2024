import React from 'react';
import { Link } from 'react-router-dom';
import TechBoard from './TechBoard';

function Tech() {
  return (
    <div>
      <nav>
        <Link to="/home">Home</Link>
      </nav>
      <h1>Tech Page</h1>
      <p>Welcome to the Tech page!</p>
      <TechBoard/>
    </div>
  );
}

export default Tech;