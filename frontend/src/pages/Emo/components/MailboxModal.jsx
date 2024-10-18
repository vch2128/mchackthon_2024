import React, { useState } from 'react';
import { Modal, List, Avatar, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';

function MailboxModal({ visible, onClose, emoMsgs, EmoMsgReply, onMsgClick, formatDate }) {
  const [emoMsgofReply, setemoMsgofReply] = useState(null);  // Initialize for holding fetched emoMsg data
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);  // Control reply modal visibility

  const onReplyClick = async (reply) => {
    const msg_id = reply.emo_msg_id;
    try {
      const response = await fetch(`/api/emomsg/${msg_id}`);
      if (response.ok) {
        const data = await response.json();
        setemoMsgofReply({ ...data, replyContent: reply.content }); // Store both emoMsg data and reply content
        setIsReplyModalVisible(true);  // Show the modal
      } else {
        message.error('無法獲取郵箱消息');
      }
    } catch (error) {
      message.error('無法獲取郵箱消息');
    }
  };

  const handleReplyModalClose = () => {
    setIsReplyModalVisible(false);  // Close the reply modal
  };

  return (
    <>
      <Modal
        title="收到的消息"
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <h3>未回覆：</h3>
        <List
          itemLayout="horizontal"
          dataSource={emoMsgs}
          renderItem={(msg) => (
            <List.Item onClick={() => onMsgClick(msg)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={<Avatar icon={<MailOutlined />} />}
                title={msg.topic}
                description={msg.content}
              />
              <div style={{ fontSize: '12px', color: '#999' }}>{formatDate(msg.createdAt)}</div>
            </List.Item>
          )}
        />
        <h3>已回覆：</h3>
        <List
          itemLayout="horizontal"
          dataSource={EmoMsgReply}
          renderItem={(reply) => (
            <List.Item onClick={() => onReplyClick(reply)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={<Avatar icon={<MailOutlined style={{ color: 'blue' }} />} />}
                title={emoMsgofReply?.topic || 'loading...'}  // Safe access to topic when loaded
                description={reply.content}
              />
              <div style={{ fontSize: '12px', color: '#999' }}>{formatDate(reply.createdAt)}</div> {/* Fixed msg -> reply */}
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal to display the fetched emoMsg details */}
      <Modal
        title="已回覆的煩惱"
        visible={isReplyModalVisible}
        onCancel={handleReplyModalClose}
        footer={null}
      >
        {emoMsgofReply ? (
          <>
            <h3>{emoMsgofReply.topic}</h3>
            <p>{emoMsgofReply.content}</p>
            <p>你的回覆: </p>
            <p>{emoMsgofReply.replyContent}</p>
          </>
        ) : (
          <p>載入中...</p>
        )}
      </Modal>
    </>
  );
}

export default MailboxModal;
