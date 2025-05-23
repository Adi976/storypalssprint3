import axios, { AxiosRequestConfig } from 'axios';

const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  characterId?: string;
  status?: 'sending' | 'sent' | 'failed';
  retryCount?: number;
}

export class ChatError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'ChatError';
    this.code = code;
  }
}

// Queue for handling message retries
const messageQueue: ChatMessage[] = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || messageQueue.length === 0) return;
  
  isProcessingQueue = true;
  const message = messageQueue[0];
  
  try {
    const response = await sendMessage(message.text, message.characterId || 'gemma:2b');
    messageQueue.shift(); // Remove the processed message
    return response;
  } catch (error) {
    if (message.retryCount && message.retryCount < 3) {
      message.retryCount++;
      // Move to end of queue
      messageQueue.push(messageQueue.shift()!);
    } else {
      messageQueue.shift(); // Remove failed message after max retries
      throw error;
    }
  } finally {
    isProcessingQueue = false;
    if (messageQueue.length > 0) {
      processQueue();
    }
  }
};

export const queueMessage = (message: ChatMessage) => {
  messageQueue.push(message);
  return processQueue();
};

const checkOllamaConnection = async (): Promise<void> => {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/tags`, { timeout: 5000 });
    const models = response.data.models || [];
    if (models.length === 0) {
      throw new ChatError('No models available in Ollama. Please install at least one model.', 'NO_MODELS');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new ChatError('Ollama service is not running. Please start Ollama with "ollama serve" command.', 'OLLAMA_ERROR');
      }
      throw new ChatError('Unable to connect to Ollama service. Please check if it is running.', 'OLLAMA_ERROR');
    }
    throw error;
  }
};

export const sendMessage = async (message: string, modelName: string, signal?: AbortSignal): Promise<string> => {
  try {
    // First check if Ollama is running
    await checkOllamaConnection();

    const token = localStorage.getItem('token');
    const config: AxiosRequestConfig = {
      signal,
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    };

    if (!token) {
      // For public chat, we should still allow messages without authentication
      const response = await axios.post(`${API_URL}/public-chat/`, {
        character: modelName.split(':')[0],
        content: message
      }, config);
      
      if (!response.data || !response.data.response) {
        throw new ChatError('Invalid response from server', 'INVALID_RESPONSE');
      }

      return response.data.response;
    }

    // If authenticated, use the authenticated endpoint
    const response = await axios.post(`${API_URL}/chats/send_message/`, {
      content: message,
      is_from_user: true
    }, config);

    if (!response.data || !response.data.response) {
      throw new ChatError('Invalid response from server', 'INVALID_RESPONSE');
    }

    return response.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.name === 'CanceledError') {
        throw new ChatError('Request was canceled', 'CANCELED');
      }
      if (error.response?.status === 503) {
        throw new ChatError(error.response.data.error || 'Ollama service is not running', 'OLLAMA_ERROR');
      }
      if (error.response?.status === 401) {
        throw new ChatError('Please log in to continue', 'AUTH_ERROR');
      }
      throw new ChatError(error.response?.data?.message || 'Failed to send message', 'API_ERROR');
    }
    throw error;
  }
};

export const getChatHistory = async (userId: string, characterId: string): Promise<ChatMessage[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return []; // Return empty array for unauthenticated users
    }

    const response = await axios.get(`${API_URL}/chats/history/`, {
      params: {
        child: userId,
        character: characterId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.data) {
      return [];
    }

    // The backend now returns messages in the correct format
    return response.data;
  } catch (error) {
    console.error('Error loading chat history:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new ChatError('Please log in to view chat history', 'AUTH_ERROR');
      }
      throw new ChatError('Failed to load chat history', 'API_ERROR');
    }
    return []; // Return empty array on any error
  }
};

export const saveChatHistory = async (messages: ChatMessage[], userId: string, characterId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return; // Silently fail for unauthenticated users
    }

    // First, get or create a chat session
    const chatResponse = await axios.post(`${API_URL}/chats/`, {
      child: userId,
      character: characterId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const chatId = chatResponse.data.id;

    // Save the latest message
    const latestMessage = messages[messages.length - 1];
    await axios.post(`${API_URL}/chats/${chatId}/send_message/`, {
      content: latestMessage.text,
      is_from_user: latestMessage.sender === 'user'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error saving chat history:', error);
    // Don't throw error to prevent UI freezing, but log it
    if (axios.isAxiosError(error)) {
      console.error('Server response:', error.response?.data);
    }
  }
};

export const getChatAnalytics = async (userId: string, days: number = 30) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new ChatError('Please log in to view analytics', 'AUTH_ERROR');
    }

    const response = await axios.get(`${API_URL}/chats/analytics/`, {
      params: {
        child_id: userId,
        days: days
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new ChatError('Please log in to view analytics', 'AUTH_ERROR');
      }
      throw new ChatError(error.response?.data?.error || 'Error loading analytics', 'API_ERROR');
    }
    throw new ChatError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
}; 