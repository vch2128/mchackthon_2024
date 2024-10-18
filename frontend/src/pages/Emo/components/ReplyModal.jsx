// src/components/ReplyModal.jsx
import React from 'react';
import { Modal, Input, Button } from 'antd';

function ReplyModal({ selectedMsg, visible, onClose, replyContent, onReplyChange, onReplySubmit, formatDate }) {
  if (!selectedMsg) return null;

  return (
    <Modal
      title={selectedMsg.topic}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <p>{selectedMsg.content}</p>
      <p style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>
        發送於 {formatDate(selectedMsg.createdAt)}
      </p>
      {/* Reply input and submit button */}
      <Input.Group compact>
        <Input
          style={{ width: 'calc(100% - 100px)' }}
          placeholder="輸入你的回覆"
          value={replyContent}
          onChange={onReplyChange}
        />
        <Button type="primary" onClick={onReplySubmit}>
          提交
        </Button>
      </Input.Group>
    </Modal>
  );
}

export default ReplyModal;
