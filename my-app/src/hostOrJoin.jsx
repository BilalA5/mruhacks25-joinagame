import React from "react";
import { useNavigate } from "react-router-dom";

export default function HostOrJoin({ selectedSport }) {
  const navigate = useNavigate();

  const sportDisplay = selectedSport
    ? selectedSport.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" ")
    : "Sport";

  const brand = {
    green: "#16a34a",
    greenDark: "#14532d",
    text: "#4b5563",
    border: "#e5e7eb",
    cardShadow: "0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)",
    cardShadowHover: "0 16px 40px rgba(22,163,74,0.25), 0 8px 16px rgba(0,0,0,0.08)",
  };

  const pageStyle = {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, Arial, sans-serif",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    padding: "20px",
    boxSizing: "border-box",
  };

  const headerWrap = { textAlign: "center", marginBottom: 50, maxWidth: 900, padding: "0 20px" };
  const titleStyle  = { color: brand.green, fontSize: "3rem", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 };
  const subtitleStyle = { color: brand.text, fontSize: "1.1rem", letterSpacing: "0.3px" };

  const cardsWrap = { display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", maxWidth: 900, padding: "0 20px" };

  const cardBase = {
    background: "#ffffff",
    borderRadius: 20,
    width: 320,
    height: 260,
    padding: 22,
    boxShadow: brand.cardShadow,
    transition: "all 0.35s ease",
    cursor: "pointer",
    border: `1px solid ${brand.border}`,
    display: "grid",
    gridTemplateRows: "auto auto 1fr auto",
    rowGap: 8,
    textAlign: "center",
    alignItems: "start",
  };

  const iconBox = {
    height: 56,
    width: 56,
    margin: "0 auto 4px",
    borderRadius: 12,
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 0 0 1px rgba(20,83,45,0.08)",
  };
  const iconEmoji = { fontSize: 28, lineHeight: 1 };

  const cardTitle = { fontSize: "1.25rem", fontWeight: 700, color: brand.greenDark, marginTop: 2 };
  const cardDesc  = { color: brand.text, fontSize: "1rem", lineHeight: 1.4, marginTop: 2, marginBottom: 6, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" };

  // One unified CTA style for BOTH buttons
  const ctaBtn = {
    width: 160,
    margin: "0 auto",
    padding: "12px 20px",
    borderRadius: 14,
    background: brand.green,
    color: "#ffffff",
    fontWeight: 700,
    border: "none",
    boxShadow: "0 6px 16px rgba(22,163,74,0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const backBtn = {
    position: "absolute",
    top: 24,
    left: 24,
    padding: "10px 14px",
    borderRadius: 12,
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
      <button
        style={backBtn}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = brand.cardShadowHover; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = brand.cardShadow; }}
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <div style={headerWrap}>
        <h1 style={titleStyle}>{sportDisplay}</h1>
        <p style={subtitleStyle}>What would you like to do for {sportDisplay} today?</p>
      </div>

      <div style={cardsWrap}>
        {/* Host */}
        <div
          style={cardBase}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px) scale(1.03)"; e.currentTarget.style.boxShadow = brand.cardShadowHover; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = brand.cardShadow; }}
          onClick={() => navigate(`/host/${selectedSport}`)}
        >
          <div style={iconBox}><span style={iconEmoji}>🗓️</span></div>
          <div style={cardTitle}>Host A Game</div>
          <div style={cardDesc}>Create a match and invite players.</div>
          <button
            style={ctaBtn}
            onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(22,163,74,0.35)"; }}
            onMouseLeave={e => { e.stopPropagation(); e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(22,163,74,0.25)"; }}
          >
            Start Hosting
          </button>
        </div>

        {/* Join */}
        <div
          style={cardBase}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px) scale(1.03)"; e.currentTarget.style.boxShadow = brand.cardShadowHover; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = brand.cardShadow; }}
          onClick={() => navigate(`/join/${selectedSport}`)}
        >
          <div style={iconBox}><span style={iconEmoji}>✅</span></div>
          <div style={cardTitle}>Join A Game</div>
          <div style={cardDesc}>Find a match that fits your time.</div>
          <button
            style={ctaBtn}
            onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(22,163,74,0.35)"; }}
            onMouseLeave={e => { e.stopPropagation(); e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(22,163,74,0.25)"; }}
          >
            Browse Games
          </button>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 22, textAlign: "center", color: "#9ca3af", fontSize: "0.9rem", letterSpacing: "0.4px", padding: "0 12px" }}>
        <p>Linking the world to make a better place • joinAGame © 2025</p>
      </div>
    </div>
  );
}
