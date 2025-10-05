import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from './utils/api';

export default function JoinGame() {
  const navigate = useNavigate();
  const { sport } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const sportDisplay = sport ? sport.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" ") : "Sport";

  useEffect(() => {
    loadGames();
    loadCurrentUser();
  }, [sport]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const gamesData = await apiClient.getGamesBySport(sport);
      setGames(gamesData);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  };

  const handleJoinGame = async (gameId) => {
    if (!currentUser) {
      setAlertMessage('Please create a profile first');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      return;
    }

    try {
      await apiClient.joinGame(gameId, currentUser.id, currentUser.name);
      setAlertMessage('Successfully joined the game!');
      setShowSuccessAlert(true);
      loadGames(); // Refresh games list
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Failed to join game:', error);
      setAlertMessage(error.message || 'Failed to join game');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleLeaveGame = async (gameId) => {
    if (!currentUser) return;

    try {
      await apiClient.leaveGame(gameId, currentUser.id);
      setAlertMessage('Left the game successfully');
      setShowSuccessAlert(true);
      loadGames(); // Refresh games list
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Failed to leave game:', error);
      setAlertMessage('Failed to leave game');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const isUserInGame = (game) => {
    return currentUser && game.players.some(player => player.userId === currentUser.id);
  };

  const isGameFull = (game) => {
    return game.players.length >= game.maxPlayers;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5); // HH:MM format
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)',
    fontFamily: 'Poppins, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: '10px',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#718096',
    marginBottom: '30px',
  };

  const gamesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const gameCardStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
  };

  const gameTitleStyle = {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  };

  const gameInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#4a5568',
    fontSize: '0.9rem',
  };

  const playersInfoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  };

  const skillLevelStyle = {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
  };

  const joinButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#16a34a',
    color: 'white',
  };

  const leaveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    color: 'white',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    color: 'white',
    cursor: 'not-allowed',
  };

  const loadingStyle = {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#718096',
    marginTop: '50px',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    marginTop: '50px',
    color: '#718096',
  };

  const backButtonStyle = {
    position: 'fixed',
    top: '24px',
    left: '24px',
    padding: '10px 14px',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#16a34a',
    fontWeight: '600',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  };

  const successAlertStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '20px 40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
    fontSize: '1.2rem',
    fontWeight: '600',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: showSuccessAlert ? 'block' : 'none',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading games...</div>
      </div>
    );
  }

  return (
    <>
      {/* Success Alert */}
      {showSuccessAlert && (
        <div style={overlayStyle}>
          <div style={successAlertStyle}>
            <span>ℹ️</span>
            {alertMessage}
          </div>
        </div>
      )}

      <div style={containerStyle}>
        <button
          style={backButtonStyle}
          onClick={() => navigate(`/sport/${sport}`)}
        >
          ← Back
        </button>

        <div style={headerStyle}>
          <h1 style={titleStyle}>Join a {sportDisplay} Game</h1>
          <p style={subtitleStyle}>
            Find and join games in your area
          </p>
        </div>

        {games.length === 0 ? (
          <div style={emptyStateStyle}>
            <h3>No games available</h3>
            <p>Be the first to create a {sportDisplay} game!</p>
          </div>
        ) : (
          <div style={gamesGridStyle}>
            {games.map((game) => {
              const userInGame = isUserInGame(game);
              const gameFull = isGameFull(game);
              const isHost = currentUser && game.hostId === currentUser.id;

              const getSkillLevelColor = (level) => {
                switch (level) {
                  case 'beginner': return { backgroundColor: '#dcfce7', color: '#16a34a' };
                  case 'intermediate': return { backgroundColor: '#fef3c7', color: '#d97706' };
                  case 'advanced': return { backgroundColor: '#fed7d7', color: '#dc2626' };
                  case 'expert': return { backgroundColor: '#e0e7ff', color: '#7c3aed' };
                  default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
                }
              };

              return (
                <div key={game.id} style={gameCardStyle}>
                  <h3 style={gameTitleStyle}>{game.title}</h3>
                  
                  <div style={gameInfoStyle}>
                    <div style={infoItemStyle}>
                      <span>📍</span>
                      <span>{game.location}</span>
                    </div>
                    <div style={infoItemStyle}>
                      <span>📅</span>
                      <span>{formatDate(game.date)}</span>
                    </div>
                    <div style={infoItemStyle}>
                      <span>🕐</span>
                      <span>{formatTime(game.time)}</span>
                    </div>
                    {game.description && (
                      <div style={infoItemStyle}>
                        <span>📝</span>
                        <span>{game.description}</span>
                      </div>
                    )}
                  </div>

                  <div style={playersInfoStyle}>
                    <div>
                      <strong>{game.players.length}/{game.maxPlayers}</strong> players
                    </div>
                    <div style={{
                      ...skillLevelStyle,
                      ...getSkillLevelColor(game.skillLevel)
                    }}>
                      {game.skillLevel}
                    </div>
                  </div>

                  <div>
                    {isHost ? (
                      <button style={disabledButtonStyle} disabled>
                        You're the host
                      </button>
                    ) : userInGame ? (
                      <button 
                        style={leaveButtonStyle}
                        onClick={() => handleLeaveGame(game.id)}
                      >
                        Leave Game
                      </button>
                    ) : gameFull ? (
                      <button style={disabledButtonStyle} disabled>
                        Game Full
                      </button>
                    ) : (
                      <button 
                        style={joinButtonStyle}
                        onClick={() => handleJoinGame(game.id)}
                      >
                        Join Game
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
