import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { childApi } from '../services/api';
import { styled } from '@mui/material/styles';

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

const StyledCard = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  backgroundColor: colors.cloud,
  borderRadius: 20,
  padding: theme.spacing(4),
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
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

const ChildInfoScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const childData = {
        name,
        age: parseInt(age),
        gender,
      };
      
      await childApi.create(childData);
      navigate('/dashboard'); // Redirect to dashboard after successful creation
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || 'Failed to create child profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.backgroundGradient,
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StyledCard>
        <Typography variant="h4" sx={{ color: colors.primary, fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
          Tell us about your child
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: colors.dark }}>
          This helps us personalize their learning experience
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Child's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: colors.secondary,
                },
                '&:hover fieldset': {
                  borderColor: colors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary,
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Child's Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            margin="normal"
            required
            disabled={isLoading}
            inputProps={{ min: 3, max: 12 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: colors.secondary,
                },
                '&:hover fieldset': {
                  borderColor: colors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary,
                },
              },
            }}
          />

          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend" sx={{ color: colors.dark }}>Gender</FormLabel>
            <RadioGroup
              row
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel 
                value="M" 
                control={<Radio sx={{ color: colors.primary }} />} 
                label="Male" 
                disabled={isLoading}
                sx={{ color: colors.dark }}
              />
              <FormControlLabel 
                value="F" 
                control={<Radio sx={{ color: colors.primary }} />} 
                label="Female" 
                disabled={isLoading}
                sx={{ color: colors.dark }}
              />
              <FormControlLabel 
                value="O" 
                control={<Radio sx={{ color: colors.primary }} />} 
                label="Other" 
                disabled={isLoading}
                sx={{ color: colors.dark }}
              />
            </RadioGroup>
          </FormControl>

          <ActionButton
            fullWidth
            type="submit"
            disabled={isLoading}
            sx={{ mt: 4, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save & Continue'}
          </ActionButton>
        </Box>
      </StyledCard>
    </Box>
  );
};

export default ChildInfoScreen; 