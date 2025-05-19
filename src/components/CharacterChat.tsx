import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { sendMessage, saveChatHistory, getChatHistory, ChatMessage, ChatError } from '../services/chat';
import { getCurrentUser } from '../services/auth';

interface CharacterChatProps {
  characterName: string;
  characterImage: string;
  modelName: string;
}

const ChatContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: '12px 16px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

const CharacterAvatar = styled('img')({
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '2px solid white',
});

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  backgroundColor: '#f5f5f5',
});

const MessageBubble = styled(Box)<{ sender: 'user' | 'bot' }>(({ theme, sender }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: 16,
  backgroundColor: sender === 'user' ? theme.palette.primary.main : '#ffffff',
  color: sender === 'user' ? 'white' : 'black',
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  marginLeft: sender === 'user' ? 'auto' : 0,
  marginRight: sender === 'user' ? 0 : 'auto',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const InputContainer = styled(Box)({
  padding: 16,
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  gap: 8,
  backgroundColor: 'white',
});

const CharacterChat: React.FC<CharacterChatProps> = ({ characterName, characterImage, modelName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      if (currentUser) {
        try {
          clearError();
          const history = await getChatHistory(currentUser.id.toString(), characterName);
          setMessages(history);
        } catch (err: unknown) {
          console.error('Error loading chat history:', err);
          if (err instanceof ChatError) {
            setError(err.message);
          } else {
            setError('Unable to load chat history. Please try again.');
          }
        }
      }
    };
    loadChatHistory();
  }, [characterName, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
      characterId: characterName,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    clearError();

    try {
      const response = await sendMessage(input, modelName);

      const botMessage: ChatMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        characterId: characterName,
      };

      const updatedMessages = [...messages, userMessage, botMessage];
      setMessages(updatedMessages);

      if (currentUser) {
        try {
          await saveChatHistory(updatedMessages, currentUser.id.toString(), characterName);
        } catch (err: unknown) {
          console.error('Error saving chat history:', err);
          // Don't show error to user for history saving failures
        }
      }
    } catch (err: unknown) {
      console.error('Error sending message:', err);
      if (err instanceof ChatError) {
        setError(err.message);
      } else {
        setError('Unable to send message. Please check your connection and try again.');
      }
      const errorMessage: ChatMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        characterId: characterName,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (error) {
      clearError();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <CharacterAvatar src={characterImage} alt={characterName} />
        <Typography variant="h6">{characterName}</Typography>
      </ChatHeader>
      <MessagesContainer>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={clearError}
          >
            {error}
          </Alert>
        )}
        {messages.map((message, index) => (
          <MessageBubble key={index} sender={message.sender}>
            <Typography variant="body1">{message.text}</Typography>
          </MessageBubble>
        ))}
        {loading && (
          <Box display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="textSecondary">
              {characterName} is thinking...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Chat with ${characterName}...`}
          value={input}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default CharacterChat; 