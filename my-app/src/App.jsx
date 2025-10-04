import "./App.css";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import HostOrJoin from "./hostOrJoin.jsx";

function SportPage() {
  const { sportName } = useParams();
  return <HostOrJoin selectedSport={sportName} />;
}

function App() {
  const navigate = useNavigate();

  const sports = [
    { name: "pickleball", emoji: "🏓", displayName: "Pickleball" },
    { name: "handball", emoji: "🤾‍♂️", displayName: "Handball" },
    { name: "table-tennis", emoji: "🏓", displayName: "Table Tennis" },
  ];

  const handleSportClick = (sportName) => {
    navigate(`/sport/${sportName}`);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              height: "100vh",
              width: "100vw",
              background: "linear-gradient(180deg, #ffffff 0%, #f6fff8 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Poppins, Inter, sans-serif",
              overflow: "hidden",
              position: "relative",
              padding: "0 24px",
            }}
          >
            {/* Header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 48,
                /* removed position/left to keep perfectly centered */
              }}
            >
              <h1
                style={{
                  color: "#22c55e",
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.8px",
                  margin: 0,
                }}
              >
                joinAGame
              </h1>
              <p
                style={{
                  color: "#4b5563",
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  marginTop: 8,
                }}
              >
                Connect. Compete. Have fun.
              </p>
            </div>

            {/* Sports Grid - Perfectly Centered */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 32,
                width: "100%",
                /* removed position/left to keep perfectly centered */
              }}
            >
              {sports.map((sport) => (
                <button
                  key={sport.name}
                  style={{
                    width: "300px",
                    height: 230,
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    borderRadius: 22,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 12px 28px rgba(34,197,94,0.12), 0 6px 16px rgba(0,0,0,0.05)",
                    transition:
                      "transform .25s ease, box-shadow .25s ease, background .25s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-8px) scale(1.04)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(34,197,94,0.25)";
                    e.currentTarget.style.background = "#fafffa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 28px rgba(34,197,94,0.12), 0 6px 16px rgba(0,0,0,0.05)";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                  onClick={() => handleSportClick(sport.name)}
                >
                  <span style={{ fontSize: "3.2rem", marginBottom: 12 }}>
                    {sport.emoji}
                  </span>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "#14532d",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {sport.displayName}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "0.9rem",
              }}
            >
              <p>Linking Niche Athletes • joinAGame © 2025</p>
            </div>
          </div>
        }
      />
      <Route path="/sport/:sportName" element={<SportPage />} />
    </Routes>
  );
}

export default App;