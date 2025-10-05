const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it with initial structure
    const initialData = {
      users: [],
      games: [],
      sports: ['pickleball', 'handball', 'table-tennis'],
      lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('Created initial data file');
  }
}

// Read data from JSON file
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    throw new Error('Failed to read data');
  }
}

// Write data to JSON file
async function writeData(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to save data');
  }
}

// Generate unique IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// API Routes

// Get all data
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read games' });
  }
});

// Get games by sport
app.get('/api/games/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    const data = await readData();
    const games = data.games.filter(game => game.sport === sport);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read games' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const data = await readData();
    const newUser = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.users.push(newUser);
    await writeData(data);
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Create a new game
app.post('/api/games', async (req, res) => {
  try {
    const data = await readData();
    const newGame = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      players: req.body.players || [],
      maxPlayers: req.body.maxPlayers || 4,
      status: 'open' // open, full, completed, cancelled
    };
    
    data.games.push(newGame);
    await writeData(data);
    
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// Join a game
app.post('/api/games/:gameId/join', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, playerName } = req.body;
    
    const data = await readData();
    const game = data.games.find(g => g.id === gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    if (game.players.length >= game.maxPlayers) {
      return res.status(400).json({ error: 'Game is full' });
    }
    
    // Check if player is already in the game
    if (game.players.some(p => p.userId === userId)) {
      return res.status(400).json({ error: 'Player already in game' });
    }
    
    const newPlayer = {
      userId,
      playerName,
      joinedAt: new Date().toISOString()
    };
    
    game.players.push(newPlayer);
    game.updatedAt = new Date().toISOString();
    
    // Update game status
    if (game.players.length >= game.maxPlayers) {
      game.status = 'full';
    }
    
    await writeData(data);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join game' });
  }
});

// Leave a game
app.delete('/api/games/:gameId/players/:userId', async (req, res) => {
  try {
    const { gameId, userId } = req.params;
    
    const data = await readData();
    const game = data.games.find(g => g.id === gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    game.players = game.players.filter(p => p.userId !== userId);
    game.updatedAt = new Date().toISOString();
    game.status = 'open';
    
    await writeData(data);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave game' });
  }
});

// Update user profile
app.put('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await readData();
    const userIndex = data.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeData(data);
    res.json(data.users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a game
app.delete('/api/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const data = await readData();
    
    const gameIndex = data.games.findIndex(g => g.id === gameId);
    if (gameIndex === -1) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    data.games.splice(gameIndex, 1);
    await writeData(data);
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  await initializeDataFile();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
  });
}

startServer().catch(console.error);

module.exports = app;
