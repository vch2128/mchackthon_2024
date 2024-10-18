import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techProb, setTechProb] = useState<string | null>(null);
  const [emoProb, setEmoProb] = useState<string | null>(null);
  const [paragraph, setParagraph] = useState(''); // Adding paragraph state for input form
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    // Update component when hash changes
    const handleHashChange = () => {
      setHash(window.location.hash);
      if (window.location.hash === '#response') {
        // Retrieve data from localStorage when hash is #response
        const techProbStored = localStorage.getItem('techProb');
        const emoProbStored = localStorage.getItem('emoProb');
        setTechProb(techProbStored);
        setEmoProb(emoProbStored);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSubmit = async (paragraph: string) => {
    setLoading(true);
    setError(null);
    setTechProb(null);
    setEmoProb(null);
    try {
      const response = await axios.post(
        '/api/submit-paragraph',
        {
          msg: paragraph,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      setTechProb(data.tech_prob);
      setEmoProb(data.emo_prob);

      // Store data in localStorage
      localStorage.setItem('techProb', data.tech_prob);
      localStorage.setItem('emoProb', data.emo_prob);

      // Change hash to navigate to response UI
      window.location.hash = '#response';
      setHash('#response');
    } catch (error) {
      setError('Failed to submit the paragraph');
      console.error('Error submitting paragraph:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function for rendering no response UI
  const renderNoResponseUI = () => (
    <div>
      <div className="fixed-header">
        <h1>Home Page</h1>
      </div>

      <div style={{ marginTop: '100px', marginBottom: '50px' }}>
        {/* To prevent the form from overlapping */}
        <textarea
          placeholder="Type your paragraph here..."
          value={paragraph}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setParagraph(e.target.value)
          }
          rows={20}
          cols={180}
        ></textarea>
        <br />
        <br />
        <button onClick={() => handleSubmit(paragraph)} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );

  // Function for rendering response UI
  const renderResponseUI = () => (
    <div>
      <div className="fixed-header">
        <h1>Home Page</h1>
      </div>
      <div style={{ marginTop: '100px', marginBottom: '50px' }}>
        {/* To prevent the form from overlapping */}
        <div className="container">
          <div className="box box-left">
            <h2>Technical Part:</h2>
            <textarea
              value={techProb || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTechProb(e.target.value)
              }
              rows={20}
              cols={80}
              placeholder="Technical part will be displayed here..."
              style={{
                backgroundColor: '#f0f0f0',
                color: 'black',
                padding: '10px',
                borderRadius: '5px',
              }}
            ></textarea>
          </div>

          <div className="box box-right">
            <h2>Emotional Part:</h2>
            <textarea
              value={emoProb || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEmoProb(e.target.value)
              }
              rows={20}
              cols={80}
              placeholder="Emotional part will be displayed here..."
              style={{
                backgroundColor: '#f0f0f0',
                color: 'black',
                padding: '10px',
                borderRadius: '5px',
              }}
            ></textarea>
          </div>
        </div>
        <br/>
        <button
          onClick={() => {
            // Clear localStorage and go back to input UI
            localStorage.removeItem('techProb');
            localStorage.removeItem('emoProb');
            setTechProb(null);
            setEmoProb(null);
            window.location.hash = '';
            setHash('');
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Conditionally render based on the hash */}
      {hash === '#response' ? renderResponseUI() : renderNoResponseUI()}
    </div>
  );
};

export default Home;
