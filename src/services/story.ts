import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const storyService = {
  getStory: async () => {
    try {
      const response = await axios.get(`${API_URL}/stories/random`);
      return response.data.content;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  },

  generateStory: async (prompt: string) => {
    try {
      const response = await axios.post(`${API_URL}/stories/generate`, { prompt });
      return response.data.content;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/stories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/stories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      const response = await axios.post(`${API_URL}/stories`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  update: async (id: string, data: any) => {
    try {
      const response = await axios.put(`${API_URL}/stories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/stories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  },
}; 