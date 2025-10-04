<<<<<<< HEAD
import './App.css'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import HostOrJoin from './hostOrJoin.jsx'

function SportPage() {
  const { sportName } = useParams();
  return <HostOrJoin selectedSport={sportName} />;
}
=======
import './index.css';
>>>>>>> 4e8aa619f31474382532a25a7255482691882d05

function App() {
  const navigate = useNavigate();
  
  const sports = [
    { name: 'pickleball', emoji: '🏓', displayName: 'Pickleball' },
    { name: 'handball', emoji: '🤾‍♂️', displayName: 'Handball' },
    { name: 'table-tennis', emoji: '🏓', displayName: 'Table Tennis' },
  ];

  const handleSportClick = (sportName) => {
    navigate(`/sport/${sportName}`);
  };

  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/" element={
        <div
          style={{
            height: '100vh',
            width: '100vw',
            background: 'linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins, Arial, sans-serif',
            overflow: 'hidden',
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
=======
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
>>>>>>> 4e8aa619f31474382532a25a7255482691882d05
      <div
        style={{
          width: 'min(1000px, 92vw)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '3rem',
        }}
      >
        {/* Title */}
        <div>
          <h1
            style={{
              margin: 0,
              color: '#16a34a', // lighter green
              fontSize: '3.2rem',
              fontWeight: 800,
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-0.5px',
            }}
            onClick={() => handleSportClick(sport.name)}
          >
            joinAGame
          </h1>
          <p
            style={{
              marginTop: '12px',
              color: '#4b5563',
              fontSize: '1.1rem',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Get LINKED. HOST games. Play ANYWHERE.
          </p>
        </div>

        {/* Sport Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '28px',
            width: '100%',
          }}
        >
          {sports.map((sport) => (
            <button
              key={sport.name}
              style={{
                appearance: 'none',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                borderRadius: '20px',
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 18px rgba(22,163,74,0.12)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(22,163,74,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(22,163,74,0.12)';
              }}
            >
<<<<<<< HEAD
              {sport.displayName}
            </span>
          </div>
        ))}
      </div>
=======
              <span style={{ fontSize: '2.8rem' }}>{sport.emoji}</span>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  marginTop: '10px',
                  color: '#15803d',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {sport.name}
              </span>
            </button>
          ))}
        </div>
>>>>>>> 4e8aa619f31474382532a25a7255482691882d05

        {/* Footer */}
        <div
          style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            fontFamily: 'Inter, sans-serif',
            marginTop: '1rem',
          }}
        >
          © 2025 joinAGame • Calgary
        </div>
      </div>
    </div>
      } />
      
      <Route path="/sport/:sportName" element={
        <SportPage />
      } />
    </Routes>
  );
}

export default App;
