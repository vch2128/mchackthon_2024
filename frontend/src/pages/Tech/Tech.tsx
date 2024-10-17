import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Tech() {
  const location = useLocation();
  const onpage = ( location.pathname == '/tech/post' )
  return (<>
    { onpage && (
      <div>
        <nav>
          <Link to="/home">Home</Link> |{' '}
          <Link to="/tech/post">TechPost</Link> |{' '}
        </nav>
        <h1>Tech Page</h1>
        <p>Welcome to the Tech page!</p>
      </div>
    )}
  </>);
}

export default Tech;