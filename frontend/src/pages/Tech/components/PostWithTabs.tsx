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

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarStyle={{ color: '#fff' }}>
        <Tabs.TabPane tab={<span style={{ color: activeTab === 'allposts' ? '#fff' : 'white' }}>All Posts</span>} key="allposts">
          <PostList posts={allposts} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span style={{ color: activeTab === 'myposts' ? '#fff' : '#aaa' }}>My Posts</span>} key="myposts">
          <PostList posts={myposts} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TabContent;