import React, { useState } from 'react';
import { Layout, Menu, List, Card, Button, Avatar, Modal, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './Emo.css';
const { Sider, Content } = Layout;
import mailboxIcon from './images/mailbox.png';

function Emo() {

  const paragraphs = [
    { id: 1, topic: "感到壓力很大", content: "最近，我感覺生活中的事情變得太多了。不論是工作還是家庭，我都難以找到一個平衡點。總覺得壓力無處不在，不知道該如何調整自己，去應對這些挑戰。", createAt: "2024-09-01" },
    { id: 2, topic: "缺乏動力", content: "最近，我發現自己對很多事情都提不起興趣。即使是我過去非常喜歡的活動，現在也沒有動力去做。我感到困惑，不知道該如何重拾以往的激情。", createAt: "2024-09-02" },
    { id: 3, topic: "人際關係的困擾", content: "近來，我與朋友之間的交流似乎越來越少，甚至出現了一些誤解。這讓我很不安，不知道該如何改善這種情況。我很在意這些友誼，但又不希望變得過於主動。", createAt: "2024-09-03" },
    { id: 4, topic: "學習壓力", content: "即將到來的考試讓我感到非常焦慮。雖然我已經花了很多時間在準備上，但我總覺得自己準備得還不夠好，無法應付考試的壓力。", createAt: "2024-09-04" },
    { id: 5, topic: "未來的不確定感", content: "我對自己的未來充滿了不確定感，尤其是職業的選擇。我不知道該如何選擇一條合適的道路，也擔心做錯決定會對未來產生負面影響。", createAt: "2024-09-05" }
  ];

  const replies = [
    { message_id: 1, content: "感到壓力大是正常的，特別是在生活中的責任越來越多時。適時地調整心態，給自己一些時間放鬆，是很重要的。", createAt: "2024-09-01" },
    { message_id: 2, content: "動力不足是每個人都會遇到的問題，有時候嘗試從小的事情開始，會幫助你重新建立自信和動力。", createAt: "2024-09-03" },
    { message_id: 3, content: "人際關係本來就會有波動，關鍵是主動進行溝通。當你開放心態去表達自己，很多誤解都會得到解決。", createAt: "2024-09-05" }
  ];

  const emoMsgs = [
    { id: 1, sender: "UserA", topic: "壓力很大", content: "我最近感到壓力非常大，生活中的工作、家庭和自我之間的平衡變得越來越難掌控。不論怎麼努力，我都覺得時間總是不夠用，事情總是堆積成山。每天我都感到疲憊不堪，壓力讓我喘不過氣來。", createAt: "2024-09-01" },
    { id: 2, sender: "UserB", topic: "缺乏動力", content: "這段時間，我發現自己很難找到動力去做事情。即使是那些我過去非常喜歡的活動，現在似乎都提不起興趣。我不知道該如何找回那種動力，也不確定自己為什麼會陷入這樣的狀態。", createAt: "2024-09-03" }
  ];

  const [selectedParagraph, setSelectedParagraph] = useState(paragraphs[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const handleParagraphClick = (para) => {
    setSelectedParagraph(para);
  };

  // 當信箱圖示被點擊時，顯示 Modal
  const handleMailboxClick = () => {
    setIsModalVisible(true);
  };

  // 當點擊一個收到的消息時，顯示回覆內容
  const handleMsgClick = (msg) => {
    setSelectedMsg(msg);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      message.error('回覆內容不能為空');
      return;
    }

    try {
      const response = await fetch(`/api/${selectedMsg.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        message.success('成功回覆訊息！');
        setReplyContent(''); // 清空輸入框
        // 可以在這裡更新回覆列表或其他狀態
      } else {
        message.error('回覆失敗，請重試');
      }
    } catch (error) {
      message.error('發生錯誤，請稍後再試');
    }
  };

  // 排序 paragraphs，根據 createAt 由新到舊
  const sortedParagraphs = [...paragraphs].sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

  // 排序 replies，根據 createAt 由新到舊
  const sortedReplies = replies.filter(reply => reply.message_id === selectedParagraph.id).sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

  // 排序 emoMsgs，根據 createAt 由新到舊
  const sortedEmoMsgs = [...emoMsgs].sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

  return (
    <Layout className="emo-layout">
      {/* 側邊欄：顯示話題選單 */}
      <Sider width={250} className="emo-sider">
        <h2>我的情緒樹洞</h2>
        <Menu
          mode="inline"
          onClick={({ key }) => handleParagraphClick(paragraphs.find(para => para.id === parseInt(key)))}
          selectedKeys={[`${selectedParagraph.id}`]}
        >
          {sortedParagraphs.map((para) => (
            <Menu.Item key={para.id} icon={<MailOutlined />}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{para.topic}</span>
                  <span style={{ fontSize: '10px', color: '#999' }}>{para.createAt}</span>
                </div>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* 內容區域：顯示選定的段落和回覆 */}
      <Layout>
        <Content className="emo-content">
          <Card title={selectedParagraph.topic} bordered={false}>
            <p>{selectedParagraph.content}</p>
            <p style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>發表於 {selectedParagraph.createAt}</p>
          </Card>
          <h3>Replies:</h3>
          <List
            itemLayout="horizontal"
            dataSource={sortedReplies}
            renderItem={reply => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<MailOutlined />} />}
                  description={reply.content}
                />
                <div style={{ fontSize: '12px', color: '#999' }}>{reply.createAt}</div>
              </List.Item>
            )}
          />
        </Content>
      </Layout>

      {/* 信箱圖示 */}
      <img 
        src={mailboxIcon} 
        alt="Mailbox Icon" 
        className="mailbox-icon" 
        onClick={handleMailboxClick}
      />

      {/* Modal 彈出對話框 */}
      <Modal 
        title="收到的消息" 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={sortedEmoMsgs}
          renderItem={msg => (
            <List.Item onClick={() => handleMsgClick(msg)}>
              <List.Item.Meta
                avatar={<Avatar icon={<MailOutlined />} />}
                title={"有人需要你的關心"}
                description={msg.topic}
              />
              <div style={{ fontSize: '12px', color: '#999' }}>{msg.createAt}</div>
            </List.Item>
          )}
        />
      </Modal>

      {/* 點擊一個消息後，顯示回覆 */}
      {selectedMsg && (
        <Modal 
          title={selectedMsg.topic}
          visible={!!selectedMsg} 
          onCancel={() => setSelectedMsg(null)} 
          footer={null}
        >
          <p>{selectedMsg.content}</p>
          <p style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>發送於 {selectedMsg.createAt}</p>
          {/* 回覆輸入框和提交按鈕 */}
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 100px)' }}
              placeholder="輸入你的回覆"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button type="primary" onClick={handleReplySubmit}>
              Submit
            </Button>
          </Input.Group>
        </Modal>
      )}
    </Layout>
  );
}

export default Emo;
