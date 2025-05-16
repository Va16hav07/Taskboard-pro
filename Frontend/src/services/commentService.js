import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const DEBUG = true; // Set to true to enable request debugging

// Configure axios with token
const getAuthConfig = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('No auth token found');
    throw new Error('Authentication required');
  }
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const createComment = async (commentData) => {
  try {
    if (DEBUG) {
      console.log('Creating comment with data:', commentData);
      console.log('Auth token:', localStorage.getItem('authToken')?.substring(0, 20) + '...');
      console.log('API URL:', `${API_URL}/comments`);
    }
    
    const response = await axios.post(
      `${API_URL}/comments`,
      commentData,
      getAuthConfig()
    );
    
    if (DEBUG) console.log('Comment created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (DEBUG) {
      console.error('Request failed with:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    
    throw error;
  }
};

export const getTaskComments = async (taskId) => {
  try {
    const response = await axios.get(
      `${API_URL}/comments/task/${taskId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/comments/${commentId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
