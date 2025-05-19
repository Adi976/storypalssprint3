import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { users } from '../services/api';

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
      
      await users.addChild(childData);
      navigate('/'); // Redirect to homepage after successful creation
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
        background: 'linear-gradient(135deg, #6200EE 0%, #03DAC6 100%)',
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          bgcolor: 'white',
          borderRadius: 4,
          p: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" color="primary" fontWeight="bold" textAlign="center" mb={2}>
          Tell us about your child
        </Typography>
        <Typography variant="body1" textAlign="center" mb={4} color="text.secondary">
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
          />

          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel value="M" control={<Radio />} label="Male" disabled={isLoading} />
              <FormControlLabel value="F" control={<Radio />} label="Female" disabled={isLoading} />
              <FormControlLabel value="O" control={<Radio />} label="Other" disabled={isLoading} />
            </RadioGroup>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
            sx={{ mt: 4, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save & Continue'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChildInfoScreen; 