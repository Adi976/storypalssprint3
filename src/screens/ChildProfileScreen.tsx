import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton, Card, CardContent, LinearProgress, Button, CircularProgress } from '@mui/material';
import { Chat as ChatIcon, Speed as SpeedIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import { childApi } from '../services/api';

interface ChildData {
  id: string;
  name: string;
  age: number;
  reading_level?: string;
  interests?: string;
  avatar?: string;
}

interface ProgressData {
  stories_read: number;
  total_stories: number;
  words_learned: number;
  total_words: number;
  activities_completed: number;
  total_activities: number;
}

const ChildProfileScreen: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childResponse, progressResponse] = await Promise.all([
          childApi.get(childId!),
          childApi.getProgress(childId!),
        ]);

        setChildData(childResponse.data);
        setProgressData(progressResponse.data);
      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childId]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!childData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Child not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={childData.avatar}
              alt={childData.name}
              sx={{ width: 80, height: 80 }}
            />
            <Box flex={1}>
              <Typography variant="h5">{childData.name}</Typography>
              <Typography variant="body1" color="text.secondary">
                Age: {childData.age} • Reading Level: {childData.reading_level || 'Not set'}
              </Typography>
              {childData.interests && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Interests: {childData.interests}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {progressData && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Learning Progress
            </Typography>
            
            {/* Stories Progress */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  Stories Read
                </Typography>
                <Typography variant="body2">
                  {progressData.stories_read}/{progressData.total_stories}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(progressData.stories_read / progressData.total_stories) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            {/* Words Progress */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  Words Learned
                </Typography>
                <Typography variant="body2">
                  {progressData.words_learned}/{progressData.total_words}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(progressData.words_learned / progressData.total_words) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            {/* Activities Progress */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  Activities Completed
                </Typography>
                <Typography variant="body2">
                  {progressData.activities_completed}/{progressData.total_activities}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(progressData.activities_completed / progressData.total_activities) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ChildProfileScreen; 