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
} from '@mui/icons-material';
import ChatTest from '../components/ChatTest';
import CharacterChat from '../components/CharacterChat';

// Import images
import LunaImage from '../assets/images/Luna.png';
import GogoImage from '../assets/images/Gogo.png';
import DodoImage from '../assets/images/Dodo.png';
import CaptainLeoImage from '../assets/images/captain_leo.png';
import AllCharactersImage from '../assets/images/All of them.png';

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
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    '& .character-image': {
      transform: 'scale(1.1)',
    },
    '& .character-glow': {
      opacity: 1,
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
  transition: 'transform 0.3s ease',
  backgroundColor: 'white',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
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
  transition: 'transform 0.3s, box-shadow 0.3s',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  },
}));

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

const LandingScreen: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hello there, young storyteller! I'm Luna, the Star Fairy. What magical adventure shall we create today?",
      isBot: true,
    },
    {
      text: "Can we go on a trip to the moon?",
      isBot: false,
    },
    {
      text: "What a wonderful idea! I know all about the moon! Did you know that the moon is Earth's only natural satellite? Let's pack our special space backpacks. What should we bring on our moon adventure?",
      isBot: true,
    },
  ]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setMessages([...messages, { text: chatMessage, isBot: false }]);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "That's amazing! I can see Earth getting smaller and smaller below us. The stars are so bright up here without Earth's atmosphere in the way. Look! There's the moon getting closer. Its craters and mountains are becoming visible. Ready to land our rocket in the Sea of Tranquility?",
        isBot: true,
      }]);
    }, 1000);
  };

  const characterModels = {
    'Luna': 'luna:latest',
    'Gogo': 'gogo:latest',
    'Dodo': 'dodo:latest',
    'Captain Leo': 'leo:latest'
  };

  const handleCharacterClick = (characterName: string) => {
    setSelectedCharacter(characterName);
  };

  const renderCharacterChat = () => {
    if (!selectedCharacter) return null;

    const characterImages = {
      'Luna': LunaImage,
      'Gogo': GogoImage,
      'Dodo': DodoImage,
      'Captain Leo': CaptainLeoImage
    };

    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
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
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: colors.backgroundGradient,
          color: colors.light,
          py: 8,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/path/to/pattern.png)',
            opacity: 0.1,
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: 3,
              textShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            Magical Friends for Young Storytellers
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              mb: 4,
              maxWidth: 700,
              margin: '0 auto',
              lineHeight: 1.6,
              textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
            }}
          >
            StoryPals brings storytelling to life with interactive AI companions who
            listen, respond, and create magical adventures alongside your child.
            Safe, educational, and endlessly imaginative!
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              maxWidth: { xs: '300px', sm: 'none' },
              margin: '0 auto',
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.accent,
                color: 'white',
                padding: '15px 35px',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 5px 20px rgba(255, 158, 109, 0.4)',
                '&:hover': {
                  backgroundColor: '#ff8a50',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(255, 158, 109, 0.5)',
                },
              }}
              size="large"
              onClick={() => navigate('/auth')}
            >
              Start Your Adventure
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: colors.light,
                color: colors.light,
                padding: '15px 35px',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderColor: colors.light,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 5px 15px rgba(255, 255, 255, 0.3)',
                },
              }}
              size="large"
              onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Character Section */}
      <Box sx={{ py: 8, px: 2, backgroundColor: colors.light }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ color: colors.primary }}>
            Meet Our Characters
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
            {[
              { name: 'Luna', image: LunaImage, description: 'The Star Fairy' },
              { name: 'Gogo', image: GogoImage, description: 'The Adventure Guide' },
              { name: 'Dodo', image: DodoImage, description: 'The Wise Owl' },
              { name: 'Captain Leo', image: CaptainLeoImage, description: 'The Brave Explorer' }
            ].map((character) => (
              <Grid item xs={12} sm={6} md={3} key={character.name}>
                <CharacterCard>
                  <CharacterImage
                    src={character.image}
                    alt={character.name}
                    className="character-image"
                  />
                  <Typography variant="h6" gutterBottom sx={{ color: colors.primary }}>
                    {character.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {character.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCharacterClick(character.name);
                    }}
                    sx={{
                      mt: 'auto',
                      backgroundColor: colors.primary,
                      '&:hover': {
                        backgroundColor: colors.dark,
                      },
                    }}
                  >
                    Meet {character.name}
                  </Button>
                  <CharacterGlow className="character-glow" />
                </CharacterCard>
              </Grid>
            ))}
          </Grid>
          {renderCharacterChat()}
        </Container>
      </Box>

      {/* Features Section */}
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
                <FeatureCard>
                  <Typography
                    variant="h1"
                    align="center"
                    sx={{ mb: 2, fontSize: '3rem' }}
                  >
                    {feature.icon}
                  </Typography>
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
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Chat Demo Section */}
      <Box sx={{ py: 8, px: 2, backgroundColor: colors.light }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ color: colors.primary, fontWeight: 'bold', mb: 2 }}>
              Meet Your StoryPal
            </Typography>
            <Typography variant="h6" sx={{ color: colors.dark, maxWidth: 600, mx: 'auto' }}>
              Try a conversation with one of our magical friends and see the StoryPals experience!
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ChatWindow>
              <ChatHeader>
                <img src={LunaImage} alt="Luna" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid white' }} />
                <Typography variant="h6">Luna the Star Fairy</Typography>
              </ChatHeader>

              <ChatMessages>
                {messages.map((message, index) => (
                  <Message key={index} isBot={message.isBot}>
                    {message.text}
                  </Message>
                ))}
              </ChatMessages>

              <ChatInput>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.accent,
                    minWidth: 45,
                    height: 45,
                    borderRadius: '50%',
                    '&:hover': {
                      backgroundColor: '#ff8a50',
                    },
                  }}
                  onClick={handleSendMessage}
                >
                  <ArrowForwardIcon />
                </Button>
              </ChatInput>
            </ChatWindow>
          </Box>
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

      {/* Parent Section */}
      <Box sx={{ py: 8, px: 2, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src="/path/to/parent-dashboard.png"
                alt="Parent Dashboard"
                style={{
                  width: '100%',
                  borderRadius: 20,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{
                  color: colors.primary,
                  fontWeight: 'bold',
                  mb: 3,
                }}
              >
                For Parents: Safety & Learning
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: colors.dark,
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                StoryPals was designed with parents in mind. Our comprehensive
                parent dashboard gives you complete oversight and control of your
                child's experience while providing insights into their learning
                journey.
              </Typography>
              <List>
                {[
                  'Content control and activity monitoring',
                  'Learning progress reports and insights',
                  'Time limits and usage schedules',
                  'Save and share your child\'s stories',
                  'Educational focus customization',
                ].map((feature, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <IconButton
                      sx={{
                        color: colors.accent,
                        mr: 2,
                      }}
                    >
                      ✓
                    </IconButton>
                    <Typography variant="body1">{feature}</Typography>
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  mt: 4,
                  '&:hover': {
                    backgroundColor: colors.primary,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(123, 94, 167, 0.4)',
                  },
                }}
                size="large"
                onClick={() => navigate('/parent-dashboard')}
              >
                Parent Dashboard
              </Button>
            </Grid>
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
  );
};

export default LandingScreen; 