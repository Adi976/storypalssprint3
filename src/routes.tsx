import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';

// Screens
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import Dashboard from './screens/Dashboard';
import ProfileScreen from './screens/ProfileScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import StoryScreen from './screens/StoryScreen';
import ChildProfileScreen from './screens/ChildProfileScreen';
import ChildInfoScreen from './screens/ChildInfoScreen';
import AnalyticsDashboard from './screens/AnalyticsDashboard';
import ChatHistoryScreen from './screens/ChatHistoryScreen';
import ParentDashboard from './screens/ParentDashboard';

const AppRoutes: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const authStatus = authService.isAuthenticated();
      console.log('Auth status:', authStatus);
      setIsAuthenticated(authStatus);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingScreen />} />
      <Route path="/auth" element={<AuthScreen />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <ProfileScreen />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/story"
        element={
          isAuthenticated ? (
            <StoryScreen />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/child-profile"
        element={
          isAuthenticated ? (
            <ChildProfileScreen />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/child-info"
        element={
          isAuthenticated ? (
            <ChildInfoScreen />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/analytics"
        element={
          isAuthenticated ? (
            <AnalyticsDashboard />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/chat-history"
        element={
          isAuthenticated ? (
            <ChatHistoryScreen />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/parent-dashboard"
        element={
          isAuthenticated ? (
            <ParentDashboard />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
};

export default AppRoutes; 