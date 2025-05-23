import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { mockDashboardStats, mockCharacters, mockAnalytics } from '../services/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardScreen: React.FC = () => {
  const theme = useTheme();

  // Prepare data for character distribution chart
  const characterData = Object.entries(mockAnalytics.byCharacter).map(([name, data]) => ({
    name,
    messages: data.totalMessages,
    duration: data.totalDuration,
  }));

  // Prepare data for vocabulary and grammar scores
  const scoreData = Object.entries(mockAnalytics.byCharacter).map(([name, data]) => ({
    name,
    vocabulary: data.avgVocabulary,
    grammar: data.avgGrammar,
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Interactions
              </Typography>
              <Typography variant="h4">
                {mockDashboardStats.totalInteractions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Session
              </Typography>
              <Typography variant="h4">
                {mockDashboardStats.averageSessionDuration}m
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Vocabulary Score
              </Typography>
              <Typography variant="h4">
                {mockAnalytics.overall.averageVocabularyScore.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Grammar Score
              </Typography>
              <Typography variant="h4">
                {mockAnalytics.overall.averageGrammarScore.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Weekly Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Activity
            </Typography>
            <ResponsiveContainer>
              <LineChart data={mockDashboardStats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="interactions"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Learning Scores */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Learning Scores by Character
            </Typography>
            <ResponsiveContainer>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="vocabulary" fill={theme.palette.primary.main} name="Vocabulary" />
                <Bar dataKey="grammar" fill={theme.palette.secondary.main} name="Grammar" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Character Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Character Performance
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(mockAnalytics.byCharacter).map(([character, data]) => (
                <Grid item xs={12} md={3} key={character}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {character}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Messages: {data.totalMessages}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Duration: {data.totalDuration} min
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Vocabulary Score: {data.avgVocabulary.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Grammar Score: {data.avgGrammar.toFixed(1)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {data.topics.map((topic, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {topic}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Learning Progress and Milestones */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Learning Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Overall Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={mockDashboardStats.learningProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="textSecondary">
                    {`${Math.round(mockDashboardStats.learningProgress)}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Recent Topics
            </Typography>
            <Timeline>
              {mockDashboardStats.recentTopics.map((topic, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    {index < mockDashboardStats.recentTopics.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography>{topic}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Learning Milestones
            </Typography>
            <Grid container spacing={2}>
              {mockAnalytics.milestones.map((milestone) => (
                <Grid item xs={12} key={milestone.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {milestone.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Achieved on {new Date(milestone.achievedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardScreen; 