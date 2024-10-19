import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import TechBoard from './TechBoard';
import { Input, Avatar, Popover } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';

const { Search } = Input;

function Tech() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const onpage = (location.pathname === '/tech');
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useContext(UserContext);

  const onSearch = async (value: string) => {
    if (!value) {
      console.log("no search query");
      return;
    }
    console.log("search query: ", value);
    setSearchQuery(value);
    setIsSearching(true);
  };

  return (
    <>
      {onpage && (
        <div style={{ color: 'black' }}>
          <h2>Tech Board</h2>
          {user ? (
            <>
              <Search
                placeholder="Search for a tech post..."
                enterButton="Search"
                size="large"
                onSearch={onSearch}
              />
              <TechBoard isSearching={isSearching} searchQuery={searchQuery} />
            </>
          ) : (
            <p>Login first to access the Tech Board</p>
          )}
        </div>
      )}

      {/* Popover for help button */}
      <div style={{ position: 'absolute', top: 70, right: 10 }}>
        <Popover
          content={<p>Click the post to answer the question.</p>}
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
