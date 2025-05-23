import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { authService } from '../services/auth';

const ProfileScreen: React.FC = () => {
  const user = authService.getUser();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          sx={{ width: 100, height: 100 }}
          alt={`${user?.first_name} ${user?.last_name}`}
        />
        <Box>
          <Typography variant="h5">
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
          <Typography color="text.secondary">{user?.phone_number}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileScreen; 