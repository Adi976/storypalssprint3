import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { stories } from '../services/api';
import { motion } from 'framer-motion';
import { useToast } from '../components/Toast';
import { CardSkeleton } from '../components/Skeleton';
import { storyService } from '../services/story';

const colors = {
  primary: '#7b5ea7',    // Purple
  secondary: '#f0c3e9',  // Light pink
  accent: '#ff9e6d',     // Orange
  light: '#f9f5ff',      // Very light purple
  dark: '#483c67',       // Dark purple
  cloud: '#ffffff',      // White
  star: '#ffe66d',       // Yellow
  backgroundGradient: 'linear-gradient(to bottom, #b5a8e0, #d5a8f0)',
};

const StoryContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: colors.light,
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40vh',
    background: colors.backgroundGradient,
    zIndex: 0,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.accent,
  color: 'white',
  padding: '12px 25px',
  borderRadius: '30px',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 5px 20px rgba(255, 158, 109, 0.4)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    backgroundColor: '#ff8a50',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(255, 158, 109, 0.5)',
  },
}));

interface Story {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  character: string;
  difficulty: string;
  achievements: string[];
  progress: number;
  audioUrl?: string;
}

const StoryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [fadeIn, setFadeIn] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    setFadeIn(true);
    const fetchStory = async () => {
      if (!id) {
        setError('Story ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await stories.getOne(id);
        setStory(response.data);
      } catch (err) {
        setError('Failed to load story');
        console.error('Error loading story:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchStory();
  }, [id]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Implement audio playback logic here
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
    // Implement volume control logic here
  };

  const handleGenerateStory = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt for the story', 'warning');
      return;
    }

    try {
      setGenerating(true);
      const newStory = await storyService.generateStory(prompt);
      setStory({
        id: '',
        title: '',
        content: newStory,
        coverImage: '',
        character: '',
        difficulty: '',
        achievements: [],
        progress: 0,
      });
      showToast('Story generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate story. Please try again.', 'error');
      console.error('Error generating story:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  if (error || !story) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">{error || 'Story not found'}</Typography>
        <ActionButton onClick={() => navigate('/stories')} sx={{ mt: 2 }}>
          Back to Stories
        </ActionButton>
      </Box>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      style={{ padding: '2rem' }}
    >
      <motion.div variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
        },
      }}>
        <Typography variant="h4" gutterBottom>
          Story Generator
        </Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter your story prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateStory}
            disabled={generating || !prompt.trim()}
            sx={{ mt: 2 }}
          >
            {generating && (
              <CircularProgress size={24} sx={{ mr: 1 }} />
            )}
            Generate Story
          </Button>
        </Box>
        {story && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h5" gutterBottom>
              {story.title || 'Generated Story'}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {story.content}
            </Typography>
          </Paper>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StoryScreen; 