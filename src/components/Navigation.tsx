import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, styled, useTheme, useMediaQuery, Drawer, List, ListItem, ListItemText, Divider, ListItemIcon, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import LogoImage from '../assets/images/Luna.png';
import { colors } from '../theme';

const NavContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  position: 'fixed',
  transition: 'all 0.3s ease',
  '&.scrolled': {
    backgroundColor: colors.cloud,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const Logo = styled('img')({
  height: 40,
  marginRight: 16,
});

const NavButton = styled(Button)(({ theme }) => ({
  color: colors.dark,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(123, 94, 167, 0.1)',
  },
  '&.active': {
    color: colors.primary,
    backgroundColor: 'rgba(123, 94, 167, 0.1)',
  },
}));

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAuthenticated = localStorage.getItem('access_token') !== null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Stories', icon: <BookIcon />, path: '/story' },
    { text: 'Parent Dashboard', icon: <SchoolIcon />, path: '/parent-dashboard' },
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              backgroundColor: isActive(item.path) ? 'rgba(123, 94, 167, 0.1)' : 'transparent',
              color: isActive(item.path) ? colors.primary : colors.dark,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <NavContainer className={scrolled ? 'scrolled' : ''}>
        <Toolbar>
          <Logo src={LogoImage} alt="StoryPals Logo" />
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  className={isActive(item.path) ? 'active' : ''}
                >
                  {item.text}
                </NavButton>
              ))}
              <Avatar
                sx={{
                  ml: 2,
                  bgcolor: colors.primary,
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/auth')}
              >
                <PersonIcon />
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </NavContainer>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation; 