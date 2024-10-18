import React from 'react';
import { Card, List, Avatar } from 'antd';
import { MailOutlined } from '@ant-design/icons';

function ContentArea({ selectedParagraph, replies, formatDate }) {
  return (
    <>
      <Card title={selectedParagraph.topic} bordered={false}>
        <p>{selectedParagraph.content}</p>
        <p style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>
          發表於 {formatDate(selectedParagraph.createdAt)}
        </p>
      </Card>
      <h3>回覆：</h3>
      <List
        itemLayout="horizontal"
        dataSource={replies}
        renderItem={(reply) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<MailOutlined />} />}
              description={reply.content}
            />
            <div style={{ fontSize: '12px', color: '#999' }}>{formatDate(reply.createdAt)}</div>
          </List.Item>
        )}
      />
    </>
  );
}

export default ContentArea;
