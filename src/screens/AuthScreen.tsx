import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthResponse } from '../services/api';

const AuthContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(8),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const AuthScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 0) {
        // Login
        const response = await api.post<AuthResponse>('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        const { tokens } = response.data;
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        navigate('/dashboard');
      } else {
        // Register
        const response = await api.post<AuthResponse>('/auth/register', {
          email: formData.email,
          password: formData.password,
        });
        const { tokens } = response.data;
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        navigate('/dashboard');
      }
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <AuthContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to StoryPals
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          {activeTab === 0 ? 'Sign in to your parent account' : 'Create a new parent account'}
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              activeTab === 0 ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </Box>
      </AuthContainer>
    </Container>
  );
};

export default AuthScreen; 