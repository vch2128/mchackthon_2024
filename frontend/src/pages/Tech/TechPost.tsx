import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { UserContext} from '../../context/UserContext';
import { Divider, List, Typography, Input} from 'antd';
import { Comment, addComment, getComments } from '../types/comment';
import { Post, getOnePost } from '../types/post';

const { TextArea } = Input;

// add notification for new comment

const TechPost =() => {
  // const [content, setContent] = useState('')
  
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { techpost_id } = useParams(); // Access passed state
  const onpage = ( location.pathname == `/tech/post/${techpost_id}` )
  const [commentContent, setCommentContent] = useState('')
  const [techPost, setTechPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (onpage) {
      getTechPost();
      getCommentsOfTechPost();
    }
  }, [onpage])

  const getTechPost = async() => {  //ok
    try {
      const response = await axios.get(`/api/techposts/${techpost_id}`);
      console.log("get tech post");
      setTechPost(response.data)
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const getCommentsOfTechPost = async() => {  //ok
    try {
      // the response will be a list of comments
      const response = await axios.get(`/api/techposts/techcomments/${techpost_id}`);
      console.log("get comments");
      setComments(response.data);
      return response.data
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const leaveAComment = async() => {
    try {
      const response = await axios.post('/api/techcomment', {
        content: commentContent,
        sender_id: user.id,
        techpost_id: techpost_id
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (<>
    {
      onpage && (<>
      <div>
        <h2>{techPost?.topic}</h2>
      </div>
      <div>
        <p>{techPost?.content}</p>
      </div>
      
      <List
        header={<div>Comments</div>}
        footer={<div>Answer the question and get points!</div>}
        bordered
        dataSource={comments}
        renderItem={(item) => (
          <List.Item>
            {item.content}
          </List.Item>
        )}
      />
      <form onSubmit={leaveAComment}>
        <div>
          <TextArea rows={4}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
        </div>
        <button type="submit">submit</button>
      </form>
      </>)
    }
  </>);
}

export default TechPost;
