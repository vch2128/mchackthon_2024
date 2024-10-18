// src/components/Emo.jsx
import React, { useState, useEffect } from 'react';
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
  const currentUserId = '6bdfeb28d98b4ee6838d1906b194b672';

  const [paragraphs, setParagraphs] = useState([]);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [replies, setReplies] = useState([]);
  const [emoMsgs, setEmoMsgs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [EmoMsgReply, setEmoMsgReply] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

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

  const refreshParagraphs = () => {
    fetch(`/api/emomsg/sender/${currentUserId}`)
      .then((response) => response.json())
      .then((data) => setParagraphs(data));
  };

  return (
    <Layout className="emo-layout">
      {/* 側邊欄：顯示段落列表 */}
      <Sider width={250} className="emo-sider">
        <h2>我的情緒樹洞</h2>
        <SidebarMenu
          paragraphs={paragraphs}
          selectedParagraphId={selectedParagraph ? selectedParagraph.id : null}
          onParagraphClick={(para) => setSelectedParagraph(para)}
          formatDate={formatDate}
        />
      </Sider>

      {/* 內容區域：顯示選定段落和回覆 */}
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

      {/* 郵箱圖標 */}
      <img
        src={mailboxIcon}
        alt="Mailbox Icon"
        className="mailbox-icon"
        onClick={() => setIsModalVisible(true)}
      />

      {/* 郵箱模態框 */}
      <MailboxModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        emoMsgs={emoMsgs}
        EmoMsgReply={EmoMsgReply}
        onMsgClick={(msg) => setSelectedMsg(msg)}
        formatDate={formatDate}
      />

      {/* 回覆模態框 */}
      <ReplyModal
        selectedMsg={selectedMsg}
        visible={!!selectedMsg}
        onClose={() => setSelectedMsg(null)}
        replyContent={replyContent}
        onReplyChange={(e) => setReplyContent(e.target.value)}
        onReplySubmit={() => handleReplySubmit()}
        formatDate={formatDate}
      />

      {/* 新增的小精靈圖標和功能 */}
      <CreateEmoMsg currentUserId={currentUserId} onMessageCreated={refreshParagraphs} />
    </Layout>
  );
}

export default Emo;
