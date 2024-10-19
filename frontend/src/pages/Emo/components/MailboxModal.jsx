// src/components/MailboxModal.jsx
import React, { useState } from 'react';
import { Modal, List, Avatar, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';

function MailboxModal({ 
  visible, 
  onClose, 
  emoMsgs, 
  EmoMsgReply, 
  MsgofReply, 
  onMsgClick, 
  formatDate 
}) {
  const [selectedReplyDetails, setSelectedReplyDetails] = useState(null); // State for selected reply
  const [replyModalVisible, setReplyModalVisible] = useState(false); // State to control the reply modal visibility

  // Handle Reply Click: Set reply details and open the modal
  const handleReplyClick = (reply) => {
    const originalMsg = MsgofReply.find(msg => msg.id === reply.emo_msg_id);
    setSelectedReplyDetails({
      originalMsg: originalMsg,
      reply: reply
    });
    setReplyModalVisible(true); // Open the modal for reply details
  };

  // Handle Modal Close
  const handleModalClose = () => {
    setSelectedReplyDetails(null);  // Clear the details when the modal is closed
    setReplyModalVisible(false); // Close the reply modal
  };

  return (
    <>
      {/* Main Mailbox Modal */}
      <Modal
        title="收到的消息"
        visible={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <h3>未回覆：</h3>
        {emoMsgs.length === 0 ? (
          <p>No unreplied messages.</p>
        ) : (
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
        )}

        <h3 style={{ marginTop: '20px' }}>已回覆：</h3>
        {EmoMsgReply.length === 0 ? (
          <p>No replied messages.</p>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={EmoMsgReply}
            renderItem={(reply) => (
              <List.Item onClick={() => handleReplyClick(reply)} style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  avatar={<Avatar icon={<MailOutlined style={{ color: 'blue' }} />} />}
                  title={`Replied to: ${MsgofReply.find(msg => msg.id === reply.emo_msg_id)?.topic || 'Loading...'}`}
                  description={reply.content}
                />
                <div style={{ fontSize: '12px', color: '#999' }}>{formatDate(reply.createdAt)}</div>
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* Reply Details Modal */}
      <Modal
        title="已回覆的煩惱"
        visible={replyModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        {selectedReplyDetails ? (
          <>
            <h3> {selectedReplyDetails.originalMsg?.topic || 'Loading...'}</h3>
            <p>{selectedReplyDetails.originalMsg?.content || 'Loading original message...'}</p>
            <p><strong>Date:</strong> {formatDate(selectedReplyDetails.originalMsg?.createdAt)}</p>
            <hr />
            <h3>你的回覆:</h3>
            <p>{selectedReplyDetails.reply.content}</p>
            <p><strong>Date:</strong> {formatDate(selectedReplyDetails.reply.createdAt)}</p>
          </>
        ) : (
          <p>Loading reply details...</p>
        )}
      </Modal>
    </>
  );
}

export default MailboxModal;
