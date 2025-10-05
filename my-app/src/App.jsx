import './App.css'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import HostOrJoin from './hostOrJoin.jsx'
import UserProfile from './userProfile.jsx'
import HostGame from './HostGame.jsx'
import JoinGame from './JoinGame.jsx'

function SportPage() {
  const { sportName } = useParams();
  return <HostOrJoin selectedSport={sportName} />;
}

function UserProfilePage() {
  return <UserProfile />; 
}

function App() {
  const navigate = useNavigate();
  
  const sports = [
    { name: 'pickleball', emoji: '🏓', displayName: 'Pickleball' },
    { name: 'handball', emoji: '🤾‍♂️', displayName: 'Handball' },
    { name: 'table-tennis', emoji: '🥎', displayName: 'Table Tennis' },
  ];

  const handleSportClick = (sportName) => {
    navigate('/profile', { state: { selectedSport: sportName } });
  };

  return (
    <Routes>
      <Route path="/" element={
        /* ... your existing landing JSX ... */
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins, Arial, sans-serif',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1
              style={{
                color: '#16a34a',
                fontSize: '3.5rem',
                fontWeight: '700',
                letterSpacing: '-1px',
                marginBottom: '10px',
              }}
            >
              joinAGame
            </h1>
            <p
              style={{
                color: '#4b5563',
                fontSize: '1.2rem',
                fontWeight: '400',
                letterSpacing: '0.3px',
              }}
            >
              Connect. Compete. Have fun.
            </p>
          </div>

          {/* Sport Cards */}
          <div
            style={{
              display: 'flex',
              gap: '50px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '900px',
            }}
          >
            {sports.map((sport) => (
              <div
                key={sport.name}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  width: '220px',
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.35s ease',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 16px 40px rgba(22,163,74,0.25), 0 8px 16px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)';
                }}
                onClick={() => handleSportClick(sport.name)}
              >
                <span style={{ fontSize: '3.5rem', marginBottom: '15px' }}>
                  {sport.emoji}
                </span>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#14532d',
                    letterSpacing: '0.5px',
                  }}
                >
                  {sport.displayName}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '25px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '0.9rem',
              letterSpacing: '0.4px',
            }}
          >
            <p>LINKING the world to make a better place • joinAGame © 2025</p>
          </div>
        </div>
      } />

      <Route path="/sport/:sportName" element={<SportPage />} />
      <Route path="/join/:sport" element={<JoinGame />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/host/:sport" element={<HostGame />} />

    </Routes>
  );
}

export default App;
