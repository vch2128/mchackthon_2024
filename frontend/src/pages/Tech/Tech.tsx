import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TechBoard from './TechBoard';
import { Avatar, Popover} from 'antd';
import { QuestionOutlined } from '@ant-design/icons';


function Tech() {
  const location = useLocation();
  const onpage = (location.pathname === '/tech');

  return (
    <>
      {onpage && (
        <div style={{ color: 'black' }}>
          <h2>Tech Board</h2>
          {/* <p>Welcome to the Tech page!</p> */}
          <TechBoard />
        </div>
      )}

      {/* Popover for help button */}
      <div style={{ position: 'absolute', top: 70, right: 10 }}>
        <Popover 
          content={
            <>
             Click the post to answer the question.
            </>
          }
          title="Help"
          trigger="click"
          placement="bottomRight"
        >
          <Avatar
            style={{ cursor: 'pointer' }}
            icon={<QuestionOutlined />}
            size="large"
          />
        </Popover>
      </div>
    </>
  );
}


export default Tech;