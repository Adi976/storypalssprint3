import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
  Grow,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person, 
  Phone,
  Google as GoogleIcon,
  Facebook as FacebookIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Add Google OAuth type declaration
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { error?: string; credential?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

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

const AuthBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.backgroundGradient,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 70%)',
    pointerEvents: 'none',
  },
}));

const AnimatedAuthContainer = styled(motion.div)(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  background: colors.cloud,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    background: colors.backgroundGradient,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    transition: 'all 0.3s ease',
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
  '& .MuiInputLabel-root': {
    color: colors.dark,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: colors.primary,
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

const SocialButton = styled(Button)(({ theme }) => ({
  flex: 1,
  padding: '12px',
  borderRadius: '30px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  React.useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (activeTab === 1 && formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (activeTab === 0) {
        // Login
        await authService.login(formData.email, formData.password);
      } else {
        // Register
        await authService.register({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number
        });
      }
      // Redirect to dashboard after successful login/register
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err.response?.data) {
        // Handle validation errors from the backend
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // If there are multiple validation errors, join them
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return messages.join(', ');
              }
              return messages;
            })
            .join('\n');
          setError(errorMessages);
        } else {
          setError(errorData);
        }
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      if (!window.google?.accounts.oauth2.initTokenClient) {
        throw new Error('Google Sign-In is not available');
      }

      // Initialize Google Sign-In
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response: { error?: string; credential?: string }) => {
          if (response.error) {
            setError('Google login failed. Please try again.');
            setLoading(false);
            return;
          }

          try {
            if (response.credential) {
              const user = await authService.loginWithGoogle(response.credential);
              if (user) {
                navigate('/dashboard', { replace: true });
              } else {
                setError('Failed to authenticate with Google');
              }
            } else {
              setError('No credential received from Google');
            }
          } catch (err) {
            console.error('Google login error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during Google login');
          } finally {
            setLoading(false);
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      console.error('Google login initialization error:', err);
      setError('Failed to initialize Google login');
      setLoading(false);
    }
  };

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <AuthBackground>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
          },
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <AnimatedAuthContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                color: colors.primary,
                fontWeight: 'bold',
                mb: 3,
              }}
            >
              Welcome to StoryPals
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              align="center"
              sx={{
                color: colors.dark,
                mb: 4,
              }}
            >
              {activeTab === 0
                ? 'Sign in to continue your storytelling journey'
                : 'Create an account to start your storytelling adventure'}
            </Typography>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 4,
                '& .MuiTabs-indicator': {
                  backgroundColor: colors.accent,
                  height: 3,
                  borderRadius: 3,
                },
                '& .MuiTab-root': {
                  color: colors.dark,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    color: colors.primary,
                    fontWeight: 'bold',
                  },
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: colors.accent,
                    },
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <motion.div variants={itemVariants}>
                  <StyledTextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StyledTextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                {activeTab === 1 && (
                  <>
                    <motion.div variants={itemVariants}>
                      <StyledTextField
                        fullWidth
                        label="Confirm Password"
                        name="confirm_password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: colors.primary }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <motion.div variants={itemVariants} style={{ flex: 1 }}>
                        <StyledTextField
                          fullWidth
                          label="First Name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: colors.primary }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>
                      <motion.div variants={itemVariants} style={{ flex: 1 }}>
                        <StyledTextField
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: colors.primary }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>
                    </Box>

                    <motion.div variants={itemVariants}>
                      <StyledTextField
                        fullWidth
                        label="Phone Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: colors.primary }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </Box>

              <Box sx={{ mt: 3, mb: 2 }}>
                <ActionButton
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : activeTab === 0 ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </ActionButton>

                <Typography
                  variant="body2"
                  align="center"
                  sx={{ color: colors.dark, mb: 2 }}
                >
                  or
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <SocialButton
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    sx={{
                      borderColor: '#DB4437',
                      color: '#DB4437',
                      '&:hover': {
                        borderColor: '#DB4437',
                        backgroundColor: '#DB4437',
                        color: 'white',
                      },
                    }}
                  >
                    Continue with Google
                  </SocialButton>
                  <SocialButton
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    disabled={loading}
                    sx={{
                      borderColor: '#4267B2',
                      color: '#4267B2',
                      '&:hover': {
                        borderColor: '#4267B2',
                        backgroundColor: '#4267B2',
                        color: 'white',
                      },
                    }}
                  >
                    Continue with Facebook
                  </SocialButton>
                </Box>
              </Box>
            </form>
          </motion.div>
        </AnimatedAuthContainer>
      </Container>
    </AuthBackground>
  );
};

export default AuthScreen; 