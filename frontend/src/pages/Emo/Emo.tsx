// src/components/Emo.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../../context/UserContext';
import { Layout, message } from 'antd';
import './Emo.css';
const { Sider, Content } = Layout;
import mailboxIcon from './images/mailbox.png';

import SidebarMenu from './components/SidebarMenu';
import ContentArea from './components/ContentArea';
import MailboxModal from './components/MailboxModal';
import ReplyModal from './components/ReplyModal';
import CreateEmoMsg from './components/CreateEmoMsg'; // Import the new component

function Emo() {
  const { user } = useContext(UserContext);
  const currentUserId = user.id;

  const [paragraphs, setParagraphs] = useState([]);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [replies, setReplies] = useState([]);
  const [emoMsgs, setEmoMsgs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [EmoMsgReply, setEmoMsgReply] = useState([]);
  const [MsgofReply, setMsgofReply] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Fetch Paragraphs
  const fetchParagraphs = useCallback(async () => {
    try {
      const response = await fetch(`/api/emomsg/sender/${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setParagraphs(data);
        if (data.length > 0) {
          setSelectedParagraph(data[0]);
        }
      } else {
        message.error('Unable to fetch emotion paragraphs');
      }
    } catch (error) {
      message.error('Unable to fetch emotion paragraphs');
    }
  }, [currentUserId]);

  // Fetch Replies for Selected Paragraph
  const fetchReplies = useCallback(async () => {
    if (selectedParagraph) {
      try {
        const response = await fetch(`/api/emoreply/emomsg/${selectedParagraph.id}`);
        if (response.ok) {
          const data = await response.json();
          setReplies(data);
        } else {
          message.error('無法獲取回覆');
        }
      } catch (error) {
        message.error('無法獲取回覆');
      }
    }
  }, [selectedParagraph]);

  // Fetch Received Messages (Unreplied)
  const fetchEmoMsgs = useCallback(async () => {
    try {
      const response = await fetch(`/api/emomsg/rcvr/${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        const repliedMsgIds = new Set(EmoMsgReply.map(reply => reply.emo_msg_id));
        const filteredEmoMsgs = data.filter(msg => !repliedMsgIds.has(msg.id));
        setEmoMsgs(filteredEmoMsgs);
      }
    } catch (error) {
      message.error('無法獲取郵箱消息');
    }
  }, [currentUserId, EmoMsgReply]);

  // Fetch Sent Replies and Corresponding Original Messages
  const fetchEmoreply = useCallback(async () => {
    try {
      const response = await fetch(`/api/emoreply/sender/${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setEmoMsgReply(data);
        // Fetch all original messages corresponding to the replies
        const msgPromises = data.map(reply => 
          fetch(`/api/emomsg/${reply.emo_msg_id}`)
            .then(res => res.json())
            .catch(() => null) // Handle individual fetch errors
        );
        const msgs = await Promise.all(msgPromises);
        // Filter out any null responses due to fetch errors
        setMsgofReply(msgs.filter(msg => msg !== null));
      } else {
        message.error('無法獲取回覆');
      }
    } catch (error) {
      message.error('無法獲取回覆');
    }
  }, [currentUserId]);

  // Fetch All Mailbox Data
  const fetchMailboxData = useCallback(async () => {
    await Promise.all([fetchEmoMsgs(), fetchEmoreply()]);
  }, [fetchEmoMsgs, fetchEmoreply]);

  // Initial Fetches
  useEffect(() => {
    if (currentUserId) {
      fetchParagraphs();
    }
  }, [currentUserId, fetchParagraphs]);

  useEffect(() => {
    fetchReplies();
  }, [selectedParagraph, fetchReplies]);

  // Refresh Paragraphs and Replies
  const refreshParagraphs = () => {
    fetchParagraphs();
  };

  // Handle Paragraph Click
  const handleParagraphClick = (para) => {
    setSelectedParagraph(para);
  };

  // Handle Mailbox Icon Click
  const handleMailboxClick = () => {
    setIsModalVisible(true);
    fetchMailboxData();
  };

  // Handle Message Click (Unreplied)
  const handleMsgClick = (msg) => {
    setSelectedMsg(msg);
  };

  // Handle Reply Content Change
  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  // Handle Reply Submission
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      message.error('請輸入回覆內容');
      return;
    }

    try {
      const response = await fetch(`/api/emoreply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emo_msg_id: selectedMsg.id,
          sender_id: currentUserId,
          content: replyContent,
        }),
      });

      if (response.ok) {
        message.success('回覆提交成功');
        setEmoMsgs((prevEmoMsgs) => prevEmoMsgs.filter((msg) => msg.id !== selectedMsg.id));
        setReplyContent('');
        setSelectedMsg(null);
        fetchEmoreply();
        // Refetch unreplied and replied messages after submitting a reply
        fetchMailboxData();  // This will refresh both sections
      } else {
        const errorData = await response.json();
        message.error(errorData.state || '回覆提交失敗');
      }
    } catch (error) {
      message.error('回覆提交失敗');
    }
  };

  return (
    <Layout className="emo-layout">
      {/* Sidebar: Display Paragraph List */}
      <Sider width={250} className="emo-sider">
        <h2>我的情緒樹洞</h2>
        <SidebarMenu
          paragraphs={paragraphs}
          selectedParagraphId={selectedParagraph ? selectedParagraph.id : null}
          onParagraphClick={handleParagraphClick}
          formatDate={formatDate}
        />
      </Sider>

      {/* Content Area: Display Selected Paragraph and Replies */}
      <Layout>
        <Content className="emo-content">
          {selectedParagraph && (
            <ContentArea
              selectedParagraph={selectedParagraph}
              replies={replies}
              formatDate={formatDate}
            />
          )}
        </Content>
      </Layout>

      {/* Mailbox Icon */}
      <img
        src={mailboxIcon}
        alt="Mailbox Icon"
        className="mailbox-icon"
        onClick={handleMailboxClick}
      />

      {/* Mailbox Modal */}
      <MailboxModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        emoMsgs={emoMsgs}
        EmoMsgReply={EmoMsgReply}
        MsgofReply={MsgofReply}
        onMsgClick={handleMsgClick}
        formatDate={formatDate}
      />

      {/* Reply Modal */}
      <ReplyModal
        selectedMsg={selectedMsg}
        visible={!!selectedMsg}
        onClose={() => setSelectedMsg(null)}
        replyContent={replyContent}
        onReplyChange={handleReplyChange}
        onReplySubmit={handleReplySubmit}
        formatDate={formatDate}
      />

      {/* Create Emotion Message Component */}
      <CreateEmoMsg currentUserId={currentUserId} onMessageCreated={refreshParagraphs} />
    </Layout>
  );
}

export default Emo;
