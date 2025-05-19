import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Suspense, lazy } from 'react';
import { theme } from './theme';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const LandingScreen = lazy(() => import('./screens/LandingScreen'));
const AuthScreen = lazy(() => import('./screens/AuthScreen'));
const ChildInfoScreen = lazy(() => import('./screens/ChildInfoScreen'));
const ChildProfileScreen = lazy(() => import('./screens/ChildProfileScreen'));
const Dashboard = lazy(() => import('./screens/Dashboard'));
const StoryScreen = lazy(() => import('./screens/StoryScreen'));
const ParentDashboard = lazy(() => import('./screens/ParentDashboard'));

// Loading component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navigation />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingScreen />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="/child-info" element={<ChildInfoScreen />} />
              <Route path="/child-profile" element={<ChildProfileScreen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/story" element={<StoryScreen />} />
              <Route path="/parent-dashboard" element={<ParentDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
