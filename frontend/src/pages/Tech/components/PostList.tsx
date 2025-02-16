import { Card } from 'antd'
import React from 'react'
import { Post } from '../types/post'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

interface PostListProps {
  posts: Post[]
}

const dateStringFormat = (dateString: string) => dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const navigate = useNavigate();
  const handleCardClick = (post_id: string) => {
    try {
      console.log(`Card clicked for post ID: ${post_id}`);
      navigate(`/tech/post/${post_id}`)
    } catch (error) {
      if(error instanceof Error && error.message === '404') {
        console.log('404 error')
      }
      console.error(`Error navigating to post ${post_id}: ${error}`);
    }
  };
  if (posts.length === 0) {
    return(
      <Typography.Text style={{fontSize: '16px', margin: '2em 0', padding: '30px'}}>No posts found</Typography.Text>
    )
  }
  return (
    <div>
    {posts.map((post) => (
      <Card size={'default'} 
      style={{ marginTop: '1em', 
                width: 500, 
                cursor: 'pointer',
                maxHeight: '150px',
                overflow: 'hidden',
                backgroundColor: post.answered ? '#f6ffed' : 'white'}} 
      key={post.id}
      onClick={() => handleCardClick(post.id)}
      >
        <p style={{ textAlign: 'left' , fontWeight: 'bold', fontSize: '16px', margin: '3px 0'} }>
        {post.answered? <CheckCircleOutlined /> : <QuestionCircleOutlined />} {post.topic} 
        </p>
        <p style={{ textAlign: 'right' , fontSize: '13px', margin: '1px 0'}}>{dateStringFormat(post.createdAt)}</p>   
        {/* <p style={{ textAlign: 'right' , fontSize: '13px', margin: '1px 0'}}>{post.sender_id}</p>                                                post.sender_id todo: change to title */}
        <p style={{ textAlign: 'left', whiteSpace: 'pre-wrap', fontSize: '15px', margin: '3px 0' }}>{post.content}</p>
      </Card>
    ))}
    </div>
  )
}

export default PostList
