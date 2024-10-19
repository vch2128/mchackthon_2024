// @ts-ignore
import { useEffect, useState, useContext } from 'react'
import { getPosts, getSenderPosts, Post } from './types/post'
import PostWithTabs from './components/PostWithTabs'
import { UserContext } from '../../context/UserContext'

const TechBoard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [senderPosts, setSenderPosts] = useState<Post[]>([])
  const { user } = useContext(UserContext);
  
  const refreshPosts = async () => {
    // console.log('User ID:', user.id); // Print user ID to the terminal
    try {
      const posts = await getPosts()
      const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setPosts(sortedPosts)
      const senderPosts = await getSenderPosts(user.id)
      setSenderPosts(senderPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }
  useEffect(() => {
    refreshPosts()
  }, [])

  return (
    <div >
        {<PostWithTabs allposts={posts} myposts={senderPosts} />}
    </div>
  )
}

export default TechBoard