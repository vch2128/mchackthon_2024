import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Input, Form, Button, Typography, Divider, Row, Col } from 'antd';
import CommentList from './components/CommentList';
import { Comment } from '@ant-design/compatible';
import { notification } from 'antd';
import { Comment_t } from './types/comment';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const TechPost =() => {

  const { user } = useContext(UserContext);
  const location = useLocation();
  const { techpost_id } = useParams(); // Access passed state
  const onpage = ( location.pathname == `/tech/post/${techpost_id}` )
  const [commentContent, setCommentContent] = useState('')
  const [techPost, setTechPost] = useState(null);
  const [comments, setComments] = useState<Comment_t[]>([]);
  const avatarUrl = "https://shoplineimg.com/643616b7087ae8002271ceb2/64e073d381afe80022a66ebc/1200x.webp?source_format=png"; // Define the avatar URL


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
      if (commentContent === '') {
        return;
      }
      const response = await axios.post('/api/techcomment', {
        content: commentContent,
        sender_id: user.id,
        techpost_id: techpost_id
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Add the new comment to the existing comments
      setComments(prevComments => [...prevComments, response.data]);
      
      // Clear the comment input
      setCommentContent('');
      
      // Show a success notification
      notification.success({
        message: 'Comment added successfully',
        duration: 3,
      });
      
      return response.data;
    } catch (error) {
      console.error('Comment failed:', error);
      notification.error({
        message: 'Failed to add comment',
        description: 'Please try again later',
        duration: 3,
      });
    }
  }

  return (<>
    {
      onpage && (<>
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography>
            <Title level={3}>{techPost?.topic}</Title>
            <Paragraph style={{fontSize: '16px'}}>{techPost?.content}</Paragraph>
          </Typography>

      <Divider />

      <CommentList comments={comments} />
      
      < Comment
        style={{paddingLeft: '15px', paddingRight: '20px'}}
        avatar={<img src={avatarUrl} style={{ width: 40, height: 40, borderRadius: '50%' }} />} 
        content={
          <div>
            <Form.Item>
                <TextArea rows={4}
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" onClick={leaveAComment} type="primary">
                Add Comment
              </Button>
            </Form.Item>
          </div>
        }
      />
      </Col>
      </Row>
      </>)
    }
  </>);
}

export default TechPost;
