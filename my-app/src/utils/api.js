const API_BASE_URL = 'http://localhost:3001/api';

// API utility functions
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User API methods
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers() {
    return this.request('/users');
  }

  // Game API methods
  async createGame(gameData) {
    return this.request('/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async getAllGames() {
    return this.request('/games');
  }

  async getGamesBySport(sport) {
    return this.request(`/games/${sport}`);
  }

  async joinGame(gameId, userId, playerName) {
    return this.request(`/games/${gameId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId, playerName }),
    });
  }

  async leaveGame(gameId, userId) {
    return this.request(`/games/${gameId}/players/${userId}`, {
      method: 'DELETE',
    });
  }

  async deleteGame(gameId) {
    return this.request(`/games/${gameId}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  async getHealthStatus() {
    return this.request('/health');
  }

  async getAllData() {
    return this.request('/data');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export individual methods for convenience
export const {
  createUser,
  updateUser,
  getAllUsers,
  createGame,
  getAllGames,
  getGamesBySport,
  joinGame,
  leaveGame,
  deleteGame,
  getHealthStatus,
  getAllData,
} = apiClient;
