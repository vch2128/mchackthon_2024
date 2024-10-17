import React, { useState } from 'react';
import './Emo.css';

function Emo() {
  const paragraphs = [
    "Paragraph 1: Welcome to our website! We hope you find what you're looking for.Paragraph 1: Welcome to our website! We hope you find what you're looking for.Paragraph 1: Welcome to our website! We hope you find what you're looking for.Paragraph 1: Welcome to our website! We hope you find what you're looking for.",
    "Paragraph 2: Discover amazing content and resources tailored for you.",
    "Paragraph 3: Stay tuned for updates and exciting new features.",
    "Paragraph 4: Contact us for more information or assistance.",
    "Paragraph 5: Thank you for visiting! Have a great day."
  ];

  const [selectedParagraph, setSelectedParagraph] = useState(paragraphs[0]);

  return (
    <div className="emo-container">
      <div className="sidebar">
        <h2>Select a Paragraph</h2>
        <ul>
          {paragraphs.map((para, index) => (
            <li key={index}>
              <button onClick={() => setSelectedParagraph(para)}>
                Paragraph {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="paragraph-box">
          <p>{selectedParagraph}</p>
        </div>
        <h1>Emo Page</h1>
        <p>Welcome to the Emo page!</p>
      </div>
    </div>
  );
}

export default Emo;
