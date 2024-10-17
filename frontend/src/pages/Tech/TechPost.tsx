import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { UserContext} from '../../context/UserContext';

const TechPost =(techpost_id: string) => {
  // const [content, setContent] = useState('')
  const { user } = useContext(UserContext);
  const location = useLocation();
  const onpage = ( location.pathname == '/tech/post' )
  const [commentContent, setCommentContent] = useState('')

  const getComments = async() => {
    try {
      // the response will be a list of comments
      const response = await axios.get(`/api/techposts/techcomments/${techpost_id}`);
      console.log(response.data);
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
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  return (<>
    {
      onpage && (<>

      </>)
    }
  </>);
}

export default TechPost;
