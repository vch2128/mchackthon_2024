import { useState } from 'react';

function Home() {
  const [paragraph, setParagraph] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Explicitly type error as string or null

  const handleSubmit = async () => {
    setLoading(true); // Show loading state
    setError(null);   // Reset error state
    try {
      const response = await fetch('/api/submit-paragraph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({
          paragraph, // Send the paragraph in the body of the request
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert(`Paragraph submitted successfully: ${data.message}`);
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
