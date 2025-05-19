import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StoryContainer = styled(Box)(({ theme }) => ({
  padding: '100px 20px 40px',
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light}20 100%)`,
}));

const StoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: '4px',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const StoryScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Adventure', 'Fantasy', 'Space', 'Animals', 'Science', 'History'
  ];

  const featuredStories = [
    {
      id: 1,
      title: 'Journey to the Moon',
      description: 'Join Luna on an exciting space adventure to the moon!',
      image: '/images/Luna.png',
      category: 'Space',
      character: 'Luna',
    },
    {
      id: 2,
      title: 'Mystery in the Forest',
      description: 'Help Dodo solve the mysterious sounds in the enchanted forest.',
      image: '/images/Dodo.png',
      category: 'Fantasy',
      character: 'Dodo',
    },
    {
      id: 3,
      title: 'Captain Leo\'s Space Mission',
      description: 'Blast off with Captain Leo on an intergalactic adventure!',
      image: '/images/CaptainLeo.png',
      category: 'Space',
      character: 'Captain Leo',
    },
    {
      id: 4,
      title: 'Gogo\'s Jungle Adventure',
      description: 'Explore the jungle with Gogo and discover amazing animals!',
      image: '/images/Gogo.png',
      category: 'Animals',
      character: 'Gogo',
    },
  ];

  const handleStoryClick = (storyId: number) => {
    navigate(`/story/${storyId}`);
  };

  return (
    <StoryContainer>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Story Library
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Discover magical adventures with your favorite StoryPals characters
          </Typography>
          
          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <FilterIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                onClick={() => {}}
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {featuredStories.map((story) => (
            <Grid item xs={12} sm={6} md={4} key={story.id}>
              <StoryCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={story.image}
                  alt={story.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ mb: 1, fontWeight: 'bold' }}
                  >
                    {story.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {story.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={story.category}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                      }}
                    />
                    <Box>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <BookmarkIcon />
                      </IconButton>
                      <IconButton size="small">
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleStoryClick(story.id)}
                    sx={{
                      borderRadius: '30px',
                      textTransform: 'none',
                      py: 1,
                    }}
                  >
                    Read Story
                  </Button>
                </Box>
              </StoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StoryContainer>
  );
};

export default StoryScreen; 