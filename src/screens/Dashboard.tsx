import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ChildImage from '../assets/images/Luna.png';
import StoryImage from '../assets/images/All of them.png';

const DashboardContainer = styled(Box)({
  padding: '80px 20px',
  maxWidth: '1200px',
  margin: '0 auto',
  marginTop: '80px',
});

const SectionTitle = styled(Typography)({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontWeight: 'bold',
  fontSize: '2.5rem',
  color: '#7b5ea7',
  marginBottom: '60px',
  textAlign: 'center',
});

const SectionSubtitle = styled(Typography)({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '1.1rem',
  color: '#483c67',
  maxWidth: '700px',
  margin: '0 auto 40px',
  textAlign: 'center',
  lineHeight: 1.6,
});

const ChildCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
});

const StoryCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
});

const CardTitle = styled(Typography)({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontWeight: 'bold',
  fontSize: '1.3rem',
  color: '#7b5ea7',
  marginBottom: '5px',
});

const CardText = styled(Typography)({
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '0.9rem',
  color: '#483c67',
  lineHeight: 1.4,
});

const ActionButton = styled(Button)({
  backgroundColor: '#ff9e6d',
  color: 'white',
  border: 'none',
  padding: '15px 35px',
  borderRadius: '30px',
  fontWeight: 600,
  fontSize: '1.1rem',
  boxShadow: '0 5px 20px rgba(255, 158, 109, 0.4)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    backgroundColor: '#ff8a50',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(255, 158, 109, 0.5)',
  },
});

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardContainer>
      <SectionTitle>Welcome to Your Dashboard</SectionTitle>
      <SectionSubtitle>
        Manage your child's stories, track their progress, and discover new adventures together.
      </SectionSubtitle>

      <Grid container spacing={4}>
        {/* Child Profile Section */}
        <Grid item xs={12} md={4} component="div">
          <ChildCard>
            <CardMedia
              component="img"
              height="220"
              image={ChildImage}
              alt="Child Avatar"
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ padding: '20px' }}>
              <CardTitle>Emma Johnson</CardTitle>
              <CardText sx={{ marginBottom: '15px' }}>Age: 7 years</CardText>
              <CardText sx={{ marginBottom: '20px' }}>Reading Level: Intermediate</CardText>
              <ActionButton
                fullWidth
                onClick={() => navigate('/child-details')}
              >
                Edit Profile
              </ActionButton>
            </CardContent>
          </ChildCard>
        </Grid>

        {/* Recent Stories Section */}
        <Grid item xs={12} md={8} component="div">
          <Box sx={{ marginBottom: '40px' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', color: '#7b5ea7' }}>
              Recent Stories
            </Typography>
            <Grid container spacing={3}>
              {[1, 2, 3].map((story) => (
                <Grid item xs={12} sm={6} key={story} component="div">
                  <StoryCard>
                    <CardMedia
                      component="img"
                      height="160"
                      image={StoryImage}
                      alt="Story Cover"
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ padding: '20px' }}>
                      <CardTitle>The Magic Forest</CardTitle>
                      <CardText>
                        Join Luna on an adventure through the enchanted forest where anything is possible!
                      </CardText>
                      <ActionButton
                        fullWidth
                        sx={{ marginTop: '15px' }}
                        onClick={() => navigate('/story/1')}
                      >
                        Continue Reading
                      </ActionButton>
                    </CardContent>
                  </StoryCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard; 