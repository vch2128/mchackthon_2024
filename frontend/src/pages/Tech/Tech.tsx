import React from 'react';
import { Link } from 'react-router-dom';
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
}

export default Tech;