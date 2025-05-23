import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const StoriesScreen: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore and create engaging stories for your children.
        </Typography>
      </Box>
      {/* Story content will be added here */}
    </Container>
  );
};

export default StoriesScreen; 