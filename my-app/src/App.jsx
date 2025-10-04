import './App.css'

function App() {
  const sports = [
    { name: 'Pickleball', emoji: '🏓' },
    { name: 'Handball', emoji: '🤾‍♂️' },
    { name: 'Table Tennis', emoji: '🏓' },
  ];

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(to bottom right, #ffffff, #f3faf5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1
          style={{
            color: '#15803d',
            fontSize: '4rem',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            margin: 0,
          }}
        >
          joinAGame
        </h1>
        <p
          style={{
            color: '#4b5563',
            fontSize: '1.25rem',
            marginTop: '10px',
            letterSpacing: '0.2px',
          }}
        >
          Find players. Host games. Play anywhere.
        </p>
      </div>

      {/* Sports Cards */}
      <div
        style={{
          display: 'flex',
          gap: '60px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '1000px',
          padding: '0 40px',
        }}
      >
        {sports.map((sport) => (
          <div
            key={sport.name}
            style={{
              backgroundColor: 'white',
              borderRadius: '22px',
              width: '240px',
              height: '240px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 10px 25px rgba(22, 163, 74, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.35s ease',
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
              e.currentTarget.style.boxShadow =
                '0 16px 40px rgba(22, 163, 74, 0.25), 0 8px 16px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow =
                '0 10px 25px rgba(22, 163, 74, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)';
            }}
          >
            <span style={{ fontSize: '3.5rem', marginBottom: '18px' }}>
              {sport.emoji}
            </span>
            <span
              style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#14532d',
                letterSpacing: '0.5px',
              }}
            >
              {sport.name}
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
          fontSize: '0.95rem',
          letterSpacing: '0.3px',
        }}
      >
        <p>© 2025 joinAGame • Made with 💚 in Calgary</p>
      </div>
    </div>
  );
}

export default App;
