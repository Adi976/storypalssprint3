import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  LinearProgress,
  useTheme,
  useMediaQuery,
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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Color palette
const colors = {
  primary: '#7b5ea7',    // Purple
  secondary: '#f0c3e9',  // Light pink
  accent: '#ff9e6d',     // Orange
  light: '#f9f5ff',      // Very light purple
  dark: '#483c67',       // Dark purple
  cloud: '#ffffff',      // White
  star: '#ffe66d',       // Yellow
};

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
  padding: theme.spacing(2),
  borderRadius: 15,
  backgroundColor: colors.light,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 15,
  backgroundColor: colors.light,
}));

const ParentDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [childStats] = useState({
    storiesCreated: 12,
    readingTime: '45 minutes',
    vocabularyWords: 24,
    achievements: 8,
  });

  const [recentStories] = useState([
    { title: 'Journey to the Moon', character: 'Luna', date: '2024-03-15' },
    { title: 'Mystery in the Forest', character: 'Dodo', date: '2024-03-14' },
    { title: 'Space Adventure', character: 'Captain Leo', date: '2024-03-13' },
  ]);

  const [learningProgress] = useState([
    { subject: 'Vocabulary', progress: 75 },
    { subject: 'Creativity', progress: 85 },
    { subject: 'Reading', progress: 65 },
    { subject: 'Writing', progress: 70 },
  ]);

  return (
    <Box sx={{ py: 4, backgroundColor: colors.light, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: colors.primary, fontWeight: 'bold' }}>
                Parent Dashboard
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Stats Overview */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StatCard>
                  <Avatar sx={{ bgcolor: colors.primary }}>
                    <BookIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{childStats.storiesCreated}</Typography>
                    <Typography variant="body2" color="text.secondary">Stories Created</Typography>
                  </Box>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard>
                  <Avatar sx={{ bgcolor: colors.accent }}>
                    <AccessTimeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{childStats.readingTime}</Typography>
                    <Typography variant="body2" color="text.secondary">Reading Time</Typography>
                  </Box>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard>
                  <Avatar sx={{ bgcolor: colors.secondary }}>
                    <SchoolIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{childStats.vocabularyWords}</Typography>
                    <Typography variant="body2" color="text.secondary">New Words</Typography>
                  </Box>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard>
                  <Avatar sx={{ bgcolor: colors.star }}>
                    <EmojiEventsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{childStats.achievements}</Typography>
                    <Typography variant="body2" color="text.secondary">Achievements</Typography>
                  </Box>
                </StatCard>
              </Grid>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <DashboardCard>
              <Typography variant="h6" sx={{ mb: 2, color: colors.primary }}>
                Quick Actions
              </Typography>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <TimelineIcon sx={{ color: colors.primary }} />
                  </ListItemIcon>
                  <ListItemText primary="View Progress Report" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <SecurityIcon sx={{ color: colors.primary }} />
                  </ListItemIcon>
                  <ListItemText primary="Safety Settings" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <BookIcon sx={{ color: colors.primary }} />
                  </ListItemIcon>
                  <ListItemText primary="View Stories" />
                </ListItem>
              </List>
            </DashboardCard>
          </Grid>

          {/* Learning Progress */}
          <Grid item xs={12} md={8}>
            <DashboardCard>
              <Typography variant="h6" sx={{ mb: 3, color: colors.primary }}>
                Learning Progress
              </Typography>
              <Grid container spacing={3}>
                {learningProgress.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <ProgressCard>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {item.subject}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'rgba(123, 94, 167, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: colors.primary,
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        {item.progress}% Complete
                      </Typography>
                    </ProgressCard>
                  </Grid>
                ))}
              </Grid>
            </DashboardCard>
          </Grid>

          {/* Recent Stories */}
          <Grid item xs={12} md={4}>
            <DashboardCard>
              <Typography variant="h6" sx={{ mb: 2, color: colors.primary }}>
                Recent Stories
              </Typography>
              <List>
                {recentStories.map((story, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: colors.secondary }}>
                          <StarIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={story.title}
                        secondary={`With ${story.character} • ${story.date}`}
                      />
                    </ListItem>
                    {index < recentStories.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderColor: colors.primary,
                  color: colors.primary,
                  '&:hover': {
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(123, 94, 167, 0.05)',
                  },
                }}
              >
                View All Stories
              </Button>
            </DashboardCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ParentDashboard; 