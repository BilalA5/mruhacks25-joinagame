// src/JoinGames.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function JoinGames() {
  const { sportName } = useParams();
  const navigate = useNavigate();

  // ---- brand palette (matches your existing UI) ----
  const brand = {
    green: "#16a34a",
    green2: "#22c55e",
    dark: "#14532d",
    muted: "#6b7280",
    border: "rgba(0,0,0,0.08)",
    chipBg: "rgba(34,197,94,0.08)",
    chipBr: "rgba(34,197,94,0.25)",
    ring: "rgba(34,197,94,0.35)",
  };

  // ---- localStorage keys ----
  const LS_PLAYERS_KEY = "joinedGames_players_v1";   // { [id]: players }
  const LS_JOINED_IDS_KEY = "joinedGames_myJoins_v1"; // string[]
  const LS_HOSTED_KEY = "hostedGames_v1";            // your HostGame list

  // ---- seed (fallback) ----
  const seedGames = useMemo(
    () => [
      {
        id: "g-1",
        name: "Morning Pickup",
        sport: sportName,
        mode: "Casual",
        players: 3,
        maxPlayers: 6,
        location: "MRU Gym",
        time: "Today 9:30 AM",
        tags: ["friendly", "beginner"],
        notes: "All levels welcome. Bring water.",
      },
      {
        id: "g-2",
        name: "After-Work Run",
        sport: sportName,
        mode: "Competitive",
        players: 5,
        maxPlayers: 8,
        location: "YMCA",
        time: "Today 6:00 PM",
        tags: ["intermediate"],
        notes: "We start on time.",
      },
      {
        id: "g-3",
        name: "Weekend Mix",
        sport: sportName,
        mode: "Casual",
        players: 2,
        maxPlayers: 10,
        location: "Community Centre",
        time: "Sat 2:00 PM",
        tags: ["open", "drop-in"],
        notes: "Family friendly.",
      },
    ],
    [sportName]
  );

  // ---- state ----
  const [games, setGames] = useState(seedGames);
  const [myJoinedIds, setMyJoinedIds] = useState([]);
  const [q, setQ] = useState("");
  const [justJoinedId, setJustJoinedId] = useState(null);
  const [openModalGame, setOpenModalGame] = useState(null);

  // merge in hosted games for this sport (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_HOSTED_KEY);
      const hosted = raw ? JSON.parse(raw) : [];
      const hostedForSport = hosted.filter((g) => g.sport === sportName);
      setGames((prev) => {
        const ids = new Set(prev.map((x) => x.id));
        // hosted first so newest hosted appear on top
        return [...hostedForSport.filter((x) => !ids.has(x.id)), ...prev];
      });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportName]);

  // restore joined player counts + my joined ids
  useEffect(() => {
    try {
      const playersRaw = localStorage.getItem(LS_PLAYERS_KEY);
      const joinedRaw = localStorage.getItem(LS_JOINED_IDS_KEY);
      const savedPlayers = playersRaw ? JSON.parse(playersRaw) : {};
      const savedJoined = joinedRaw ? JSON.parse(joinedRaw) : [];

      setGames((g) =>
        g.map((x) =>
          typeof savedPlayers[x.id] === "number"
            ? { ...x, players: savedPlayers[x.id] }
            : x
        )
      );
      setMyJoinedIds(savedJoined);
    } catch {}
  }, []);

  // persist players + myJoinedIds whenever they change
  useEffect(() => {
    const playersObj = {};
    games.forEach((g) => (playersObj[g.id] = g.players));
    localStorage.setItem(LS_PLAYERS_KEY, JSON.stringify(playersObj));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(LS_JOINED_IDS_KEY, JSON.stringify(myJoinedIds));
  }, [myJoinedIds]);

  // ---- helpers ----
  const formatSport = (s) =>
    (s || "Sport")
      .split("-")
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(" ");

  const hasJoined = (id) => myJoinedIds.includes(id);

  // join a game
  function joinGame(id) {
    if (hasJoined(id)) {
      setJustJoinedId(id);
      setTimeout(() => setJustJoinedId(null), 700);
      return;
    }
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        if (g.players >= g.maxPlayers) return g;
        return { ...g, players: g.players + 1 };
      })
    );
    setMyJoinedIds((prev) => [...prev, id]);
    setJustJoinedId(id);
    setTimeout(() => setJustJoinedId(null), 800);
  }

  // *** NEW: leave/unjoin a game ***
  function leaveGame(id) {
    if (!hasJoined(id)) return;
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        return { ...g, players: Math.max(0, g.players - 1) };
      })
    );
    setMyJoinedIds((prev) => prev.filter((x) => x !== id));
  }

  function shuffle() {
    setGames((prev) => [...prev].sort(() => Math.random() - 0.5));
  }

  // search filter
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return games;
    return games.filter(
      (g) =>
        g.name.toLowerCase().includes(t) ||
        g.mode.toLowerCase().includes(t) ||
        g.location.toLowerCase().includes(t) ||
        g.tags.some((tag) => tag.toLowerCase().includes(t))
    );
  }, [q, games]);

  // ---- styles ----
  // NOTE: height + overflowY here makes the JOIN PAGE ITSELF scrollable
  const page = {
    height: "100vh",
    width: "100vw",
    overflowY: "auto",
    background: "linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)",
    display: "grid",
    placeItems: "start center",
    fontFamily: "Poppins, Arial, sans-serif",
    padding: 24,
  };
  const container = { width: "min(1100px, 96vw)" };
  const title = {
    color: brand.green,
    fontSize: "2.2rem",
    fontWeight: 800,
    letterSpacing: "-0.3px",
    margin: "6px 0 6px",
  };
  const subtitle = { color: brand.muted, margin: 0 };
  const toolbar = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    margin: "18px 0 10px",
    flexWrap: "wrap",
  };
  const search = { flex: "1 1 320px" };
  const searchInput = {
    width: "100%",
    appearance: "none",
    borderRadius: 12,
    border: `1px solid ${brand.border}`,
    padding: "12px 14px",
    outline: "2px solid transparent",
    outlineOffset: 2,
    fontSize: 14,
    boxShadow: "0 6px 22px rgba(0,0,0,0.06)",
  };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 14,
    paddingBottom: 40,
  };
  const card = {
    border: `1px solid ${brand.border}`,
    borderRadius: 16,
    background: "#fff",
    padding: 14,
    display: "grid",
    gap: 8,
    boxShadow:
      "0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)",
  };
  const meta = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    color: brand.muted,
    fontSize: 13,
  };
  const chip = {
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${brand.chipBr}`,
    background: brand.chipBg,
    fontSize: 12,
    color: brand.muted,
  };
  const capacity = { fontWeight: 700, color: brand.dark };
  const actions = { display: "flex", gap: 8, marginTop: 4 };
  const primaryBtn = (disabled = false) => ({
    appearance: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    background: disabled ? "#f3f4f6" : brand.green,
    color: disabled ? "#9ca3af" : "#fff",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: disabled ? "none" : "0 6px 16px rgba(34,197,94,0.35)",
  });
  const secondaryBtn = {
    appearance: "none",
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    background: "#fff",
    color: brand.dark,
    border: `1px solid ${brand.border}`,
  };
  const leaveBtn = {
    appearance: "none",
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    background: "#fff",
    color: "#dc2626",
    border: "1px solid rgba(220,38,38,0.35)",
  };
  const backBtn = {
    marginBottom: 14,
    border: `1px solid ${brand.border}`,
    background: "#fff",
    color: brand.dark,
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    boxShadow:
      "0 10px 30px rgba(22,163,74,0.1), 0 4px 12px rgba(0,0,0,0.05)",
  };
  const empty = {
    textAlign: "center",
    padding: "40px 12px",
    color: brand.muted,
    border: `1px dashed ${brand.border}`,
    borderRadius: 14,
    background: "rgba(34,197,94,0.06)",
    marginTop: 12,
  };

  return (
    <div style={page}>
      <div style={container}>
        <button
          style={backBtn}
          onClick={() => navigate(`/sport/${sportName}`)}
        >
          ← Back
        </button>

        <h1 style={title}>Available {formatSport(sportName)} Games</h1>
        <p style={subtitle}>Pick a lobby below to join.</p>

        <section style={toolbar} aria-label="Game controls">
          <div style={search} role="search">
            <input
              style={searchInput}
              type="search"
              placeholder="Search by name, mode, location, or tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search games"
            />
          </div>
          <button
            style={secondaryBtn}
            onClick={shuffle}
            title="Shuffle list"
            aria-label="Shuffle games"
          >
            Shuffle
          </button>
        </section>

        {filtered.length === 0 ? (
          <p style={empty}>
            No games match your search. Try another keyword.
          </p>
        ) : (
          <section style={grid} aria-live="polite">
            {filtered.map((g) => {
              const full = g.players >= g.maxPlayers;
              const joined = hasJoined(g.id);
              const pulsing =
                justJoinedId === g.id
                  ? {
                      outline: `2px solid ${brand.green}`,
                      outlineOffset: 2,
                    }
                  : {};
              return (
                <article key={g.id} style={{ ...card, ...pulsing }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      lineHeight: 1.2,
                      color: "#111827",
                    }}
                  >
                    {g.name}
                  </h3>

                  <div style={meta}>
                    <span style={chip}>Mode: {g.mode}</span>
                    <span style={chip}>{g.location}</span>
                    <span style={chip}>{g.time}</span>
                  </div>

                  <div style={meta}>
                    <span style={capacity}>
                      {g.players}/{g.maxPlayers}
                    </span>
                    <span style={{ color: brand.muted }}>&nbsp;players</span>
                  </div>

                  <div style={meta}>
                    {g.tags.map((t) => (
                      <span key={t} style={chip}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={actions}>
                    {joined ? (
                      <button
                        style={leaveBtn}
                        onClick={() => leaveGame(g.id)}
                        aria-label={`Leave ${g.name}`}
                      >
                        Leave game
                      </button>
                    ) : (
                      <button
                        style={primaryBtn(full)}
                        disabled={full}
                        onClick={() => joinGame(g.id)}
                        aria-disabled={full}
                      >
                        {full ? "Full" : "Join game"}
                      </button>
                    )}

                    <button
                      style={secondaryBtn}
                      onClick={() => setOpenModalGame(g)}
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

      {openModalGame && (
        <GameModal
          game={openModalGame}
          onClose={() => setOpenModalGame(null)}
          onJoin={() => joinGame(openModalGame.id)}
          onLeave={() => leaveGame(openModalGame.id)} // NEW
          hasJoined={hasJoined(openModalGame.id)}
          isFull={openModalGame.players >= openModalGame.maxPlayers}
          brand={brand}
        />
      )}
    </div>
  );
}

// ---------------- Modal ----------------
function GameModal({ game, onClose, onJoin, onLeave, hasJoined, isFull, brand }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
    borderRadius: 16,
    border: `1px solid ${brand.border}`,
    outline: "none",
    boxShadow: "0 24px 64px rgba(0,0,0,.25)",
  };
  const header = {
    padding: "18px 20px 10px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  };
  const title = { margin: 0, fontSize: 20, color: "#111827", lineHeight: 1.2 };
  const body = { padding: 20, display: "grid", gap: 12 };
  const row = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  };
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
    borderTop: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  };
  const primaryBtn = (disabled = false) => ({
    appearance: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    background: disabled ? "#f3f4f6" : brand.green,
    color: disabled ? "#9ca3af" : "#fff",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: disabled ? "none" : "0 6px 16px rgba(34,197,94,0.35)",
  });
  const ghostBtn = {
    appearance: "none",
    border: "1px solid rgba(0,0,0,0.08)",
    background: "#fff",
    color: brand.dark,
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
  };
  const leaveBtn = {
    appearance: "none",
    border: "1px solid rgba(220,38,38,0.35)",
    background: "#fff",
    color: "#dc2626",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  };

  return (
    <div
      ref={overlayRef}
      style={overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${game.name}`}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div ref={dialogRef} style={card} tabIndex={-1}>
        <div style={header}>
          <h3 style={title}>{game.name}</h3>
        </div>

        <div style={body}>
          <div style={row}>
            <span style={chip}>Mode: {game.mode}</span>
            <span style={chip}>{game.location}</span>
            <span style={chip}>{game.time}</span>
          </div>
          <div style={row}>
            <span style={chip}>
              Capacity: {game.players}/{game.maxPlayers}
            </span>
          </div>
          <div style={row}>
            <span style={chip}>Tags: {game.tags.join(" • ")}</span>
          </div>
          <p style={note}>{game.notes}</p>
        </div>

        <div style={footer}>
          <button style={ghostBtn} onClick={onClose}>
            Close
          </button>

          {hasJoined ? (
            <button style={leaveBtn} onClick={onLeave}>
              Leave game
            </button>
          ) : (
            <button
              style={primaryBtn(isFull)}
              disabled={isFull}
              onClick={onJoin}
              aria-disabled={isFull}
            >
              {isFull ? "Full" : "Join game"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
