import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  AccessTime as TimeIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { mockChats, mockCharacters } from '../services/mockData';

const ChatHistoryScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('all');

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.messages.some(message =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCharacter = selectedCharacter === 'all' || chat.character === selectedCharacter;
    return matchesSearch && matchesCharacter;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat History
      </Typography>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Character</InputLabel>
          <Select
            value={selectedCharacter}
            label="Character"
            onChange={(e) => setSelectedCharacter(e.target.value)}
          >
            <MenuItem value="all">All Characters</MenuItem>
            {mockCharacters.map((character) => (
              <MenuItem key={character.id} value={character.name}>
                {character.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Chat History List */}
      <Grid container spacing={3}>
        {filteredChats.map((chat) => (
          <Grid item xs={12} key={chat.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      {chat.character} with {chat.childName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        icon={<TimeIcon />}
                        label={`${format(new Date(chat.lastUpdated), 'MMM d, yyyy h:mm a')}`}
                        size="small"
                      />
                      <Chip
                        icon={<MessageIcon />}
                        label={`${chat.messages.length} messages`}
                        size="small"
                      />
                      <Chip
                        icon={<PersonIcon />}
                        label={chat.childName}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Last message: {chat.messages[chat.messages.length - 1].content}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ChatHistoryScreen; 