import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Chat as ChatIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Color palette
const colors = {
  primary: '#7b5ea7',    // Purple
  secondary: '#f0c3e9',  // Light pink
  accent: '#ff9e6d',     // Orange
  light: '#f9f5ff',      // Very light purple
  dark: '#483c67',       // Dark purple
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  color: colors.dark,
  height: '150px',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: colors.dark,
  fontWeight: 500,
  padding: '10px 20px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(123, 94, 167, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  height: '40px',
  padding: '0 16px',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: colors.primary,
  fontSize: '1.25rem',
  letterSpacing: '0.5px',
}));

const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  height: '100%',
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginLeft: 'auto',
}));

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Stories', path: '/stories', icon: <BookIcon /> },
  ];

  const userMenuItems = [
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Logout', action: onLogout, icon: <LogoutIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LogoText>StoryPals</LogoText>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: colors.primary }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          {userMenuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  navigate(item.path);
                }
                handleDrawerToggle();
              }}
            >
              <ListItemIcon sx={{ color: colors.primary }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      ) : (
        <List>
          <ListItem button onClick={() => {
            navigate('/auth');
            handleDrawerToggle();
          }}>
            <ListItemIcon sx={{ color: colors.primary }}><LoginIcon /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <StyledAppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '80px !important', px: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Logo onClick={() => navigate('/')}>
              <LogoText>StoryPals</LogoText>
            </Logo>

            {!isMobile && (
              <NavContainer>
                {navItems.map((item) => (
                  <NavButton
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: location.pathname === item.path ? colors.primary : colors.dark,
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      backgroundColor: location.pathname === item.path ? 'rgba(123, 94, 167, 0.1)' : 'transparent',
                    }}
                  >
                    {item.text}
                  </NavButton>
                ))}
              </NavContainer>
            )}

            <UserSection>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar 
                        alt="User" 
                        src="/static/images/avatar/2.jpg"
                        sx={{ 
                          width: 36, 
                          height: 36,
                          border: `2px solid ${colors.primary}`,
                        }} 
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    {userMenuItems.map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else if (item.path) {
                            navigate(item.path);
                          }
                          handleCloseUserMenu();
                        }}
                        sx={{
                          py: 1,
                          px: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(123, 94, 167, 0.1)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: colors.primary, minWidth: 36 }}>
                          {item.icon}
                        </ListItemIcon>
                        <Typography textAlign="center">{item.text}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate('/auth')}
                  sx={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(123, 94, 167, 0.3)',
                    '&:hover': {
                      backgroundColor: colors.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(123, 94, 167, 0.4)',
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </UserSection>
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Box sx={{ height: '80px' }} /> {/* Updated spacer height */}
      
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 