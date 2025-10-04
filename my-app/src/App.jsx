import './index.css';

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
        background: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
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
  );
}

export default App;
