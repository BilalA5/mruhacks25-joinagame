import React from "react";
import { useNavigate } from "react-router-dom";

export default function HostOrJoin({ selectedSport }) {
  const navigate = useNavigate();

  // Nicely format sport name (handle things like "table-tennis")
  const sportDisplay = selectedSport
    ? selectedSport
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")
    : "Sport";

  // Shared colors & shadows (matching landing page)
  const brand = {
    green: "#16a34a",
    greenDark: "#14532d",
    text: "#4b5563",
    border: "#e5e7eb",
    cardShadow:
      "0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)",
    cardShadowHover:
      "0 16px 40px rgba(22,163,74,0.25), 0 8px 16px rgba(0,0,0,0.08)",
  };

  const pageStyle = {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, Arial, sans-serif",
    overflow: "hidden",
    position: "relative",
  };

  const headerWrap = {
    textAlign: "center",
    marginBottom: "50px",
    maxWidth: 900,
    padding: "0 20px",
  };

  const titleStyle = {
    color: brand.green,
    fontSize: "3rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    marginBottom: "8px",
  };

  const subtitleStyle = {
    color: brand.text,
    fontSize: "1.1rem",
    letterSpacing: "0.3px",
  };

  const cardsWrap = {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "900px",
    padding: "0 20px",
  };

  const cardBase = {
    background: "#ffffff",
    borderRadius: "20px",
    width: "260px",
    height: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: brand.cardShadow,
    transition: "all 0.35s ease",
    cursor: "pointer",
    border: `1px solid ${brand.border}`,
    textAlign: "center",
  };

  const primaryBtn = {
    marginTop: "16px",
    padding: "12px 20px",
    borderRadius: "14px",
    background: brand.green,
    color: "#ffffff",
    fontWeight: 700,
    border: "none",
    boxShadow: "0 6px 16px rgba(22,163,74,0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const secondaryBtn = {
    ...primaryBtn,
    background: "#10b981", // a lil lighter, still in family
  };

  const backBtn = {
    position: "absolute",
    top: "24px",
    left: "24px",
    padding: "10px 14px",
    borderRadius: "12px",
    background: "#ffffff",
    color: brand.greenDark,
    fontWeight: 600,
    border: `1px solid ${brand.border}`,
    boxShadow: brand.cardShadow,
    cursor: "pointer",
    transition: "all 0.25s ease",
  };

  return (
    <div style={pageStyle}>
      {/* Back to home */}
      <button
        style={backBtn}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = brand.cardShadowHover;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = brand.cardShadow;
        }}
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      {/* Header */}
      <div style={headerWrap}>
        <h1 style={titleStyle}>{sportDisplay}</h1>
        <p style={subtitleStyle}>
          What would you like to do for {sportDisplay} today?
        </p>
      </div>

      {/* Action Cards */}
      <div style={cardsWrap}>
        {/* Host */}
        <div
          style={cardBase}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
            e.currentTarget.style.boxShadow = brand.cardShadowHover;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = brand.cardShadow;
          }}
          onClick={() => navigate(`/host/${selectedSport}`)}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>🗓️</div>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: brand.greenDark,
            }}
          >
            Host A Game
          </div>
          <div style={{ color: brand.text, marginTop: 6 }}>
            Create a match and invite players.
          </div>
          <button
            style={primaryBtn}
            onMouseEnter={e => {
              e.stopPropagation();
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(22,163,74,0.35)";
            }}
            onMouseLeave={e => {
              e.stopPropagation();
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(22,163,74,0.25)";
            }}
          >
            Start Hosting
          </button>
        </div>

        {/* Join */}
        <div
          style={cardBase}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
            e.currentTarget.style.boxShadow = brand.cardShadowHover;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = brand.cardShadow;
          }}
          onClick={() => navigate(`/join/${selectedSport}`)}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>✅</div>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: brand.greenDark,
            }}
          >
            Join A Game
          </div>
          <div style={{ color: brand.text, marginTop: 6 }}>
            Find a match that fits your time.
          </div>
          <button
            style={secondaryBtn}
            onMouseEnter={e => {
              e.stopPropagation();
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(16,185,129,0.35)";
            }}
            onMouseLeave={e => {
              e.stopPropagation();
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(16,185,129,0.25)";
            }}
          >
            Browse Games
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "22px",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "0.9rem",
          letterSpacing: "0.4px",
          padding: "0 12px",
        }}
      >
        <p>Linking the world to make a better place • joinAGame © 2025</p>
      </div>
    </div>
  );
}
