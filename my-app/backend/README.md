# JoinAGame Backend

A simple Express.js backend for the JoinAGame application that uses JSON file storage for data persistence.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup the backend (creates data file if needed):**
   ```bash
   npm run setup
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

The backend will be available at `http://localhost:3001`

## Development

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:sport` - Get games by sport
- `POST /api/games` - Create a new game
- `POST /api/games/:gameId/join` - Join a game
- `DELETE /api/games/:gameId/players/:userId` - Leave a game
- `DELETE /api/games/:gameId` - Delete a game

### Health Check
- `GET /api/health` - Check server status
- `GET /api/data` - Get all data

## Data Storage

The backend uses a JSON file (`data.json`) for data persistence. The file is automatically created when the server starts if it doesn't exist.

### Data Structure
```json
{
  "users": [],
  "games": [],
  "sports": ["pickleball", "handball", "table-tennis"],
  "lastUpdated": "2025-01-05T..."
}
```

## Troubleshooting

### Common Issues

1. **"Failed to create game" errors:**
   - Make sure you have a user profile created first
   - Check that all required fields are provided
   - Verify the backend server is running

2. **Data file issues:**
   - Run `npm run setup` to recreate the data file
   - Check file permissions in the backend directory

3. **CORS errors:**
   - The backend includes CORS middleware for cross-origin requests
   - Make sure the frontend is running on the correct port

### Logs

The server provides detailed console logs for debugging:
- API request/response details
- Data file operations
- Error messages with context

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **nodemon**: Development auto-restart (dev dependency)
