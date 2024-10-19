import React, { useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import '../Emo.css';
import spriteIcon from '../images/sprite.png';

interface CreateEmoMessageProps {
  currentUserId: string;
  onMessageCreated: () => void;
}

const CreateEmoMsg: React.FC<CreateEmoMessageProps> = ({ currentUserId, onMessageCreated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewMessage('');
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleCreateMessage = async () => {
    if (!newMessage.trim()) {
      message.error('請輸入新訊息內容');
      return;
    }
    

    try {
      const response = await fetch(`/api/emomsg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          sender_id: currentUserId,
        }),
      });

      if (response.ok) {
        message.success('successfully created a new message');
        handleCloseModal();
        onMessageCreated(); // callback to refresh the list
      } else {
        const errorData = await response.json();
        message.error(errorData.state || '創建訊息失敗');
      }
    } catch (error) {
      message.error('創建訊息失敗');
    }
  };

  return (
    <>
      {/* Sprite Icon for creating a new message */}
        <div className="create-emo-sprite">
            <img
                src={spriteIcon}
                alt="Create New Message"
                className="create-emo-sprite"
                onClick={handleOpenModal}
            />
        </div>

      {/* Modal for creating new message */}
      <Modal
        title="你有什麼煩惱 ?"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateMessage}>
            發送煩惱
          </Button>,
        ]}
      >
        <Input
          placeholder="告訴我們你有什麼煩惱 ..."
          value={newMessage}
          onChange={handleMessageChange}
        />
      </Modal>
    </>
  );
};

export default CreateEmoMsg;
