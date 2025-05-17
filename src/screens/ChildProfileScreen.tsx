import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton, Card, CardContent, LinearProgress, Button, CircularProgress } from '@mui/material';
import { Chat as ChatIcon, Speed as SpeedIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import { childApi, ChildData } from '../services/api';

interface ProfileChildData extends ChildData {
  id: string;
  reading_level?: string;
}

interface ProgressData {
  stories_read: number;
  total_stories: number;
  words_learned: number;
  total_words: number;
  activities_completed: number;
  total_activities: number;
}

interface ChildResponse {
  data: {
    children: ProfileChildData[];
  };
}

const ChildProfileScreen: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [childData, setChildData] = useState<ProfileChildData | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenResponse, childResponse] = await Promise.all([
          childApi.getChildren(),
          childApi.getChild(childId!),
        ]);

        const child = (childrenResponse as ChildResponse).data.children.find(
          (c: ProfileChildData) => c.id.toString() === childId
        );

        setChildData(child || null);
        setProgressData(childResponse.data as ProgressData);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6200EE 0%, #03DAC6 100%)',
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Profile Header */}
        <Card sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {childData?.name[0].toUpperCase()}
              </Avatar>
              <Box ml={2} flexGrow={1}>
                <Typography variant="h5" color="white" fontWeight="bold">
                  {childData?.name}
                </Typography>
                <Typography color="rgba(255, 255, 255, 0.7)">
                  Age: {childData?.age}
                </Typography>
              </Box>
              <IconButton
                onClick={() => navigate(`/chat/${childId}`)}
                sx={{ color: 'white' }}
              >
                <ChatIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Typography variant="h6" color="white" mb={2}>
          Learning Progress
        </Typography>

        {progressData ? (
          <>
            <ProgressCard
              title="Stories Read"
              value={progressData.stories_read}
              total={progressData.total_stories}
              icon={<SpeedIcon />}
            />
            <ProgressCard
              title="Words Learned"
              value={progressData.words_learned}
              total={progressData.total_words}
              icon={<FavoriteIcon />}
            />
            <ProgressCard
              title="Activities Completed"
              value={progressData.activities_completed}
              total={progressData.total_activities}
              icon={<SpeedIcon />}
            />
          </>
        ) : (
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography color="white" textAlign="center">
                No progress data available yet.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Settings Section */}
        <Typography variant="h6" color="white" mt={4} mb={2}>
          Settings
        </Typography>

        <SettingsCard
          title="Reading Level"
          value={childData?.reading_level || 'Beginner'}
          icon={<SpeedIcon />}
          onTap={() => {/* TODO: Implement reading level adjustment */}}
        />
        <SettingsCard
          title="Interests"
          value={childData?.interests || 'Not set'}
          icon={<FavoriteIcon />}
          onTap={() => {/* TODO: Implement interests management */}}
        />
      </Box>
    </Box>
  );
};

interface ProgressCardProps {
  title: string;
  value: number;
  total: number;
  icon: React.ReactNode;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, total, icon }) => {
  const progress = total > 0 ? value / total : 0;

  return (
    <Card sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography ml={1} color="white" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main',
            },
          }}
        />
        <Typography mt={1} color="rgba(255, 255, 255, 0.7)" fontSize="0.875rem">
          {value} / {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface SettingsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  onTap: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, value, icon, onTap }) => {
  const displayValue = title === 'Interests' ? value.split(',').map(i => i.trim()).join(', ') : value;
  
  return (
    <Card
      sx={{
        mb: 2,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
      }}
      onClick={onTap}
    >
      <CardContent>
        <Box display="flex" alignItems="center">
          {icon}
          <Box ml={2} flexGrow={1}>
            <Typography color="white" fontWeight="bold">
              {title}
            </Typography>
            <Typography color="rgba(255, 255, 255, 0.7)" fontSize="0.875rem">
              {displayValue}
            </Typography>
          </Box>
          <Button color="primary">Edit</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChildProfileScreen; 