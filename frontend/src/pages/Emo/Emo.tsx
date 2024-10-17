import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Emo.css';
import mailboxIcon from './images/mailbox.png';
function Emo() {
  const paragraphs = [
    { id: 1, topic: "感到壓力很大", content: "最近，我感覺生活中的事情變得太多了。工作、家庭和照顧自己之間的平衡似乎越來越難掌控。不管我怎麼努力，時間總是不夠用，每天都覺得做不完事情。我經常感到疲憊不堪和壓力山大，不知道該怎麼改善這種情況。" },
    { id: 2, topic: "缺乏動力", content: "最近，我感覺自己很難保持動力。每次我嘗試開始一件事情時，我就會分心或者失去興趣。即使是那些我以前很喜歡的事情，現在也提不起勁去做。我不知道該怎麼找回那種熱情。" },
    { id: 3, topic: "人際關係的困擾", content: "我最近和朋友之間的關係有些緊張。我們似乎越來越少溝通，甚至有時候會有些誤會。我不知道該怎麼處理這樣的情況，因為我很在意這段友誼，但同時又不想變得太主動，擔心會讓事情更複雜。" },
    { id: 4, topic: "學習壓力", content: "面對即將到來的考試，我感到非常焦慮。我覺得自己準備得不夠充分，總擔心自己會考不好。每當我開始學習，我就會被壓力壓得喘不過氣來，反而更難集中注意力。" },
    { id: 5, topic: "未來的不確定感", content: "我對未來充滿不確定感，特別是職業發展方面。我不知道該選擇哪一條路，總是擔心做錯決定會影響我以後的生活。這種焦慮感讓我不斷地懷疑自己，感覺前途一片迷茫。" }
  ];

  // 模擬的回覆數據
  const replies = [
    { message_id: 1, content: "感到壓力大是正常的，特別是在生活中有很多責任的時候。試著分清輕重緩急，逐步解決問題，並且給自己一些放鬆的時間。你不是一個人在面對這些困難，適時尋求幫助是沒問題的。" },
    { message_id: 1, content: "記得要對自己寬容一點，沒有人能夠在所有方面都完美。慢慢來，給自己一點時間來調整心態，壓力會隨著時間慢慢緩解。" },
    { message_id: 2, content: "動力不足時，試著從小的步驟開始，逐步重建信心。有時候，做一些小事情也能讓你找到成就感，這會慢慢激勵你去完成更多的事情。" },
    { message_id: 2, content: "有時候，我們都會遇到這樣的低谷期，不妨給自己一個休息的機會，不要強迫自己立即恢復。隨著時間的推移，興趣和動力會慢慢回來的。" },
    { message_id: 3, content: "人際關係有時會遇到困難，這是很常見的。你可以考慮主動溝通，解釋你對這段關係的重視，也許對方也有相似的感受。開放的交流能夠化解很多誤解。" },
    { message_id: 3, content: "試著先放下你的擔憂，主動地展開對話或做一些讓你們都感到舒服的事情。不要太過擔心結果，有時候只需要踏出第一步，情況就會有所改善。" },
    { message_id: 4, content: "面對考試壓力時，嘗試分階段制定學習計劃，讓自己不至於感到壓力過大。同時，記得適當休息，過度的壓力會讓效率下降。" },
    { message_id: 4, content: "每個人都會面臨考試的焦慮，這是很正常的。相信你的努力，給自己一些積極的心理暗示，你會做得比你想像的更好。" },
    { message_id: 5, content: "未來的不確定感是每個人都會面臨的問題。不要給自己太多壓力，選擇一個你感興趣的方向，逐步嘗試，未來的道路會隨著經驗的積累變得更加清晰。" },
    { message_id: 5, content: "擔心未來是正常的，但記得無論走哪一條路，都可以隨時調整方向。專注當下，做好眼前的事，未來會給你更多選擇的機會。" }
  ];

  const [selectedParagraph, setSelectedParagraph] = useState(paragraphs[0]);

  // Handle when a paragraph is clicked
  const handleParagraphClick = (para) => {
    setSelectedParagraph(para);
  };

  // Handle when mailbox is clicked
  const handleMailboxClick = () => {
    
  };

  // Filter the replies to show only those that correspond to the selected paragraph
  const filteredReplies = replies.filter(reply => reply.message_id === selectedParagraph.id);

  return (
    <div className="emo-container">
      <div className="sidebar">
        <h2>我的情緒樹洞</h2>
        <ul>
          {paragraphs.map((para) => (
            <li key={para.id}>
              <button onClick={() => handleParagraphClick(para)}>
                {para.topic} {/* 顯示 topic */}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="paragraph-box">
          <h2>{selectedParagraph.topic}</h2>
          <p>{selectedParagraph.content}</p>
        </div>
        <h3>Replies:</h3>
        {/* Display each reply in its own reply-box */}
        {filteredReplies.map((reply, index) => (
          <div key={index} className="reply-box">
            <p>{reply.content}</p>
          </div>
        ))}
      </div>
      {/* 放置在右下角的信箱圖示 */}
      <img 
        src={mailboxIcon} 
        alt="Mailbox Icon" 
        className="mailbox-icon" 
        onClick={handleMailboxClick}
      />
    </div>
  );
}

export default Emo;
