import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TechBoard from './TechBoard';

function Tech() {
  const location = useLocation();
  const onpage = ( location.pathname == '/tech' )
  return (<>
    { onpage && (
      <div style={{ color: 'black' }}>
        <h2>Tech Board</h2>
        {/* <p>Welcome to the Tech page!</p> */}
        <TechBoard/>
      </div>
    )}
  </>);
}
export default Tech;