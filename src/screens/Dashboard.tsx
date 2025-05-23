import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Skeleton,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Book as BookIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { users, analytics } from '../services/api';
import { authService } from '../services/auth';
import ChildImage from '../assets/images/Luna.png';
import StoryImage from '../assets/images/All of them.png';
import Navbar from '../components/Navbar';

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

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
  marginTop: '80px',
  minHeight: '100vh',
  background: colors.light,
  position: 'relative',
  zIndex: 1,
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontWeight: 'bold',
  fontSize: '2.5rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '1.1rem',
  color: theme.palette.text.secondary,
  maxWidth: '700px',
  margin: '0 auto 40px',
  textAlign: 'center',
  lineHeight: 1.6,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  backgroundColor: colors.cloud,
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontWeight: 'bold',
  fontSize: '1.3rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const CardText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
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

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: 20,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 15,
  backgroundColor: colors.cloud,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  },
}));

const ProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 15,
  backgroundColor: colors.cloud,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
}));

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  readingLevel: string;
  lastActivity: string;
}

interface Story {
  id: string;
  title: string;
  character: string;
  date: string;
  coverImage: string;
}

interface ChildStats {
  storiesCreated: number;
  readingTime: string;
  vocabularyWords: number;
  achievements: number;
}

interface LearningProgress {
  subject: string;
  progress: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const LoadingSkeleton = () => (
  <Grid container spacing={4}>
    <Grid item xs={12}>
      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
    </Grid>
    {[1, 2, 3, 4].map((item) => (
      <Grid item xs={12} sm={6} md={3} key={item}>
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
      </Grid>
    ))}
    {[1, 2].map((item) => (
      <Grid item xs={12} md={6} key={`card-${item}`}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Grid>
    ))}
  </Grid>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Alert 
      severity="error" 
      sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  </Box>
);

const EmptyState = ({ message, action }: { message: string; action?: React.ReactNode }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h6" color="textSecondary" gutterBottom>
      {message}
    </Typography>
    {action}
  </Box>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [childStats, setChildStats] = useState<ChildStats>({
    storiesCreated: 0,
    readingTime: '0 minutes',
    vocabularyWords: 0,
    achievements: 0,
  });
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Check authentication
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated, redirecting to auth page');
        navigate('/auth');
        return;
      }

      // Get current user for debugging
      const currentUser = authService.getUser();
      console.log('Current user:', currentUser);

      // Fetch children data
      const childrenResponse = await users.getChildren();
      console.log('Children data:', childrenResponse.data);
      setChildren(childrenResponse.data);

      if (childrenResponse.data.length > 0) {
        const childId = childrenResponse.data[0].id;

        // Fetch progress data
        const progressResponse = await analytics.getProgress(childId);
        console.log('Progress data:', progressResponse.data);
        const progressData = progressResponse.data;

        // Update stats
        setChildStats({
          storiesCreated: progressData.storiesCreated || 0,
          readingTime: `${progressData.readingTime || 0} minutes`,
          vocabularyWords: progressData.vocabularyWords || 0,
          achievements: progressData.achievements || 0,
        });

        // Update learning progress
        setLearningProgress(progressData.learningProgress || []);
      }

      // Fetch recent stories
      const storiesResponse = await users.getRecentStories();
      setRecentStories(storiesResponse.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  if (loading && !refreshing) {
    return (
      <DashboardContainer>
        <LoadingSkeleton />
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorState message={error} onRetry={handleRefresh} />
      </DashboardContainer>
    );
  }

  if (children.length === 0) {
    return (
      <DashboardContainer>
        <EmptyState 
          message="No children profiles found. Add a child to get started!"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/add-child')}
              sx={{ mt: 2 }}
            >
              Add Child Profile
            </Button>
          }
        />
      </DashboardContainer>
    );
  }

  const featuredStories = [
    {
      id: 1,
      title: 'Journey to the Stars',
      description: 'Join Luna on an exciting adventure through the cosmos.',
      image: '/path/to/story1.jpg',
      category: 'Adventure',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'The Wise Owl\'s Tales',
      description: 'Learn valuable lessons with Dodo the Wise Owl.',
      image: '/path/to/story2.jpg',
      category: 'Educational',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Captain Leo\'s Treasure Hunt',
      description: 'Embark on a thrilling treasure hunt with Captain Leo.',
      image: '/path/to/story3.jpg',
      category: 'Adventure',
      rating: 4.7,
    },
  ];

  const stats = [
    { label: 'Total Stories', value: '100+', icon: <BookIcon /> },
    { label: 'Active Users', value: '10K+', icon: <TrendingUpIcon /> },
    { label: 'Average Rating', value: '4.8', icon: <StarIcon /> },
    { label: 'Awards Won', value: '15', icon: <EmojiEventsIcon /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.light }}>
      <Navbar isAuthenticated={isAuthenticated} />
      <Box sx={{ pt: { xs: 8, sm: 9 } }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: colors.primary,
                fontWeight: 'bold',
                fontSize: { xs: 'h4', sm: 'h3' },
              }}
            >
              Welcome to StoryPals
            </Typography>
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatCard>
                  <Box sx={{ color: colors.primary, mb: 1 }}>{stat.icon}</Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: colors.dark, 
                      fontWeight: 'bold', 
                      mb: 1,
                      fontSize: { xs: 'h5', sm: 'h4' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: colors.dark, 
                      opacity: 0.8,
                      fontSize: { xs: 'body2', sm: 'body1' }
                    }}
                  >
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  color: colors.dark,
                  '&.Mui-selected': {
                    color: colors.primary,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: colors.primary,
                },
              }}
            >
              <Tab label="Featured Stories" />
              <Tab label="Popular Categories" />
              <Tab label="Recent Activity" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              {featuredStories.map((story) => (
                <Grid item xs={12} sm={6} md={4} key={story.id}>
                  <StyledCard>
                    <CardMedia
                      component="img"
                      height="200"
                      image={story.image}
                      alt={story.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip
                          label={story.category}
                          size="small"
                          sx={{
                            backgroundColor: colors.primary,
                            color: 'white',
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ color: colors.accent, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: colors.dark }}>
                            {story.rating}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          color: colors.dark,
                          fontSize: { xs: 'subtitle1', sm: 'h6' }
                        }}
                      >
                        {story.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: 'caption', sm: 'body2' }
                        }}
                      >
                        {story.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              {['Adventure', 'Educational', 'Fantasy', 'Science'].map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: colors.primary }}>
                      {category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.dark, opacity: 0.8 }}>
                      25+ Stories
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: colors.dark, mb: 2 }}>
                Join our community to see recent activity
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/auth')}
                sx={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: colors.dark,
                  },
                }}
              >
                Sign Up Now
              </Button>
            </Box>
          </TabPanel>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 