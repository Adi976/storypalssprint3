import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#7b5ea7',
      light: '#b5a8e0',
      dark: '#483c67',
    },
    secondary: {
      main: '#f0c3e9',
      light: '#f9f5ff',
      dark: '#d5a8f0',
    },
    error: {
      main: '#ff9e6d',
      light: '#ffe66d',
      dark: '#ff8a50',
    },
    background: {
      default: '#f9f5ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#483c67',
      secondary: '#7b5ea7',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Tahoma", "Geneva", "Verdana", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      color: '#f9f5ff',
      textShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#7b5ea7',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#7b5ea7',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#7b5ea7',
    },
    h5: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#7b5ea7',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#483c67',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#483c67',
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.4,
      color: '#483c67',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '25px',
          padding: '10px 25px',
          boxShadow: '0 4px 15px rgba(123, 94, 167, 0.3)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(123, 94, 167, 0.4)',
          },
        },
        contained: {
          backgroundColor: '#7b5ea7',
          color: 'white',
          '&:hover': {
            backgroundColor: '#6a4f94',
          },
        },
        outlined: {
          borderColor: '#7b5ea7',
          color: '#7b5ea7',
          '&:hover': {
            backgroundColor: 'rgba(123, 94, 167, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7b5ea7',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7b5ea7',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
}); 