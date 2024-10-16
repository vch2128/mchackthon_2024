import React from 'react';
import { Link } from 'react-router-dom';

function Tech() {
  return (
    <div>
      <nav>
        <Link to="/home">Home</Link> |{' '}
        <Link to="/tech/post">TechPost</Link> |{' '}
      </nav>
      <h1>Tech Page</h1>
      <p>Welcome to the Tech page!</p>
    </div>
  );
}

export default Tech;