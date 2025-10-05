import './App.css'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import HostOrJoin from './hostOrJoin.jsx'
import UserProfile from './userProfile.jsx'
import HostGame from './HostGame.jsx'
import JoinGame from './JoinGame.jsx'
import { useState, useEffect } from 'react'
import Ballpit from './Ballpit.jsx'

// Wobble Card Component inspired by Aceternity UI
// https://ui.aceternity.com/components/wobble-card
function WobbleCard({ children, onClick }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 8;
    const y = (e.clientY - rect.top - rect.height / 2) / 8;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '220px',
        height: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: mousePosition.x !== 0 || mousePosition.y !== 0 
          ? '0 20px 40px rgba(22,163,74,0.25), 0 8px 16px rgba(0,0,0,0.1)' 
          : '0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.35s ease',
        cursor: 'pointer',
        border: '1px solid #e5e7eb',
        transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale(1.08)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Floating Navbar inspired by Aceternity UI
// https://ui.aceternity.com/components/floating-navbar
function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s ease',
      pointerEvents: isVisible ? 'auto' : 'none',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '50px',
        padding: '12px 24px',
        border: '1px solid rgba(22, 163, 74, 0.3)',
        boxShadow: '0 8px 32px rgba(22, 163, 74, 0.15), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>
        <span style={{
          color: '#16a34a',
          fontWeight: '600',
          fontSize: '1rem',
        }}>
          joinAGame
        </span>
      </div>
    </div>
  );
}

// Text Reveal Effect inspired by Aceternity UI
// https://ui.aceternity.com/components/text-reveal-card
function TextRevealEffect({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out',
    }}>
      {children}
    </div>
  );
}

// Background Gradient Animation inspired by Aceternity UI
// https://ui.aceternity.com/components/background-gradient
function GradientBackground() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(45deg, rgba(22,163,74,0.15) 0%, rgba(34,197,94,0.08) 25%, rgba(255,255,255,0.02) 50%, rgba(34,197,94,0.08) 75%, rgba(22,163,74,0.15) 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite',
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

// Sparkles Background Component inspired by Aceternity UI
// https://ui.aceternity.com/components/sparkles
function SparklesBackground() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const newSparkles = [];
    for (let i = 0; i < 30; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 4 + 2,
      });
    }
    setSparkles(newSparkles);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          style={{
            position: 'absolute',
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: 'linear-gradient(45deg, #16a34a, #22c55e)',
            borderRadius: '50%',
            animation: `sparkle 2s ease-in-out infinite ${sparkle.delay}s`,
            opacity: 0.8,
            boxShadow: '0 0 10px rgba(22, 163, 74, 0.3)',
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

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
            position: 'relative',
          }}
        >
          {/* Floating Navbar */}
          <FloatingNavbar />
          
          {/* Background Effects */}
          <GradientBackground />
          <SparklesBackground />
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 10 }}>
            <TextRevealEffect delay={300}>
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
            </TextRevealEffect>
            <TextRevealEffect delay={600}>
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
            </TextRevealEffect>
          </div>

          {/* Sport Cards */}
          <div
            style={{
              display: 'flex',
              gap: '50px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '900px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {sports.map((sport, index) => (
              <TextRevealEffect key={sport.name} delay={900 + (index * 200)}>
                <WobbleCard
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
              </WobbleCard>
              </TextRevealEffect>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '25px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '0.9rem',
              letterSpacing: '0.4px',
              zIndex: 10,
            }}
          >
            <TextRevealEffect delay={1500}>
              <p>LINKING the world to make a better place • joinAGame © 2025</p>
            </TextRevealEffect>
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
