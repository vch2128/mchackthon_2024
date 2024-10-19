// src/components/Emo.jsx
import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import './Emo.css';
const { Sider, Content } = Layout;
import mailboxIcon from './images/mailbox.png';

import { Avatar, Popover} from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

import SidebarMenu from './components/SidebarMenu';
import ContentArea from './components/ContentArea';
import MailboxModal from './components/MailboxModal';
import ReplyModal from './components/ReplyModal';

function Emo() {
  // 假設 currentUserId 可用，請根據實際情況替換
  const currentUserId = '83fa6df15b784d60bc760e6413cd8269';

  const [paragraphs, setParagraphs] = useState([]);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [replies, setReplies] = useState([]);
  const [emoMsgs, setEmoMsgs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [EmoMsgReply, setEmoMsgReply] = useState([]);

  // 日期格式化函數
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 獲取段落
  useEffect(() => {
    const fetchParagraphs = async () => {
      try {
        const response = await fetch(`/api/emomsg/sender/${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          setParagraphs(data);
          if (data.length > 0) {
            setSelectedParagraph(data[0]);
          }
        } else {
          message.error('無法獲取情緒段落');
        }
      } catch (error) {
        message.error('無法獲取情緒段落');
      }
    };

    fetchParagraphs();
  }, [currentUserId]);

  // 獲取回覆
  useEffect(() => {
    if (selectedParagraph) {
      const fetchReplies = async () => {
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
      };

      fetchReplies();
    }
  }, [selectedParagraph]);

  // 處理段落點擊
  const handleParagraphClick = (para) => {
    setSelectedParagraph(para);
  };

  // 處理郵箱圖標點擊
  const handleMailboxClick = () => {
    setIsModalVisible(true);

    const fetchEmoMsgs = async () => {
      try {
        const response = await fetch(`/api/emomsg/rcvr/${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          setEmoMsgs(data);
        } else {
          message.error('無法獲取郵箱消息');
        }
      } catch (error) {
        message.error('無法獲取郵箱消息');
      }
    };

    const fetchEmoreply = async () => {
      try {
        const response = await fetch(`/api/emoreply/sender/${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          setEmoMsgReply(data);
        }
      }
      catch (error) {
        message.error('無法獲取回覆');
      }
    }
    fetchEmoreply();
    fetchEmoMsgs();
  };

  // 處理郵件點擊
  const handleMsgClick = (msg) => {
    setSelectedMsg(msg);
  };

  // 處理回覆內容改變
  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  // 處理回覆提交
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
        setReplyContent('');
        setSelectedMsg(null);
        // 從 emoMsgs 中移除已回覆的消息
        setEmoMsgs(emoMsgs.filter((msg) => msg.id !== selectedMsg.id));
      } else {
        const errorData = await response.json();
        message.error(errorData.state || '回覆提交失敗');
      }
    } catch (error) {
      message.error('回覆提交失敗');
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 70, right: 10, zIndex: 1000 }}>
        <Popover 
          content={
            <>
              Help others who are facing challenges. You will earn
              <br />
              rewards by providing answers to their questions.
            </>
          }
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
        
  
      <Layout className="emo-layout">
        <Sider width={250} className="emo-sider">
          <h2>我的情緒樹洞</h2>
          <SidebarMenu
            paragraphs={paragraphs}
            selectedParagraphId={selectedParagraph ? selectedParagraph.id : null}
            onParagraphClick={handleParagraphClick}
            formatDate={formatDate}
          />
        </Sider>
  
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
  
        <img
          src={mailboxIcon}
        alt="Mailbox Icon"
          className="mailbox-icon"
          onClick={handleMailboxClick}
        />
  
        <MailboxModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          emoMsgs={emoMsgs}
          EmoMsgReply={EmoMsgReply}
          onMsgClick={handleMsgClick}
          formatDate={formatDate}
        />
  
        <ReplyModal
          selectedMsg={selectedMsg}
          visible={!!selectedMsg}
          onClose={() => setSelectedMsg(null)}
          replyContent={replyContent}
          onReplyChange={handleReplyChange}
          onReplySubmit={handleReplySubmit}
          formatDate={formatDate}
        />
      </Layout>
    </>
  );
  
}

export default Emo;
