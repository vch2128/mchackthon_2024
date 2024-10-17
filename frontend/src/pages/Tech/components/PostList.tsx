import './PostList.css'
import { Card } from 'antd'
import React from 'react'
import { Post } from '../types/post'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

// todo: loading card effect
// todo: card click to show comment

interface PostListProps {
  posts: Post[]
}

const dateStringFormat = (dateString: string) => dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const navigate = useNavigate();
  const handleCardClick = (post_id: string) => {
    console.log(`Card clicked for post ID: ${post_id}`);
    navigate(`/tech/post/${post_id}`)
  };
  
  return (
    <div>
      {posts.map((post) => (
        <Card size={'default'} 
        style={{ marginTop: '1em', 
                 width: 500, 
                 cursor: 'pointer',
                 maxHeight: '150px',
                 overflow: 'hidden',}} 
        key={post.id}
        onClick={() => handleCardClick(post.id)}
        >
          <p style={{ textAlign: 'left' , fontWeight: 'bold', fontSize: '18px', margin: '3px 0'} }>{post.topic}</p>    
          <p style={{ textAlign: 'right' , fontSize: '13px', margin: '1px 0'}}>{dateStringFormat(post.createdAt)}</p>  
          <p style={{ textAlign: 'right' , fontSize: '13px', margin: '1px 0'}}>{post.sender_id}</p>                                                 {/*post.sender_id todo: change to title */}
          <p style={{ textAlign: 'left', whiteSpace: 'pre-wrap', fontSize: '15px', margin: '3px 0' }}>{post.content}</p>
        </Card>
      ))}
    </div>
  )
}

export default PostList