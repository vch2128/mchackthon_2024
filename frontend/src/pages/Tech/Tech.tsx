import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
import TechBoard from './TechBoard';
import './Tech.css';
function Tech() {
  const location = useLocation();
  const onpage = ( location.pathname == '/tech' )
  const techpost_id = 'd61dc499bcad41aeaa3f3f3e37e92840'
  return (<>
    { onpage && (
      <div>
        <nav>
          <Link to="/home">Home</Link> |{' '}
          <Link to={`/tech/post/${techpost_id}`}>TechPost</Link> |{' '}
        </nav>
        <h1>Tech Page</h1>
        <p>Welcome to the Tech page!</p>
        <TechBoard/>
      </div>
    )}
  </>);
=======
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
>>>>>>> bonnie
}

export default Tech;