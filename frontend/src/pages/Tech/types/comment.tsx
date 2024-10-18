import axios from 'axios'

// types for comments
export type Comment_t = {
    id: string
    createdAt: string
    content: string
    sender_id: string
    tech_post_id: string
}

// services for comments
export const getComments = async (techpost_id: string): Promise<Comment[]> => {
    // the response will be a list of comments
    const response = await axios.get(`/api/techposts/techcomments/${techpost_id}`);
    console.log("get comments");
    return response.data
}

export const addComment = async (comment: Comment): Promise<Comment> => {
    const response = await axios.post('/api/techcomment', comment);
    console.log("add comment");
    return response.data
}

