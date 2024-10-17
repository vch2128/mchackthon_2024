import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import TechBoard from './TechBoard';
=======
>>>>>>> main

function Tech() {
  return (
    <div>
      <nav>
<<<<<<< HEAD
        <Link to="/home">Home</Link>
      </nav>
      <h1>Tech Page</h1>
      <p>Welcome to the Tech page!</p>
      <TechBoard/>
=======
        <Link to="/home">Home</Link> |{' '}
        <Link to="/tech/post">TechPost</Link> |{' '}
      </nav>
      <h1>Tech Page</h1>
      <p>Welcome to the Tech page!</p>
>>>>>>> main
    </div>
  );
}

export default Tech;