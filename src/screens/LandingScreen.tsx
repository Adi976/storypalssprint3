import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Grid,
  Fade,
  Zoom,
  Grow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Facebook as FacebookIcon,
  Google as GoogleIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
  LinkedIn as LinkedInIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ChatTest from '../components/ChatTest';
import CharacterChat from '../components/CharacterChat';
import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import Navbar from '../components/Navbar';

// Import images
import LunaImage from '../assets/images/Luna.png';
import GogoImage from '../assets/images/Gogo.png';
import DodoImage from '../assets/images/Dodo.png';
import CaptainLeoImage from '../assets/images/captain_leo.png';
import AllCharactersImage from '../assets/images/All of them.png';
import ParentDashboardImage from '../assets/images/parentdashboard.png';

// Color palette
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

const FloatingChatButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  width: 60,
  height: 60,
  backgroundColor: colors.accent,
  color: 'white',
  boxShadow: '0 5px 20px rgba(255, 158, 109, 0.4)',
  '&:hover': {
    backgroundColor: '#ff8a50',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(255, 158, 109, 0.5)',
  },
  transition: 'all 0.3s ease',
}));

const FloatingChatWindow = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 90,
  right: 20,
  width: 350,
  height: 500,
  borderRadius: 20,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1000,
}));

const CharacterCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 280,
  height: 320,
  backgroundColor: 'white',
  borderRadius: 20,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'all 0.5s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  transformStyle: 'preserve-3d',
  perspective: '1000px',
  '&:hover': {
    transform: 'translateY(-10px) rotateY(10deg)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    '& .character-image': {
      transform: 'scale(1.1) translateZ(20px)',
    },
    '& .character-glow': {
      opacity: 1,
    },
    '& .character-info': {
      transform: 'translateZ(30px)',
    },
  },
}));

const CharacterImage = styled('img')({
  width: 120,
  height: 120,
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: 15,
  border: '5px solid #f0c3e9',
  transition: 'transform 0.5s ease',
  backgroundColor: 'white',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
});

const CharacterInfo = styled(Box)({
  transition: 'transform 0.5s ease',
  textAlign: 'center',
});

const CharacterGlow = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: 20,
  background: 'radial-gradient(circle at 50% 50%, rgba(240, 195, 233, 0.6), transparent 70%)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  pointerEvents: 'none',
});

const FeatureCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: 20,
  padding: theme.spacing(3),
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.5s ease',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    '& .feature-icon': {
      transform: 'scale(1.2) rotate(10deg)',
    },
    '& .feature-content': {
      transform: 'translateY(-5px)',
    },
  },
}));

const FeatureIcon = styled(Box)({
  fontSize: '3rem',
  marginBottom: 15,
  transition: 'transform 0.5s ease',
});

const FeatureContent = styled(Box)({
  transition: 'transform 0.5s ease',
});

const TestimonialCard = styled(Paper)(({ theme }) => ({
  minWidth: 350,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: theme.spacing(3),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
  height: '100%',
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  height: 400,
  backgroundColor: colors.light,
  borderRadius: 20,
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  marginTop: 40,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: colors.primary,
  color: 'white',
  padding: '15px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 15,
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: 20,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
}));

interface MessageProps {
  isBot: boolean;
  children: React.ReactNode;
}

const Message = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isBot',
})<MessageProps>(({ theme, isBot }) => ({
  maxWidth: '70%',
  padding: '12px 15px',
  borderRadius: 15,
  fontSize: '0.95rem',
  lineHeight: 1.4,
  position: 'relative',
  backgroundColor: isBot ? '#e9dfff' : colors.primary,
  color: isBot ? colors.dark : 'white',
  alignSelf: isBot ? 'flex-start' : 'flex-end',
  borderBottomLeftRadius: isBot ? 5 : 15,
  borderBottomRightRadius: isBot ? 15 : 5,
}));

const ChatInput = styled(Box)(({ theme }) => ({
  padding: 15,
  display: 'flex',
  gap: 10,
  backgroundColor: 'white',
  borderTop: '1px solid #eee',
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: colors.dark,
  color: 'white',
  padding: '60px 20px 30px',
}));

const FooterGrid = styled(Grid)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
}));

const SocialIcon = styled('a')(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: colors.accent,
    transform: 'translateY(-3px)',
  },
}));

const ParallaxSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(123, 94, 167, 0.9), rgba(240, 195, 233, 0.9))',
    zIndex: 1,
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  '& > *': {
    position: 'absolute',
    animation: 'float 6s ease-in-out infinite',
  },
}));

const InteractiveCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(45deg, #ff9e6d, #7b5ea7)',
    borderRadius: 'inherit',
    zIndex: -1,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const FloatingElements = () => (
  <FloatingElement>
    {[...Array(20)].map((_, i) => (
      <Box
        key={i}
        sx={{
          width: Math.random() * 20 + 10,
          height: Math.random() * 20 + 10,
          background: colors.star,
          borderRadius: '50%',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </FloatingElement>
);

const LandingScreen: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  const particlesLoaded = async (container: any) => {
    console.log("Particles loaded", container);
  };

  const characterModels = {
    'Luna': 'luna:latest',
    'Gogo': 'gogo:latest',
    'Dodo': 'dodo:latest',
    'Captain Leo': 'leo:latest'
  };

  const handleCharacterClick = (characterName: string) => {
    setSelectedCharacter(characterName);
    // Scroll to chat section
    const chatSection = document.getElementById('chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderCharacterChat = () => {
    console.log('renderCharacterChat called, selectedCharacter:', selectedCharacter);
    if (!selectedCharacter) return null;

    const characterImages = {
      'Luna': LunaImage,
      'Gogo': GogoImage,
      'Dodo': DodoImage,
      'Captain Leo': CaptainLeoImage
    };

    return (
      <Box 
        id="chat" 
        sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center',
          minHeight: '600px',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(123, 94, 167, 0.1), rgba(240, 195, 233, 0.1))',
            borderRadius: '20px',
            zIndex: -1,
          }
        }}
      >
        <CharacterChat
          characterName={selectedCharacter}
          characterImage={characterImages[selectedCharacter as keyof typeof characterImages]}
          modelName={characterModels[selectedCharacter as keyof typeof characterModels]}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Navbar />
      <Box sx={{ pt: { xs: 8, sm: 9 } }}>
        {/* Where Stories Come Alive Section with Magical Friends merged */}
        <ParallaxSection>
          <FloatingElements />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Fade in={fadeIn} timeout={1000} style={{ transitionDelay: '200ms' }}>
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        color: colors.cloud,
                        fontWeight: 'bold',
                        mb: 3,
                        textShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      Where Stories Come Alive
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: colors.cloud,
                        mb: 4,
                        lineHeight: 1.6,
                        textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      Watch as your child's imagination takes flight with our interactive storytelling platform. Every story is a new adventure waiting to be discovered.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        onClick={() => navigate('/auth')}
                        sx={{
                          backgroundColor: colors.cloud,
                          color: colors.primary,
                          '&:hover': {
                            backgroundColor: colors.light,
                          },
                        }}
                      >
                        Start Your Journey
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: colors.cloud,
                          color: colors.cloud,
                          '&:hover': {
                            borderColor: colors.cloud,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        Watch Demo
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} md={6}>
                <Zoom in={fadeIn} timeout={1000} style={{ transitionDelay: '400ms' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -20,
                        left: -20,
                        right: -20,
                        bottom: -20,
                        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent 70%)',
                        borderRadius: '30px',
                        zIndex: -1,
                      },
                    }}
                  >
                    <img
                      src={AllCharactersImage}
                      alt="StoryPals Characters"
                      style={{
                        width: '100%',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  </Box>
                </Zoom>
              </Grid>
            </Grid>
          </Container>
        </ParallaxSection>

        {/* Meet Our Characters Section */}
        <Box sx={{ py: 8, px: 2, backgroundColor: colors.light }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                color: colors.primary,
                fontWeight: 'bold',
                mb: 6,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 4,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                  borderRadius: 2,
                }
              }}
            >
              Meet Our Characters
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              {[
                { name: 'Luna', image: LunaImage, description: 'The Star Fairy', color: '#7b5ea7' },
                { name: 'Gogo', image: GogoImage, description: 'The Adventure Guide', color: '#ff9e6d' },
                { name: 'Dodo', image: DodoImage, description: 'The Wise Owl', color: '#4a90e2' },
                { name: 'Captain Leo', image: CaptainLeoImage, description: 'The Brave Explorer', color: '#50c878' }
              ].map((character, index) => (
                <Grid item xs={12} sm={6} md={3} key={character.name}>
                  <Grow in={fadeIn} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                    <CharacterCard
                      onClick={() => handleCharacterClick(character.name)}
                      sx={{
                        background: `linear-gradient(135deg, ${character.color}15, ${character.color}05)`,
                        border: `2px solid ${character.color}30`,
                        '&:hover': {
                          transform: 'translateY(-15px)',
                          boxShadow: `0 20px 40px ${character.color}20`,
                          '& .character-image': {
                            transform: 'scale(1.1) translateZ(20px)',
                            borderColor: character.color,
                          },
                        },
                      }}
                    >
                      <CharacterImage
                        src={character.image}
                        alt={character.name}
                        className="character-image"
                        sx={{
                          border: `5px solid ${character.color}40`,
                          transition: 'all 0.5s ease',
                        }}
                      />
                      <CharacterInfo>
                        <Typography 
                          variant="h5" 
                          gutterBottom 
                          sx={{ 
                            color: character.color,
                            fontWeight: 'bold',
                          }}
                        >
                          {character.name}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="textSecondary" 
                          sx={{ 
                            mb: 3,
                            color: colors.dark,
                            opacity: 0.8,
                          }}
                        >
                          {character.description}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCharacterClick(character.name);
                          }}
                          sx={{
                            backgroundColor: character.color,
                            color: 'white',
                            '&:hover': {
                              backgroundColor: character.color,
                              opacity: 0.9,
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Meet {character.name}
                        </Button>
                      </CharacterInfo>
                      <CharacterGlow
                        className="character-glow"
                        sx={{
                          background: `radial-gradient(circle at 50% 50%, ${character.color}30, transparent 70%)`,
                        }}
                      />
                    </CharacterCard>
                  </Grow>
                </Grid>
              ))}
            </Grid>
            {renderCharacterChat()}
          </Container>
        </Box>

        {/* Magical Features Section */}
        <Box sx={{ py: 8, px: 2, backgroundColor: 'white' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: colors.primary,
                fontWeight: 'bold',
                mb: 6,
              }}
            >
              Magical Features for Young Minds
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  title: 'Interactive Storytelling',
                  description: 'Children can co-create stories with their StoryPal, developing creativity and narrative skills while having fun.',
                  icon: '📚',
                },
                {
                  title: 'Child-Safe Environment',
                  description: 'StoryPals is designed with safety first. All content is age-appropriate and interactions are monitored.',
                  icon: '🛡️',
                },
                {
                  title: 'Educational Content',
                  description: 'Each character specializes in different educational areas, making learning an adventure!',
                  icon: '🎓',
                },
                {
                  title: 'Creative Companion',
                  description: 'StoryPals respond to children\'s ideas, ask thoughtful questions, and encourage imagination.',
                  icon: '🎨',
                },
                {
                  title: 'Personalized Experience',
                  description: 'StoryPals remember preferences, past stories, and adapt to each child\'s interests.',
                  icon: '⭐',
                },
                {
                  title: 'Emotional Intelligence',
                  description: 'StoryPals help children explore emotions through stories, building empathy and emotional vocabulary.',
                  icon: '❤️',
                },
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Zoom in={fadeIn} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                    <FeatureCard>
                      <FeatureIcon className="feature-icon">
                        {feature.icon}
                      </FeatureIcon>
                      <FeatureContent className="feature-content">
                        <Typography
                          variant="h5"
                          sx={{
                            color: colors.primary,
                            fontWeight: 'bold',
                            mb: 2,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: colors.dark,
                            lineHeight: 1.6,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </FeatureContent>
                    </FeatureCard>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ py: 8, px: 2, backgroundColor: colors.secondary }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: colors.primary,
                fontWeight: 'bold',
                mb: 6,
              }}
            >
              What Families Are Saying
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  name: 'Sarah M.',
                  role: 'Parent of Alex, 6',
                  text: 'StoryPals has completely transformed our bedtime routine. My son Alex used to resist going to bed, but now he can\'t wait to continue his adventure with Captain Leo.',
                },
                {
                  name: 'David T.',
                  role: 'Father of Lily, 7',
                  text: 'As a busy parent, I was looking for something both entertaining and educational. StoryPals exceeded my expectations. My daughter\'s vocabulary has expanded dramatically.',
                },
                {
                  name: 'Maya J.',
                  role: 'Mother of Twins, 5',
                  text: 'My twins have very different interests, but StoryPals adapts to both of them perfectly. Emma loves space adventures with Luna while Noah enjoys solving mysteries.',
                },
              ].map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TestimonialCard>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.primary,
                        fontWeight: 'bold',
                        mb: 1,
                      }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: colors.dark,
                        opacity: 0.8,
                        mb: 2,
                      }}
                    >
                      {testimonial.role}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.dark,
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                  </TestimonialCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Parent Dashboard Section */}
        <Box sx={{ py: 8, px: 2, backgroundColor: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      color: colors.primary,
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    Parent Dashboard
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.dark,
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    Monitor your child's progress, track their reading journey, and stay connected with their learning adventure. Our comprehensive dashboard gives you insights into their development and achievements.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      borderRadius: '30px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(123, 94, 167, 0.3)',
                      '&:hover': {
                        backgroundColor: colors.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(123, 94, 167, 0.4)',
                      },
                    }}
                  >
                    Try Dashboard
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      right: -20,
                      bottom: -20,
                      background: 'radial-gradient(circle at center, rgba(123, 94, 167, 0.1), transparent 70%)',
                      borderRadius: '30px',
                      zIndex: 0,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={ParentDashboardImage}
                    alt="Parent Dashboard"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '20px',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Join Our Growing Community Section */}
        <Box sx={{ py: 8, px: 2, backgroundColor: colors.light }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: colors.primary,
                fontWeight: 'bold',
                mb: 6,
              }}
            >
              Join Our Growing Community
            </Typography>
            <Grid container spacing={4}>
              {[
                { number: '10K+', label: 'Happy Children' },
                { number: '50K+', label: 'Stories Created' },
                { number: '95%', label: 'Parent Satisfaction' },
                { number: '24/7', label: 'Support Available' },
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Grow in={fadeIn} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 4,
                        backgroundColor: colors.cloud,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                        },
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          color: colors.primary,
                          fontWeight: 'bold',
                          mb: 1,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: colors.dark,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <FooterContainer>
          <FooterGrid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <img src={LunaImage} alt="StoryPals Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    StoryPals
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                  StoryPals brings magical AI companions to children, creating a safe space for creativity, learning, and fun through interactive storytelling.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <SocialIcon href="#"><FacebookIcon /></SocialIcon>
                  <SocialIcon href="#"><TwitterIcon /></SocialIcon>
                  <SocialIcon href="#"><InstagramIcon /></SocialIcon>
                  <SocialIcon href="#"><YouTubeIcon /></SocialIcon>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Quick Links
              </Typography>
              <List dense>
                {['Home', 'About Us', 'Our Characters', 'For Parents', 'Safety & Privacy', 'Subscription Plans'].map((item) => (
                  <ListItem key={item} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={item}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Contact Us
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0.5 }}>
                  <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1 }} />
                  <ListItemText primary="hello@storypals.com" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1 }} />
                  <ListItemText primary="+1 (555) 123-4567" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <LocationIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1 }} />
                  <ListItemText primary="123 Imagination Lane, Storyville, ST 12345" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                Subscribe to our newsletter for the latest StoryPals news and features.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Your email address"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.accent,
                    '&:hover': {
                      backgroundColor: '#ff8a50',
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </FooterGrid>

          <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              © {new Date().getFullYear()} StoryPals. All rights reserved. | Privacy Policy | Terms of Service
            </Typography>
          </Box>
        </FooterContainer>

        {/* Login Modal */}
        {showLoginModal && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
            }}
            onClick={() => setShowLoginModal(false)}
          >
            <Paper
              sx={{
                width: '90%',
                maxWidth: 500,
                p: 4,
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary">
                  Parent Login
                </Typography>
                <IconButton onClick={() => setShowLoginModal(false)}>
                  <i className="fas fa-times" />
                </IconButton>
              </Box>

              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Email" type="email" required />
                <TextField label="Password" type="password" required />
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <Button variant="contained" color="primary" type="submit">
                  Log In
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                  <Divider sx={{ flex: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{ flex: 1 }}
                  >
                    Google
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    sx={{ flex: 1 }}
                  >
                    Facebook
                  </Button>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Don't have an account?{' '}
                  <Button color="primary" onClick={() => navigate('/auth')}>
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LandingScreen; 