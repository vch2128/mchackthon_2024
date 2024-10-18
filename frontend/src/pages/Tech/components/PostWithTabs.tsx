import React, { useState } from 'react'
import { Tabs } from 'antd'
import PostList from './PostList'
import { Post } from '../types/post';

interface TabContentProps {
  allposts: Post[];
  myposts: Post[];
}

const TabContent: React.FC<TabContentProps> = ({ allposts, myposts }) => {
  const [activeTab, setActiveTab] = useState('allposts');

  const items = [
    {
      key: 'allposts',
      label: <span style={{ color: activeTab === 'allposts' ? 'blue' : 'black' }}>All Posts</span>,
      children: (
        <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <PostList posts={allposts} />
        </div>
      ),
    },
    {
      key: 'myposts',
      label: <span style={{ color: activeTab === 'myposts' ? 'blue' : 'black' }}>My Posts</span>,
      children: (
        <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <PostList posts={myposts} />
        </div>
      ),
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      tabBarStyle={{ color: 'black' }}
      items={items} // New approach using the `items` prop
    />
  );
};

export default TabContent;