import { useEffect, useState, useContext } from 'react'
import { getPosts, getSearchPostsMy, getSearchPosts, getSenderPosts, Post } from './types/post'
import PostWithTabs from './components/PostWithTabs'
import { UserContext } from '../../context/UserContext'

interface TechBoardProps {
  isSearching: boolean;
  searchQuery: string;
}

const TechBoard: React.FC<TechBoardProps> = ({ isSearching, searchQuery }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [senderPosts, setSenderPosts] = useState<Post[]>([])
  const { user } = useContext(UserContext);
  
  const refreshPosts = async () => {
    console.log('User ID:', user.id); // Print user ID to the terminal
    if (!isSearching){
      try {
        const posts = await getPosts()
        const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setPosts(sortedPosts)
        const senderPosts = await getSenderPosts(user.id)
        setSenderPosts(senderPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }else{
      try{
        const posts = await getSearchPosts(searchQuery)
        setPosts(posts)
        const senderPosts = await getSearchPostsMy(searchQuery, user.id)
        setSenderPosts(senderPosts)
      }catch(error){
        console.error('Error fetching search posts:', error)
        console.log("posts: ", posts)
        console.log("senderPosts: ", senderPosts)
      }
    }
  }
  useEffect(() => {
    refreshPosts()
  }, [isSearching, searchQuery])

  return (
    <div >
        {<PostWithTabs allposts={posts} myposts={senderPosts} />}
    </div>
  )
}

export default TechBoard