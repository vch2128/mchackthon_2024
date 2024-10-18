import axios from 'axios'

// types for tech posts
export type Post = {
    id: string
    createdAt: string
    content: string
    sender_id: string
    answered: boolean
    best_comment_id: string | null
  }
  
  // export type PostBody = Omit<Post, 'id' | 'createdAt'>

  // services for tech posts
  export const getPosts = async (): Promise<Post[]> => {
    const response = await axios.get('/api/techposts')
    return response.data
  }

  export const getSenderPosts = async (sender_id: string): Promise<Post[]> => {
    const response = await axios.get(`/api/techposts/sender/${sender_id}`)
    return response.data
  }

  export const getOthersPosts = async (sender_id: string): Promise<Post[]> => {
    const response = await axios.get(`/api/techposts/others/${sender_id}`)
    return response.data
  }

  // export const getPost = async (id: string): Promise<Post> => {
  //   const response = await axios.get(`/api/tech/posts/${id}`)
  //   return response.data
  // }