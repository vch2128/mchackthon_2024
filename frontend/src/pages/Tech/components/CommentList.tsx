import React from 'react';
import { List, Form, Button, Input } from 'antd';
import { Comment } from '@ant-design/compatible';
import { Comment_t } from '../types/comment';
import dayjs from 'dayjs';

interface CommentListProps {
  comments: Comment_t[]
}

const dateStringFormat = (dateString: string) => dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const avatarUrl = "https://shoplineimg.com/643616b7087ae8002271ceb2/64e073d381afe80022a66ebc/1200x.webp?source_format=png"; // Define the avatar URL

  return (
    <List
    className="comment-list"
    header={`${comments.length} comments`}
    itemLayout="horizontal"
    dataSource={comments}
    style={{
      width: '100%',
      maxHeight: '350px',
      overflow: 'auto',
    }}
    renderItem={item => (
        <li>
        <Comment style={{paddingLeft: '15px', paddingRight: '20px'}}
          // author={item.sender_id}
          avatar={<img src={avatarUrl} style={{ width: 40, height: 40, borderRadius: '50%' }} />} // Display the avatar
          content={<p style={{textAlign: 'left'}}>{item.content}</p>} // Display the comment content
          datetime={dateStringFormat(item.createdAt)} // Display the date/time if needed
        />
      </li>
      )}
    />
  );
}

export default CommentList;