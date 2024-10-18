import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TechBoard from './TechBoard';
import './Tech.css';
function Tech() {
  const location = useLocation();
  const onpage = ( location.pathname == '/tech' )
  const techpost_id = 'c8e31075607e461385edc9f898ceb98c'
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