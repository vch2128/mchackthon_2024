import axios from 'axios'

// types for tech posts
export type Post = {
    id: string
    createdAt: string
    content: string
    topic: string
    sender_id: string
    answered: boolean
    best_comment_id: string | null
  }
  

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

  export const getOnePost = async (post_id: string): Promise<Post> => {
    const response = await axios.get(`/api/techposts/${post_id}`);
    console.log("get one post");
    return response.data;
  }

  export const getSearchPosts = async (search_query: string ): Promise<Post[]> => {
    const response = await axios.get(`/api/techposts/search/all/${search_query}`);
    return response.data;
  }

  export const getSearchPostsMy = async (search_query: string, sender_id: string): Promise<Post[]> => {
    try {
      const response = await axios.get(`/api/techposts/search/my/${search_query}/${sender_id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Error fetching search posts for ${sender_id}: ${error.response.status} - ${error.response.statusText}`);
        console.error('Error details:', error.response.data);
      } else {
        console.error(`Error fetching search posts for ${sender_id}:`, error);
      }
      // You might want to throw the error here instead of returning an empty array,
      // depending on how you want to handle errors in the calling code
      throw error;
    }
  };
