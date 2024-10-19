import React, { useState, useEffect, useContext, useCallback} from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
// import { Button, Modal } from 'antd';
import { Modal, Avatar, Popover, Button } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

const Home: React.FC = () => {
  const [loadingTech, setLoadingTech] = useState(false);
  const [loadingEmo, setLoadingEmo] = useState(false);
  const [errorTech, setErrorTech] = useState<string | null>(null);
  const [errorEmo, setErrorEmo] = useState<string | null>(null);
  const [techProb, setTechProb] = useState<string | null>(null);
  const [emoProb, setEmoProb] = useState<string | null>(null);
  const [emoRcvrId, setEmoRcvrId] = useState<string | null>(null);
  const [paragraph, setParagraph] = useState(''); // Adding paragraph state for input form
  
  const [hash, setHash] = useState(window.location.hash);
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  useCallback(() => {
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
  const directlySubmit = async () => {
    setLoadingTech(true); // Indicate loading state
    try {
      const response = await axios.post('/api/techpost',{
          content: techProb,
          sender_id: user.id,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

      const data = response.data;
      console.log(data)
      navigate("/tech")
    } catch (error) {
      setErrorTech('Failed to submit the paragraph');
      console.error('Error submitting paragraph:', error);
    } finally {
      setLoadingTech(false);
    }
  };
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
      return response.data.msg
    } catch (error) {
      setErrorTech('Failed to getSimilarTechId');
      console.error('Error submitting getSimilarTechId:', error);
    }
  }

  const getCommentsOfTechPost = async(techpost_id: string) => {  //ok
    try {
      // the response will be a list of comments
      const response = await axios.get(`/api/techposts/techcomments/${techpost_id}`);
      return response.data
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getGPTpreResponse = async(commentsList: string[]) => {  //ok
    try {
      const response = await axios.post(
        '/api/search/techpost',
        {
          history_answer_list:commentsList,
          msg:techProb
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data
    } catch (error) {
      setErrorTech('Failed to getSimilarTechId');
      console.error('Error submitting getSimilarTechId:', error);
    }
  }

  const navigate = useNavigate();
  const handleTechProbSubmit = async () => {
    setLoadingTech(true);
    setErrorTech(null);
    try {
      const similarTechPostId = await getSimilarTechId()
      const historyComments = await getCommentsOfTechPost(similarTechPostId)
      const contentList: string[] = historyComments.map((comment) => comment.content);
      console.log("historyComments", contentList)
      const reply = await getGPTpreResponse(contentList)

      console.log("history advice: ", reply)
      setModalText(reply.msg)
      showModal()

    } catch (error) {
      setErrorTech('Failed to submit the technical problem');
      console.error('Error submitting technical problem:', error);
    } finally {
      setLoadingTech(false);
    }
  };

  const getEmployeeGPTData = async () => {
    try {
      const response = await axios.get("/api/employee/embeddings");
      return response.data;
    } catch (error) {
      console.error('Error fetching employee embeddings:', error);
      throw error; // Rethrow to allow the caller to handle it
    }
  }
  

  const getMatchRcvrId = async () => {
    try {
      const employeeEmbeddings = await getEmployeeGPTData();
      const response = await axios.post(
        '/api/search/matchrcvr',
        {
          employee_info_list: employeeEmbeddings, // Changed to snake_case
          msg: user.id // Consider renaming if it's an ID
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.msg);
      setEmoRcvrId(response.data.msg);
      alert('Emotional problem submitted successfully to a match!');
    } catch (error) {
      setErrorEmo('Failed to submit the emotional problem');
      console.error('Error submitting emotional problem:', error);
    } finally {
      setLoadingEmo(false);
    }
  };

  const getUnMatchRcvrId = async () => {
    try {
      const employeeEmbeddings = await getEmployeeGPTData();
      const response = await axios.post(
        '/api/search/unmatchrcvr',
        {
          employee_info_list: employeeEmbeddings, // Changed to snake_case
          msg: user.id // Consider renaming if it's an ID
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setEmoRcvrId(response.data.msg);
      alert('Emotional problem submitted successfully to a stranger!');
    } catch (error) {
      setErrorEmo('Failed to submit the emotional problem');
      console.error('Error submitting emotional problem:', error);
    } finally {
      setLoadingEmo(false);
    }
  };

  const sendEmoProbSubmitToSame = async () => {
    setLoadingEmo(true);
    setErrorEmo(null);
    try {
      await getMatchRcvrId();
      // console.log("rcvr",emoProb)
      const response = await axios.post(
        '/api/emomsg',
        {
          sender_id: user.id, // Changed to snake_case
          content: emoProb, // Consider renaming if it's an ID
          rcvr_id: emoRcvrId
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      alert('Emotional problem submitted successfully to a match!');
      navigate('/emo')
    } catch (error) {
      // setErrorEmo('Failed to submit the emotional problem');
      // console.error('Error submitting emotional problem:', error);
    } finally {
      setLoadingEmo(false);
    }
  };

  const sendEmoProbSubmitToDiff = async () => {
    setLoadingEmo(true);
    setErrorEmo(null);
    try {
      await getUnMatchRcvrId();
      const response = await axios.post(
        '/api/emomsg',
        {
          sender_id: user.id, // Changed to snake_case
          content: emoProb, // Consider renaming if it's an ID
          rcvr_id: emoRcvrId
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      alert('Emotional problem submitted successfully to a match!');
      navigate('/emo')
    } catch (error) {
      // setErrorEmo('Failed to submit the emotional problem');
      // console.error('Error submitting emotional problem:', error);
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
            <button onClick={directlySubmit} disabled={loadingTech}>
              {loadingTech ? 'Submitting...' : 'Submit Technical'}
            </button>
            {' '}
            <button onClick={handleTechProbSubmit} disabled={loadingTech}>
              {loadingTech ? 'Submitting...' : 'Get history advice!'}
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
            <button onClick={sendEmoProbSubmitToSame} disabled={loadingEmo}>
              {loadingEmo ? 'Submitting...' : '傳給同溫層'}
            </button>

            {' '}
            <button onClick={sendEmoProbSubmitToDiff} disabled={loadingEmo}>
              {loadingEmo ? 'Submitting...' : '傳給神秘人士'}
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
      <div style={{ position: 'absolute', top: 70, right: 10 }}>
        <Popover 
          content={
            <>
              Describe the issue you're facing at work today, and we'll assist you in finding a solution.
              <br />
              You can also connect with others who are dealing with similar challenges.
            </>}
          title="Help" 
          trigger="click"
          placement="bottomRight"  // Ensure popover appears near the button (comment outside JSX)
        >
          <Avatar
            style={{ cursor: 'pointer' }}
            icon={<QuestionOutlined />}
            size="large"
          />
       </Popover>
      </div>
      <Modal
        title="History advice!"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
      {hash === '#response' ? renderResponseUI() : renderNoResponseUI()}
    </div>
  );
};

export default Home;