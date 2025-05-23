import { createTheme } from '@mui/material/styles';

// Color palette
export const colors = {
  primary: '#7b5ea7',    // Purple
  secondary: '#f0c3e9',  // Light pink
  accent: '#ff9e6d',     // Orange
  light: '#f9f5ff',      // Very light purple
  dark: '#483c67',       // Dark purple
  cloud: '#ffffff',      // White
  star: '#ffe66d',       // Yellow
  backgroundGradient: 'linear-gradient(to bottom, #b5a8e0, #d5a8f0)',
};

// Create and export the theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: colors.dark,
      secondary: colors.dark,
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.light,
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          position: 'relative',
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.light,
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
        },
        '*': {
          boxSizing: 'border-box',
        },
        '@media (forced-colors: active)': {
          // High contrast mode styles
          '.MuiPaper-root': {
            border: '1px solid CanvasText',
          },
          '.MuiCard-root': {
            border: '1px solid CanvasText',
          },
          '.MuiButton-root': {
            border: '1px solid CanvasText',
          },
          '.MuiTextField-root': {
            border: '1px solid CanvasText',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 25,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          backgroundColor: colors.cloud,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.cloud,
          color: colors.dark,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '24px',
          paddingBottom: '24px',
          position: 'relative',
          zIndex: 1,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.cloud,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px !important',
        },
      },
    },
  },
}); 