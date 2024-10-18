import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file

const Home: React.FC = () => {
  const [loadingTech, setLoadingTech] = useState(false);
  const [loadingEmo, setLoadingEmo] = useState(false);
  const [errorTech, setErrorTech] = useState<string | null>(null);
  const [errorEmo, setErrorEmo] = useState<string | null>(null);
  const [techProb, setTechProb] = useState<string | null>(null);
  const [emoProb, setEmoProb] = useState<string | null>(null);
  const [paragraph, setParagraph] = useState(''); // Adding paragraph state for input form
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
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

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSubmit = async (paragraph: string) => {
    setLoadingTech(true); // Indicate loading state
    setErrorTech(null);
    setErrorEmo(null);
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

      localStorage.setItem('techProb', data.tech_prob);
      localStorage.setItem('emoProb', data.emo_prob);

      window.location.hash = '#response';
      setHash('#response');
    } catch (error) {
      setErrorTech('Failed to submit the paragraph');
      console.error('Error submitting paragraph:', error);
    } finally {
      setLoadingTech(false);
    }
  };
  const getSimilarTechId = async () => {
    try {
      const response = await axios.post(
        '/api/search/similar',
        {
          msg: techProb,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      return response.data
    } catch (error) {
      setErrorTech('Failed to getSimilarTechId');
      console.error('Error submitting getSimilarTechId:', error);
    }
  }

  const getRelatedComments = async (techPostId: string) => {
    try {
      const response = await axios.get(`/api/techposts/techcomments/${techPostId}`);
      // return a list of data
      console.log(response)
      return response.data
    } catch (error) {
      setErrorTech('Failed to getSimilarTechId');
      console.error('Error submitting getSimilarTechId:', error);
    }
  }

  const handleTechProbSubmit = async () => {
    setLoadingTech(true);
    setErrorTech(null);
    try {
      const similarTechPostId = await getSimilarTechId()
      console.log("similarTechPostId", similarTechPostId)
      const commentsList = await getRelatedComments(similarTechPostId)
      console.log("commentsList", commentsList)
      // const response = await axios.post(
      //   '/api/submit-techprob',
      //   {
      //     techProb,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );

      alert('Technical problem submitted successfully!');
    } catch (error) {
      setErrorTech('Failed to submit the technical problem');
      console.error('Error submitting technical problem:', error);
    } finally {
      setLoadingTech(false);
    }
  };

  const handleEmoProbSubmit = async () => {
    setLoadingEmo(true);
    setErrorEmo(null);
    try {
      const response = await axios.post(
        '/api/submit-emoprob',
        {
          emoProb,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Emotional problem submitted successfully!');
    } catch (error) {
      setErrorEmo('Failed to submit the emotional problem');
      console.error('Error submitting emotional problem:', error);
    } finally {
      setLoadingEmo(false);
    }
  };

  // Function for rendering no response UI
  const renderNoResponseUI = () => (
    <div>
      <div className="fixed-header">
        <h1>Home Page</h1>
      </div>

      <div style={{ marginTop: '100px', marginBottom: '50px' }}>
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
        <button onClick={() => handleSubmit(paragraph)} disabled={loadingTech}>
          {loadingTech ? 'Submitting...' : 'Submit'}
        </button>

        {errorTech && <p style={{ color: 'red' }}>{errorTech}</p>}
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
            <br />
            <button onClick={handleTechProbSubmit} disabled={loadingTech}>
              {loadingTech ? 'Submitting...' : 'Submit Technical'}
            </button>
            {errorTech && <p style={{ color: 'red' }}>{errorTech}</p>}
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
            <br />
            <button onClick={handleEmoProbSubmit} disabled={loadingEmo}>
              {loadingEmo ? 'Submitting...' : 'Submit Emotional'}
            </button>
            {errorEmo && <p style={{ color: 'red' }}>{errorEmo}</p>}
          </div>
        </div>
        <br />
        <button
          onClick={() => {
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
      {hash === '#response' ? renderResponseUI() : renderNoResponseUI()}
    </div>
  );
};

export default Home;