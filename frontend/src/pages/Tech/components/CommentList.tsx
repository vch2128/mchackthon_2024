import { useContext, useEffect, useState } from 'react';
import { List } from 'antd';
import { Comment } from '@ant-design/compatible';
import { CheckCircleOutlined} from '@ant-design/icons';
import { Comment_t, updateWallet } from '../types/comment';
import { updateBestComment} from '../types/post';
import dayjs from 'dayjs';
import { UserContext } from '../../../context/UserContext';
import { getPostSender } from '../types/post';

const dateStringFormat = (dateString: string) => dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')

interface CommentListProps {
  comments: Comment_t[];
  refetchComments: () => void;
  isSender: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, refetchComments, isSender }) => {
  const avatarUrl = "https://shoplineimg.com/643616b7087ae8002271ceb2/64e073d381afe80022a66ebc/1200x.webp?source_format=png";
  const avatarUrl_p = "https://shopage.s3.amazonaws.com/media/f857/846201608331_89697379488539675730.webp"; 

  const { user } = useContext(UserContext);
  const [postSender, setPostSender] = useState(null);

  useEffect(() => {
    const fetchPostSender = async () => {
      const sender = await getPostSender(comments[0].tech_post_id);
      setPostSender(sender);
    };
    fetchPostSender();
  }, [comments]);

  const handleSetBestComment = async (tech_post_id: string, commentId: string, setBest: boolean, comment_sender_id: string) => {
    try {
      await updateBestComment(tech_post_id, commentId, setBest);
      refetchComments();
      if(setBest && comment_sender_id !== user?.id){
        await updateWallet(comment_sender_id, 3);
        console.log("update wallet");
      }
    } catch (error) {
      console.error("Error updating best comment:", error);
    }
  }

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
        <Comment
          style={{
            paddingLeft: '15px', 
            paddingRight: '20px', 
            backgroundColor: item.is_best ? '#f6ffed' : 'white'
          }}
          actions={[
            isSender && (
              <span key="comment-set-best" 
                    onClick={() => handleSetBestComment(item.tech_post_id, item.id, !item.is_best, item.sender_id)} 
                    style={{ cursor: 'pointer' }}>
                {item.is_best ? <CheckCircleOutlined /> : []}
                {item.is_best ? ' Best' : ' Set as Best'}
              </span>)
          ]}
          avatar={
            <img 
              src={item.sender_id === postSender ? avatarUrl_p : avatarUrl} 
              style={{ width: 40, height: 40, borderRadius: '50%' }} 
            />
          }
          content={<p style={{textAlign: 'left'}}>{item.content}</p>}
          datetime={dateStringFormat(item.createdAt)} 
        />
      </li>
      )}
    />
  );
}

export default CommentList;
