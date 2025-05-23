export interface MockChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'character';
  timestamp: string;
}

export interface MockChat {
  id: string;
  character: string;
  childName: string;
  messages: MockChatMessage[];
  lastUpdated: string;
}

export interface MockAnalytics {
  overall: {
    totalChats: number;
    totalMessages: number;
    totalDuration: number;
    averageVocabularyScore: number;
    averageGrammarScore: number;
  };
  byCharacter: {
    [key: string]: {
      totalChats: number;
      totalMessages: number;
      totalDuration: number;
      avgVocabulary: number;
      avgGrammar: number;
      topics: string[];
    };
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    achievedAt: string;
  }>;
}

export const mockCharacters = [
  { id: 'luna', name: 'Luna', image: '/characters/luna.png', description: 'A friendly space explorer who loves teaching about the stars and planets.' },
  { id: 'gogo', name: 'Gogo', image: '/characters/gogo.png', description: 'An adventurous dinosaur who makes learning about history fun.' },
  { id: 'dodo', name: 'Dodo', image: '/characters/dodo.png', description: 'A wise owl who helps children learn about nature and animals.' },
  { id: 'leo', name: 'Leo', image: '/characters/leo.png', description: 'A playful lion who teaches about courage and friendship.' }
];

export const mockChats: MockChat[] = [
  {
    id: '1',
    character: 'Luna',
    childName: 'Emma',
    lastUpdated: '2024-03-20T15:30:00Z',
    messages: [
      {
        id: '1',
        content: 'Hi Luna! Can you tell me about the stars?',
        sender: 'user',
        timestamp: '2024-03-20T15:25:00Z'
      },
      {
        id: '2',
        content: 'Of course! Stars are giant balls of gas that give off light and heat. The closest star to Earth is our Sun!',
        sender: 'character',
        timestamp: '2024-03-20T15:25:30Z'
      }
    ]
  },
  {
    id: '2',
    character: 'Gogo',
    childName: 'Emma',
    lastUpdated: '2024-03-19T14:20:00Z',
    messages: [
      {
        id: '3',
        content: 'What did dinosaurs eat?',
        sender: 'user',
        timestamp: '2024-03-19T14:15:00Z'
      },
      {
        id: '4',
        content: 'Different dinosaurs ate different things! Some were plant-eaters, like the gentle Brachiosaurus, while others were meat-eaters, like the mighty T-Rex!',
        sender: 'character',
        timestamp: '2024-03-19T14:15:45Z'
      }
    ]
  }
];

export const mockAnalytics: MockAnalytics = {
  overall: {
    totalChats: 15,
    totalMessages: 120,
    totalDuration: 180, // minutes
    averageVocabularyScore: 8.5,
    averageGrammarScore: 7.8
  },
  byCharacter: {
    'Luna': {
      totalChats: 5,
      totalMessages: 45,
      totalDuration: 60,
      avgVocabulary: 8.7,
      avgGrammar: 8.0,
      topics: ['Space', 'Stars', 'Planets', 'Astronomy']
    },
    'Gogo': {
      totalChats: 4,
      totalMessages: 35,
      totalDuration: 45,
      avgVocabulary: 8.2,
      avgGrammar: 7.5,
      topics: ['Dinosaurs', 'History', 'Prehistoric Life']
    },
    'Dodo': {
      totalChats: 3,
      totalMessages: 25,
      totalDuration: 40,
      avgVocabulary: 8.4,
      avgGrammar: 7.9,
      topics: ['Animals', 'Nature', 'Environment']
    },
    'Leo': {
      totalChats: 3,
      totalMessages: 15,
      totalDuration: 35,
      avgVocabulary: 8.6,
      avgGrammar: 8.2,
      topics: ['Friendship', 'Courage', 'Leadership']
    }
  },
  milestones: [
    {
      id: '1',
      title: 'Space Explorer',
      description: 'Learned about all planets in our solar system',
      achievedAt: '2024-03-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Dino Expert',
      description: 'Identified 10 different types of dinosaurs',
      achievedAt: '2024-03-10T14:30:00Z'
    },
    {
      id: '3',
      title: 'Nature Lover',
      description: 'Learned about 15 different animal species',
      achievedAt: '2024-03-05T16:45:00Z'
    }
  ]
};

export const mockDashboardStats = {
  totalInteractions: 120,
  averageSessionDuration: 12, // minutes
  favoriteCharacter: 'Luna',
  recentTopics: ['Space', 'Dinosaurs', 'Animals', 'Friendship'],
  learningProgress: 75, // percentage
  weeklyActivity: [
    { day: 'Mon', interactions: 15 },
    { day: 'Tue', interactions: 20 },
    { day: 'Wed', interactions: 12 },
    { day: 'Thu', interactions: 18 },
    { day: 'Fri', interactions: 25 },
    { day: 'Sat', interactions: 30 },
    { day: 'Sun', interactions: 22 }
  ]
}; 