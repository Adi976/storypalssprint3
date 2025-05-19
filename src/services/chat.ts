import axios from 'axios';

const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  characterId?: string;
}

export class ChatError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ChatError';
  }
}

// Check if Ollama is running and model is available
const checkOllamaConnection = async (modelName: string): Promise<boolean> => {
  try {
    // First check if Ollama is running
    const tagsResponse = await axios.get(`${OLLAMA_API_URL}/tags`);
    if (!tagsResponse.data || !tagsResponse.data.models) {
      return false;
    }

    // Then check if the model is available
    const modelExists = tagsResponse.data.models.some((model: any) => model.name === modelName);
    if (!modelExists) {
      throw new ChatError(`Model ${modelName} not found. Please make sure it is installed.`, 'MODEL_NOT_FOUND');
    }

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new ChatError('Unable to connect to Ollama. Please make sure it is running.', 'OLLAMA_CONNECTION_ERROR');
      }
      throw new ChatError('Error checking Ollama connection', 'OLLAMA_CHECK_ERROR');
    }
    throw error;
  }
};

export const sendMessage = async (message: string, modelName: string): Promise<string> => {
  try {
    // First check if Ollama is running and model is available
    await checkOllamaConnection(modelName);

    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model: modelName,
      prompt: message,
      stream: false,
    });

    if (!response.data || !response.data.response) {
      throw new ChatError('Invalid response from Ollama');
    }

    return response.data.response;
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new ChatError('Unable to connect to Ollama. Please make sure it is running.', 'OLLAMA_CONNECTION_ERROR');
      }
      if (error.response?.status === 404) {
        throw new ChatError(`Model ${modelName} not found. Please make sure it is installed.`, 'MODEL_NOT_FOUND');
      }
      throw new ChatError(error.response?.data?.error || 'Error communicating with Ollama', 'OLLAMA_API_ERROR');
    }
    throw new ChatError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
};

export const saveChatHistory = async (messages: ChatMessage[], userId: string, characterId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new ChatError('Please log in to save chat history', 'AUTH_ERROR');
    }

    const response = await axios.post(`${API_URL}/chat/history`, {
      messages,
      userId,
      characterId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new ChatError('Please log in to save chat history', 'AUTH_ERROR');
      }
      throw new ChatError(error.response?.data?.error || 'Error saving chat history', 'API_ERROR');
    }
    throw new ChatError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
};

export const getChatHistory = async (userId: string, characterId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new ChatError('Please log in to view chat history', 'AUTH_ERROR');
    }

    const response = await axios.get(`${API_URL}/chat/history/${userId}/${characterId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new ChatError('Please log in to view chat history', 'AUTH_ERROR');
      }
      if (error.response?.status === 404) {
        return []; // Return empty array if no history exists
      }
      throw new ChatError(error.response?.data?.error || 'Error loading chat history', 'API_ERROR');
    }
    throw new ChatError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
}; 