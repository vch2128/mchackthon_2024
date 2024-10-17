import { useEffect, useState, useContext } from 'react'
import { getPosts, getSenderPosts, Post } from './services/post'
import PostWithTabs from './components/PostWithTabs'
import { UserContext } from '../../context/UserContext'
import './TechBoard.css'
const TechBoard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [senderPosts, setSenderPosts] = useState<Post[]>([])
  const { user } = useContext(UserContext);
  
  const refreshPosts = async () => {
    const posts = await getPosts()
    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setPosts(sortedPosts)
    const senderPosts = await getSenderPosts(user.id)
    setSenderPosts(senderPosts)
  }
  useEffect(() => {
    refreshPosts()
  }, [])

  return (
    <div>
      <div>
        {/* <PostList posts={posts} /> */}
        {<PostWithTabs allposts={posts} myposts={senderPosts} />}
      </div>
    </div>
  )
}

export default TechBoard