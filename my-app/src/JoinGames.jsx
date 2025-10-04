// src/JoinGames.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function JoinGames() {
  const { sportName } = useParams();
  const navigate = useNavigate();

  // ---- Brand look (matches your app) ----
  const brand = {
    green: "#16a34a",
    green2: "#22c55e",
    dark: "#14532d",
    muted: "#6b7280",
    border: "rgba(0,0,0,0.08)",
    chipBg: "rgba(34, 197, 94, 0.08)",
    chipBr: "rgba(34, 197, 94, 0.25)",
    ring: "rgba(34, 197, 94, 0.35)",
  };

  // ---- Local storage keys ----
  const LS_PLAYERS_KEY = "joinedGames_players_v1"; // { [id]: { players:number } }
  const LS_JOINED_IDS_KEY = "joinedGames_myJoins_v1"; // string[]

  // ---- Demo lobbies (could be fetched later) ----
  const seedGames = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: crypto.randomUUID(),
        name: `${formatSport(sportName)} — Game ${i + 1}`,
        mode: "Lobby",
        tags: [formatSport(sportName).toLowerCase(), "casual", "game"],
        players: 0,
        maxPlayers: 4,
        when: sampleStartTime(i),
        location: ["City Sport Centre", "Community Gym", "North Rec Hall"][i % 3],
        notes:
          i % 2 === 0
            ? "Bring your own paddle/ball. Casual pace, all levels welcome."
            : "We’ll do quick rotations so everyone gets equal playtime.",
      })),
    [sportName]
  );

  const [games, setGames] = useState(seedGames);
  const [myJoinedIds, setMyJoinedIds] = useState([]); // prevent double-join
  const [q, setQ] = useState("");
  const [justJoinedId, setJustJoinedId] = useState(null);

  // Modal state
  const [openModalGame, setOpenModalGame] = useState(null);

  // Load saved players + my joined list
  useEffect(() => {
    try {
      const playersRaw = localStorage.getItem(LS_PLAYERS_KEY);
      const joinedRaw = localStorage.getItem(LS_JOINED_IDS_KEY);

      const savedPlayers = playersRaw ? JSON.parse(playersRaw) : {};
      const savedJoined = joinedRaw ? JSON.parse(joinedRaw) : [];

      setGames(g =>
        g.map(x => ({
          ...x,
          players: savedPlayers[x.id]?.players ?? x.players,
        }))
      );
      setMyJoinedIds(savedJoined);
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist players
  useEffect(() => {
    const toSave = games.reduce((acc, g) => {
      acc[g.id] = { players: g.players };
      return acc;
    }, {});
    try {
      localStorage.setItem(LS_PLAYERS_KEY, JSON.stringify(toSave));
    } catch (_) {}
  }, [games]);

  // Persist my joined list
  useEffect(() => {
    try {
      localStorage.setItem(LS_JOINED_IDS_KEY, JSON.stringify(myJoinedIds));
    } catch (_) {}
  }, [myJoinedIds]);

  function formatSport(s) {
    if (!s) return "Sport";
    return s
      .split("-")
      .map(t => t[0]?.toUpperCase() + t.slice(1))
      .join(" ");
  }

  function sampleStartTime(i) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30 + i * 15);
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return games;
    return games.filter(
      g =>
        g.name.toLowerCase().includes(t) ||
        g.mode.toLowerCase().includes(t) ||
        g.location.toLowerCase().includes(t) ||
        g.tags.some(tag => tag.toLowerCase().includes(t))
    );
  }, [q, games]);

  function hasJoined(id) {
    return myJoinedIds.includes(id);
  }

  function joinGame(id) {
    if (hasJoined(id)) {
      // Nice tiny toast to say “already joined”
      setJustJoinedId(id);
      setTimeout(() => setJustJoinedId(null), 700);
      return;
    }
    setGames(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        if (g.players >= g.maxPlayers) return g;
        return { ...g, players: g.players + 1 };
      })
    );
    setMyJoinedIds(prev => [...prev, id]);
    setJustJoinedId(id);
    setTimeout(() => setJustJoinedId(null), 800);
  }

  function shuffle() {
    setGames(prev => [...prev].sort(() => Math.random() - 0.5));
  }

  function details(g) {
    setOpenModalGame(g);
  }

  // ---- Styles ----
  const page = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)",
    display: "grid",
    placeItems: "center",
    fontFamily: "Poppins, Arial, sans-serif",
    padding: 24,
  };
  const container = { width: "min(980px, 100%)" };
  const title = {
    fontSize: "clamp(28px, 4vw, 44px)",
    margin: "0 0 8px",
    color: brand.dark,
    letterSpacing: ".5px",
    lineHeight: 1.15,
  };
  const subtitle = { color: brand.muted, margin: "0 0 20px" };
  const toolbar = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "22px 0 16px",
  };
  const search = {
    flex: 1,
    display: "flex",
    gap: 8,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    padding: "8px 10px",
    borderRadius: 12,
  };
  const searchInput = {
    flex: 1,
    background: "transparent",
    border: 0,
    outline: "none",
    color: "#111827",
    fontSize: 14,
  };
  const ghostBtn = {
    appearance: "none",
    border: "1px dashed rgba(16, 185, 129, 0.35)",
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    background: "transparent",
    color: brand.muted,
  };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  };
  const card = {
    background: "#ffffff",
    border: `1px solid ${brand.border}`,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,.06)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    position: "relative",
  };
  const chip = {
    padding: "4px 8px",
    borderRadius: 999,
    border: `1px solid ${brand.chipBr}`,
    background: brand.chipBg,
    fontSize: 12,
    color: brand.muted,
  };
  const actions = { marginTop: "auto", display: "flex", gap: 8 };
  const primaryBtn = (disabled = false) => ({
    appearance: "none",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    background: disabled ? "#e5e7eb" : `linear-gradient(90deg, ${brand.green}, ${brand.green2})`,
    color: disabled ? "#9ca3af" : "#fff",
    boxShadow: disabled ? "none" : `0 6px 16px ${brand.ring}`,
    transition: "transform .08s ease, box-shadow .2s ease, filter .2s ease",
  });
  const secondaryBtn = {
    appearance: "none",
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    background: "transparent",
    color: brand.muted,
    border: "1px dashed rgba(16,185,129,0.35)",
    boxShadow: "none",
  };
  const meta = {
    color: brand.muted,
    fontSize: 13,
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  };
  const empty = {
    textAlign: "center",
    padding: "40px 12px",
    color: brand.muted,
    border: "1px dashed rgba(34, 197, 94, 0.25)",
    borderRadius: 14,
    background: "rgba(34, 197, 94, 0.06)",
    marginTop: 12,
  };
  const backBtn = {
    marginBottom: 14,
    border: `1px solid ${brand.border}`,
    background: "#fff",
    color: brand.dark,
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)",
  };

  return (
    <div style={page}>
      <div style={container}>
        <button style={backBtn} onClick={() => navigate(`/sport/${sportName}`)}>
          ← Back
        </button>

        <h1 style={title}>Available {formatSport(sportName)} Games</h1>
        <p style={subtitle}>Pick a lobby below to join.</p>

        <section style={toolbar} aria-label="Game controls">
          <div style={search} role="search">
            <input
              style={searchInput}
              type="search"
              placeholder="Search games (e.g., Game 3, casual, Community Gym)"
              value={q}
              onChange={e => setQ(e.target.value)}
              aria-label="Search games"
            />
          </div>
          <button style={ghostBtn} onClick={shuffle} title="Shuffle list" aria-label="Shuffle games">
            Shuffle
          </button>
        </section>

        {filtered.length === 0 ? (
          <p style={empty}>No games match your search. Try another keyword.</p>
        ) : (
          <section style={grid} aria-live="polite">
            {filtered.map(g => {
              const full = g.players >= g.maxPlayers;
              const joined = hasJoined(g.id);
              const pulsing =
                justJoinedId === g.id
                  ? { outline: `2px solid ${brand.green}`, outlineOffset: 2 }
                  : {};
              return (
                <article key={g.id} style={{ ...card, ...pulsing }} aria-label={g.name}>
                  <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.2, color: "#111827" }}>
                    {g.name}
                  </h3>
                  <div style={meta}>
                    <span style={chip} title="Mode">{g.mode}</span>
                    <span style={chip} title="Capacity">{g.players}/{g.maxPlayers}</span>
                    <span style={chip} title="When">{g.when}</span>
                    <span style={chip} title="Location">{g.location}</span>
                    <span style={chip} title="Tags">{g.tags.join(" • ")}</span>
                  </div>
                  <div style={actions}>
                    <button
                      style={primaryBtn(full || joined)}
                      disabled={full || joined}
                      onClick={() => joinGame(g.id)}
                      aria-disabled={full || joined}
                    >
                      {joined ? "Joined" : full ? "Full" : "Join game"}
                    </button>
                    <button
                      style={secondaryBtn}
                      onClick={() => details(g)}
                      aria-label={`View details for ${g.name}`}
                    >
                      Details
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* Pretty modal */}
      {openModalGame && (
        <GameModal
          game={openModalGame}
          onClose={() => setOpenModalGame(null)}
          onJoin={() => {
            joinGame(openModalGame.id);
            // Keep modal open so they can read; or close on join if you prefer:
            // setOpenModalGame(null);
          }}
          hasJoined={hasJoined(openModalGame.id)}
          isFull={openModalGame.players >= openModalGame.maxPlayers}
          brand={brand}
        />
      )}
    </div>
  );
}

/* ========================= Modal Component ========================= */
function GameModal({ game, onClose, onJoin, hasJoined, isFull, brand }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Simple focus management: focus dialog when opened
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 1000,
  };
  const card = {
    width: "min(560px, 96vw)",
    background: "#fff",
    borderRadius: 18,
    border: `1px solid ${brand.border}`,
    boxShadow: "0 24px 64px rgba(0,0,0,.25)",
    outline: "none",
  };
  const header = {
    padding: "18px 20px 10px",
    borderBottom: `1px solid ${brand.border}`,
  };
  const title = {
    margin: 0,
    fontSize: 20,
    color: "#111827",
    lineHeight: 1.2,
  };
  const body = {
    padding: 20,
    display: "grid",
    gap: 12,
  };
  const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" };
  const chip = {
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${brand.chipBr}`,
    background: brand.chipBg,
    fontSize: 12,
    color: brand.muted,
  };
  const note = { color: brand.muted, lineHeight: 1.5, fontSize: 14 };
  const footer = {
    padding: 16,
    borderTop: `1px solid ${brand.border}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  };
  const primaryBtn = (disabled = false) => ({
    appearance: "none",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    background: disabled ? "#e5e7eb" : `linear-gradient(90deg, ${brand.green}, ${brand.green2})`,
    color: disabled ? "#9ca3af" : "#fff",
    boxShadow: disabled ? "none" : `0 6px 16px ${brand.ring}`,
  });
  const ghostBtn = {
    appearance: "none",
    border: `1px solid ${brand.border}`,
    background: "#fff",
    color: brand.dark,
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
  };

  return (
    <div
      ref={overlayRef}
      style={overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${game.name}`}
      onMouseDown={e => {
        // close if clicking the overlay (not inside the dialog)
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={dialogRef}
        style={card}
        tabIndex={-1}
      >
        <div style={header}>
          <h3 style={title}>{game.name}</h3>
        </div>
        <div style={body}>
          <div style={row}>
            <span style={chip}>Mode: {game.mode}</span>
            <span style={chip}>Players: {game.players}/{game.maxPlayers}</span>
            <span style={chip}>When: {game.when}</span>
            <span style={chip}>Location: {game.location}</span>
          </div>
          <div style={row}>
            <span style={chip}>Tags: {game.tags.join(" • ")}</span>
          </div>
          <p style={note}>{game.notes}</p>
        </div>
        <div style={footer}>
          <button style={ghostBtn} onClick={onClose}>Close</button>
          <button
            style={primaryBtn(isFull || hasJoined)}
            disabled={isFull || hasJoined}
            onClick={onJoin}
            aria-disabled={isFull || hasJoined}
          >
            {hasJoined ? "Joined" : isFull ? "Full" : "Join game"}
          </button>
        </div>
      </div>
    </div>
  );
}
