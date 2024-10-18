import React, { useState } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  const [paragraph, setParagraph] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Explicitly type error as string or null

  const handleSubmit = async () => {
    setLoading(true); // Show loading state
    setError(null);   // Reset error state
    try {
      const response = await axios.post('/api/submit-paragraph', {
        msg: paragraph
      },  {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.data;
      alert(`Paragraph submitted successfully: ${data.tech_prob} \n  ${data.emo_prob}`);
    } catch (error) {
      setError('Failed to submit the paragraph');
      console.error('Error submitting paragraph:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>

      <textarea
        placeholder="Type your paragraph here..."
        value={paragraph}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setParagraph(e.target.value)} // Proper typing for the event
        rows={5} 
        cols={40} 
      ></textarea>
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Home;
