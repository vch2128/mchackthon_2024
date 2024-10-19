import axios from 'axios'

// types for comments
export type Comment_t = {
    id: string
    createdAt: string
    content: string
    sender_id: string
    tech_post_id: string
    is_best: boolean
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

export const updateWallet = async (employee_id: string, value: number): Promise<void> => {
    try{
        console.log("update wallet", employee_id, value);
        await axios.put(`/api/employee/update_wallet`, {
            value: value,
            employee_id: employee_id
        });
    } catch (error) {
        console.error(`Error updating wallet for ${employee_id}:`, error);
        throw error;
    }
}
