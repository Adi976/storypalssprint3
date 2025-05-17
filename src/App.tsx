import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Navigation from './components/Navigation';
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import ChildInfoScreen from './screens/ChildInfoScreen';
import ChildProfileScreen from './screens/ChildProfileScreen';
import Dashboard from './screens/Dashboard';
import StoryScreen from './screens/StoryScreen';
import ParentDashboard from './screens/ParentDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navigation />
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
