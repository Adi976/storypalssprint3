import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
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

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

const MessageBubble = styled(Box)<{ sender: 'user' | 'bot' }>(({ theme, sender }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: 16,
  backgroundColor: sender === 'user' ? theme.palette.primary.main : '#f0f0f0',
  color: sender === 'user' ? 'white' : 'black',
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  marginLeft: sender === 'user' ? 'auto' : 0,
  marginRight: sender === 'user' ? 0 : 'auto',
}));

const InputContainer = styled(Box)({
  padding: 16,
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  gap: 8,
});

const ChatTest: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'test_user',
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble key={index} sender={message.sender}>
            <Typography variant="body1">{message.text}</Typography>
          </MessageBubble>
        ))}
        {loading && (
          <Box display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="textSecondary">
              StoryPals is thinking...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
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

export default ChatTest; 