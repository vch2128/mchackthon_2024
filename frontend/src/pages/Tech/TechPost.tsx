// @ts-nocheck
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Input, Form, Button, Typography, Divider, Row, Col } from 'antd';
import CommentList from './components/CommentList';
import { Comment } from '@ant-design/compatible';
import { QuestionOutlined } from '@ant-design/icons';
import { notification, Avatar, Popover } from 'antd';
import { Comment_t, updateWallet } from './types/comment';
import { getPostSender } from './types/post';

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
  const [isSender, setIsSender] = useState<boolean>(false);
  
  let avatarUrl = "https://shoplineimg.com/643616b7087ae8002271ceb2/64e073d381afe80022a66ebc/1200x.webp?source_format=png";
  if(isSender){
    avatarUrl = "https://shopage.s3.amazonaws.com/media/f857/846201608331_89697379488539675730.webp";
  }

  useEffect(() => {
    if (onpage) {
      getTechPost();
      getCommentsOfTechPost();
    }
  }, [onpage])

  const getTechPost = async() => {  
    try {
      const response = await axios.get(`/api/techposts/${techpost_id}`);
      console.log("get tech post");
      if (user) {
        setIsSender(response.data.sender_id === user.id);
        //console.log("compare", response.data.sender_id === user.id);
      }
      setTechPost(response.data)
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  useEffect(() => {
    //console.log("is sender (updated)", isSender);
  }, [isSender]);

  const getCommentsOfTechPost = async() => {  
    try {
      // the response will be a list of comments
      const response = await axios.get(`/api/techposts/techcomments/${techpost_id}`);
      console.log("get comments");
      const sortedComments = response.data.sort((a, b) => {
        if (a.is_best) return -1;
        if (b.is_best) return 1;
        return 0;
      });
      setComments(sortedComments);
      return sortedComments;
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
      console.log(response.data);
      setCommentContent('');
      getCommentsOfTechPost();

      const postSender = await getPostSender(techpost_id);
      if(postSender !== user.id){
        updateWallet(user.id, 10);
        console.log("update wallet");
        console.log("post sender: ", postSender);
        console.log("comment sender: ", user.id);
      }
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
    <div style={{ position: 'absolute', top: 70, right: 10 }}>
      <Popover 
        content={
          <>
            Help others who are facing challenges. You will earn
            <br />
            rewards by providing answers to their questions.
          </>
        }
        title="Help"
        trigger="click"
        placement="bottomRight"
      >
        <Avatar
          style={{ cursor: 'pointer' }}
          icon={<QuestionOutlined />}
          size="large"
        />
      </Popover>
    </div>
    {
      
      onpage && (<>
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography>
            <Title level={3}>{techPost?.topic}</Title>
            <Paragraph style={{fontSize: '16px'}}>{techPost?.content}</Paragraph>
          </Typography>

      <Divider />
        {/* <p>Comments</p> */}
      <CommentList comments={comments} refetchComments={getCommentsOfTechPost} isSender={isSender}/>
      
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
