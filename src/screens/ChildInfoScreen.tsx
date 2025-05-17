import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { childApi, ChildData } from '../services/api';

const ChildInfoScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('boy');
  const [ageGroup, setAgeGroup] = useState('3-5');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const childData: ChildData = {
        name,
        age,
        gender,
        ageGroup,
        interests: interests.split(',').map(i => i.trim()).join(', '),
      };
      await childApi.createChild(childData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating child profile:', error);
      // TODO: Show error message to user
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

        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TextField
            fullWidth
            label="Child's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Child's Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            margin="normal"
            required
            inputProps={{ min: 3, max: 12 }}
          />

          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel value="boy" control={<Radio />} label="Boy" />
              <FormControlLabel value="girl" control={<Radio />} label="Girl" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel>Age Group</FormLabel>
            <Select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              required
            >
              <MenuItem value="3-5">3-5 years</MenuItem>
              <MenuItem value="6-8">6-8 years</MenuItem>
              <MenuItem value="9-12">9-12 years</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Interests (comma separated)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            margin="normal"
            required
            placeholder="e.g. space, dinosaurs, music, art"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
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