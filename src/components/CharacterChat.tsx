import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
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
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: '12px 16px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexShrink: 0,
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
  minHeight: 0,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
});

const MessageBubble = styled(Box)<{ sender: 'user' | 'bot'; status?: 'sending' | 'sent' | 'failed' }>(({ theme, sender, status }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: 16,
  backgroundColor: sender === 'user' ? theme.palette.primary.main : '#ffffff',
  color: sender === 'user' ? 'white' : 'black',
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  marginLeft: sender === 'user' ? 'auto' : 0,
  marginRight: sender === 'user' ? 0 : 'auto',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  opacity: status === 'sending' ? 0.7 : 1,
  position: 'relative',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
}));

const InputContainer = styled(Box)({
  padding: 16,
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  gap: 8,
  backgroundColor: 'white',
  flexShrink: 0,
});

const TypingIndicator = styled(Box)({
  display: 'flex',
  gap: 4,
  padding: '8px 12px',
  backgroundColor: '#ffffff',
  borderRadius: 16,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  alignSelf: 'flex-start',
  marginTop: 8,
});

const Dot = styled(Box)({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#7b5ea7',
  animation: 'bounce 1.4s infinite ease-in-out',
  '&:nth-of-type(1)': { animationDelay: '0s' },
  '&:nth-of-type(2)': { animationDelay: '0.2s' },
  '&:nth-of-type(3)': { animationDelay: '0.4s' },
  '@keyframes bounce': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' },
  },
});

const CharacterChat: React.FC<CharacterChatProps> = ({ characterName, characterImage, modelName }) => {
  console.log('CharacterChat rendered with:', { characterName, characterImage, modelName });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = () => {
    setError(null);
  };

  const updateMessageStatus = (message: ChatMessage, status: 'sending' | 'sent' | 'failed'): ChatMessage => {
    return { ...message, status };
  };

  useEffect(() => {
    let isMounted = true;
    const welcomeMessage: ChatMessage = {
      text: `Hello! I'm ${characterName}. Let's chat and create some amazing stories together!`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      characterId: characterName,
      status: 'sent'
    };

    const load = async () => {
      if (!isInitialized) {
        setIsInitialized(true);
        if (currentUser) {
          try {
            clearError();
            const history = await getChatHistory(currentUser.id.toString(), characterName);
            if (isMounted) {
              if (history && history.length > 0) {
                setMessages(history);
              } else {
                setMessages([welcomeMessage]);
              }
            }
          } catch (err) {
            console.error('Error loading chat history:', err);
            if (isMounted) {
              setError('Failed to load chat history. Starting fresh.');
              setMessages([welcomeMessage]);
            }
          }
        } else {
          if (isMounted) setMessages([welcomeMessage]);
        }
      }
    };

    load();
    return () => { isMounted = false; };
  }, [characterName, currentUser, isInitialized]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      characterId: characterName,
      status: 'sending'
    };

    // Clear input and update UI immediately
    setInput('');
    setLoading(true);
    clearError();
    setIsTyping(true);

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message with abort signal
      const response = await sendMessage(userMessage.text, modelName, abortControllerRef.current.signal);

      // Create bot message
      const botMessage: ChatMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        characterId: characterName,
        status: 'sent'
      };

      // Update messages with both user and bot messages
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg === userMessage ? updateMessageStatus(msg, 'sent') : msg
        );
        return [...updatedMessages, botMessage];
      });

      // Save chat history if user is logged in
      if (currentUser) {
        try {
          await saveChatHistory([...messages, userMessage, botMessage], currentUser.id.toString(), characterName);
        } catch (err) {
          console.error('Error saving chat history:', err);
          // Don't show error to user for history saving failures
        }
      }
    } catch (err: unknown) {
      console.error('Error sending message:', err);
      let errorMessage = 'Unable to send message. Please try again.';
      
      if (err instanceof ChatError) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'name' in err) {
        if ((err as any).name === 'AbortError') {
          return; // Don't show error for aborted requests
        }
        if ((err as any).name === 'TypeError' && (err as any).message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
      }
      
      setError(errorMessage);
      // Update user message status to failed
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg === userMessage ? updateMessageStatus(msg, 'failed') : msg
        );
        return updatedMessages;
      });
    } finally {
      setLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = async (message: ChatMessage) => {
    if (loading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    clearError();
    setIsTyping(true);

    // Update message status to sending
    setMessages(prev => {
      const updatedMessages = prev.map(msg => 
        msg === message ? updateMessageStatus(msg, 'sending') : msg
      );
      return updatedMessages;
    });

    try {
      const response = await sendMessage(message.text, modelName, abortControllerRef.current.signal);
      
      const botMessage: ChatMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        characterId: characterName,
        status: 'sent'
      };

      // Update messages with both retried message and bot response
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg === message ? updateMessageStatus(msg, 'sent') : msg
        );
        return [...updatedMessages, botMessage];
      });

      // Save chat history if user is logged in
      if (currentUser) {
        try {
          await saveChatHistory([...messages, message, botMessage], currentUser.id.toString(), characterName);
        } catch (err) {
          console.error('Error saving chat history:', err);
          // Don't show error to user for history saving failures
        }
      }
    } catch (err: unknown) {
      console.error('Error retrying message:', err);
      if (err instanceof ChatError) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'name' in err && (err as any).name === 'AbortError') {
        // Don't show error for aborted requests
        return;
      } else {
        setError('Unable to send message. Please check your connection and try again.');
      }
      // Update message status to failed
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg === message ? updateMessageStatus(msg, 'failed') : msg
        );
        return updatedMessages;
      });
    } finally {
      setLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (error) {
      clearError();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
          <MessageBubble key={index} sender={message.sender} status={message.status}>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {message.text}
            </Typography>
            {message.status === 'failed' && (
              <Tooltip title="Retry sending">
                <IconButton
                  size="small"
                  onClick={() => handleRetry(message)}
                  sx={{
                    position: 'absolute',
                    right: -8,
                    top: -8,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </MessageBubble>
        ))}
        {isTyping && (
          <TypingIndicator>
            <Dot />
            <Dot />
            <Dot />
          </TypingIndicator>
        )}
        <div ref={messagesEndRef} style={{ float: 'left', clear: 'both', height: '1px' }} />
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
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{
            alignSelf: 'flex-end',
            mb: 1,
          }}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default CharacterChat; 