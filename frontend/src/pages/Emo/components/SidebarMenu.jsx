// src/components/SidebarMenu.jsx
import React from 'react';
import { Menu, Popover } from 'antd';
import { MailOutlined } from '@ant-design/icons';

function SidebarMenu({ paragraphs, selectedParagraphId, onParagraphClick, formatDate }) {
  return (
    <Menu
      mode="inline"
      onClick={({ key }) => onParagraphClick(paragraphs.find((para) => para.id === key))}
      selectedKeys={[selectedParagraphId ? `${selectedParagraphId}` : '']}
    >
      {paragraphs.map((para) => (
        <Menu.Item key={para.id} icon={<MailOutlined />}>
          <Popover
            content={
              <div>
                <p>{formatDate(para.createdAt)}</p>
              </div>
            }
            title={para.topic}
            trigger="hover"
            placement="right"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }}>
              <span>{para.topic}</span>
              <span style={{ fontSize: '10px', color: '#999' }}>{formatDate(para.createdAt)}</span>
            </div>
          </Popover>
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default SidebarMenu;
