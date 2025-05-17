import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  readingLevel: string;
  lastActivity: string;
}

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async (): Promise<void> => {
      try {
        const response = await api.get<Child[]>('/children');
        setChildren(response.data);
      } catch (err) {
        setError('Failed to fetch children data');
        console.error('Error fetching children:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchChildren();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, childId: string): void => {
    setAnchorEl(event.currentTarget);
    setSelectedChild(childId);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
    setSelectedChild(null);
  };

  const handleAddChild = (): void => {
    navigate('/add-child');
  };

  const handleViewProgress = (childId: string): void => {
    navigate(`/child/${childId}/progress`);
  };

  const handleEditChild = (childId: string): void => {
    navigate(`/child/${childId}/edit`);
  };

  const handleDeleteChild = async (childId: string): Promise<void> => {
    try {
      await api.delete(`/children/${childId}`);
      setChildren(children.filter(child => child.id !== childId));
    } catch (err) {
      setError('Failed to delete child');
      console.error('Error deleting child:', err);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Children
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddChild}
        >
          Add Child
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {children.map((child) => (
          <Grid item xs={12} sm={6} md={4} key={child.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={child.avatar}
                      alt={child.name}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="h6">{child.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Age: {child.age}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, child.id)}
                    aria-label="child menu"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Reading Level: {child.readingLevel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Activity: {child.lastActivity}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => handleViewProgress(child.id)}
                >
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedChild && handleEditChild(selectedChild)}>
          Edit Profile
        </MenuItem>
        <MenuItem onClick={() => selectedChild && handleDeleteChild(selectedChild)}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default DashboardScreen; 