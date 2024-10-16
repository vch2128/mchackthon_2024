import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BiSolidTrash } from "react-icons/bi";
import './App.css'
import { Link, useLocation} from 'react-router-dom'
import PageRouter from './PageRouter'
import { useState, useRef } from 'react'

function App() {
  const location = useLocation();
  const [paragraph, setParagraph] = useState(""); // Store the current input text
  const [paragraphs, setParagraphs] = useState([]); // Store all submitted paragraphs
  const inputRef = useRef(); // Reference for the textarea element
  // Check if the current path is '/tech'
  const isHomePage = location.pathname === '/home' || location.pathname === '/';

  return (
    <>
      <div>
        <PageRouter />
        {isHomePage && (
          <>
            <nav>
              <Link to="/home">Home</Link> |{' '}
              <Link to="/tech">Tech</Link> |{' '}
              <Link to="/emo">Emo</Link> |{' '}
            </nav>
            <div className="ListToDoLists">
              <div className="box">
                <label className="message-label">Enter your paragraph:</label>
                <textarea
                  value={paragraph}
                  onChange={(e) => setParagraph(e.target.value)}
                  className="large-input"
                  placeholder="Type your paragraph here..."
                />
                <button className="new-button" onClick={() => {}}>
                  Submit
                </button>
              </div>

              {paragraphs.length > 0 && (
                <div className="paragraph-display">
                  <h3>Your Submitted Paragraphs:</h3>
                  {paragraphs.map((p, index) => (
                    <div key={index} className="paragraph-item">
                      <p className="submitted-paragraph">{p}</p>
                      <button
                        className="delete-button"
                        onClick={() => {}}
                      >
                        <BiSolidTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* <p>There are no to-do lists!</p> */}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
