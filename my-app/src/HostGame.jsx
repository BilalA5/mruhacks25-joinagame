// src/hostGame.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LS_HOSTED_KEY = "hostedGames_v1";
const DEFAULT_CENTER = { lat: 51.0447, lng: -114.0719 }; // Calgary

// Load Leaflet (CSS + JS) once
function useLeaflet() {
  const [ready, setReady] = useState(!!window.L);
  useEffect(() => {
    if (window.L) { setReady(true); return; }

    const cssId = "leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const jsId = "leaflet-js";
    if (!document.getElementById(jsId)) {
      const s = document.createElement("script");
      s.id = jsId;
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.async = true;
      s.defer = true;
      s.onload = () => setReady(true);
      document.body.appendChild(s);
    } else {
      setReady(true);
    }
  }, []);
  return ready;
}

function formatSport(s) {
  if (!s) return "Sport";
  return s.split("-").map(t => t[0]?.toUpperCase() + t.slice(1)).join(" ");
}
function uuid() {
  return (crypto?.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2);
}

export default function HostGame() {
  const { sportName } = useParams();
  const navigate = useNavigate();
  const leafletReady = useLeaflet();

  const brand = {
    green: "#16a34a", green2: "#22c55e", dark: "#14532d",
    muted: "#6b7280", border: "rgba(0,0,0,0.08)", ring: "rgba(34,197,94,0.35)",
  };

  // Form state
  const [name, setName] = useState(`${formatSport(sportName)} — Game`);
  const [mode, setMode] = useState("Lobby");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [when, setWhen] = useState(() => {
    const now = new Date(); now.setMinutes(now.getMinutes() + 45);
    return now.toISOString().slice(0,16);
  });
  const [tags, setTags] = useState(`${formatSport(sportName).toLowerCase()}, casual, game`);
  const [notes, setNotes] = useState("Bring your own gear. All levels welcome.");
  const [locationText, setLocationText] = useState("");
  const [coords, setCoords] = useState(null); // {lat, lng}

  // Map refs
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Reverse geocode via Nominatim
  async function reverseGeocode(lat, lon) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
        headers: { "Accept": "application/json" },
      });
      const j = await res.json();
      return j.display_name;
    } catch { return null; }
  }
  // Forward search
  async function searchAddress(q) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
        headers: { "Accept": "application/json" },
      });
      const j = await res.json();
      if (!j?.length) return null;
      return { lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon), label: j[0].display_name };
    } catch { return null; }
  }

  // Init Leaflet
  useEffect(() => {
    if (!leafletReady || !mapElRef.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(mapElRef.current).setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], { draggable: true }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;
    setCoords(DEFAULT_CENTER);

    // Prefill address for default center
    reverseGeocode(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng).then(addr => setLocationText(addr || `${DEFAULT_CENTER.lat.toFixed(6)}, ${DEFAULT_CENTER.lng.toFixed(6)}`));

    // Click to place
    map.on("click", async (e) => {
      const pos = { lat: e.latlng.lat, lng: e.latlng.lng };
      marker.setLatLng([pos.lat, pos.lng]);
      setCoords(pos);
      const addr = await reverseGeocode(pos.lat, pos.lng);
      setLocationText(addr || `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
    });

    // Drag to move
    marker.on("dragend", async () => {
      const ll = marker.getLatLng();
      const pos = { lat: ll.lat, lng: ll.lng };
      setCoords(pos);
      const addr = await reverseGeocode(pos.lat, pos.lng);
      setLocationText(addr || `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
    });

    // Search on Enter
    const input = searchInputRef.current;
    const onKey = async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        const hit = await searchAddress(q);
        if (!hit) return;
        map.setView([hit.lat, hit.lng], 15);
        marker.setLatLng([hit.lat, hit.lng]);
        setCoords({ lat: hit.lat, lng: hit.lng });
        setLocationText(hit.label || `${hit.lat.toFixed(6)}, ${hit.lng.toFixed(6)}`);
      }
    };
    input.addEventListener("keydown", onKey);
    // Resize handling so tiles always paint
    setTimeout(() => map.invalidateSize(), 50);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);

    return () => {
      input.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [leafletReady]);

  // Geolocate
  const geoLocate = () => {
    if (!navigator.geolocation || !mapRef.current || !markerRef.current) return;
    navigator.geolocation.getCurrentPosition(async (res) => {
      const pos = { lat: res.coords.latitude, lng: res.coords.longitude };
      mapRef.current.setView([pos.lat, pos.lng], 15);
      markerRef.current.setLatLng([pos.lat, pos.lng]);
      setCoords(pos);
      const addr = await reverseGeocode(pos.lat, pos.lng);
      setLocationText(addr || `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!coords || !locationText) {
      alert("Pick a spot on the map or search an address first.");
      return;
    }
    const cleanTags = tags.split(",").map(t => t.trim()).filter(Boolean);
    const game = {
      id: uuid(),
      name: name || `${formatSport(sportName)} — Game`,
      mode: mode || "Lobby",
      tags: cleanTags,
      players: 0,
      maxPlayers: Number(maxPlayers) || 4,
      when: new Date(when).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: locationText,
      lat: coords.lat, lng: coords.lng,
      notes, sport: sportName, createdAt: Date.now(),
    };
    try {
      const raw = localStorage.getItem(LS_HOSTED_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(game);
      localStorage.setItem(LS_HOSTED_KEY, JSON.stringify(arr));
    } catch {}
    navigate(`/join/${sportName}`);
  };

  // Styles
  const page = { minHeight: "100vh", width: "100vw", background: "linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)", display: "grid", placeItems: "center", fontFamily: "Poppins, Arial, sans-serif", padding: 16 };
  const shell = { width: "min(1100px, 100%)", background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 14px 40px rgba(0,0,0,.10)", overflow: "hidden", display: "grid", gridTemplateColumns: "1.1fr 1.3fr" };
  const left = { padding: 22, display: "grid", alignContent: "start", gap: 14 };
  const right = { position: "relative", minHeight: 520, background: "#eef7f0" };
  const h1 = { margin: 0, fontSize: 26, color: brand.dark };
  const hint = { marginTop: -6, color: brand.muted, fontSize: 14 };
  const label = { fontWeight: 600, fontSize: 13, color: "#111827" };
  const input = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", fontSize: 14 };
  const row = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
  const btnPrimary = { appearance: "none", border: "none", cursor: "pointer", padding: "12px 14px", borderRadius: 12, fontWeight: 700, fontSize: 14, background: `linear-gradient(90deg, ${brand.green}, ${brand.green2})`, color: "#fff", boxShadow: `0 6px 16px ${brand.ring}` };
  const btnGhost = { appearance: "none", border: `1px solid ${brand.border}`, background: "#fff", color: brand.dark, borderRadius: 12, padding: "10px 14px", cursor: "pointer" };
  const mapSearchWrap = { position: "absolute", top: 12, left: 12, right: 12, display: "flex", gap: 8, zIndex: 2 };
  const mapSearchInput = { flex: 1, padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", outline: "none", background: "#ffffff", fontSize: 14 };
  const geoBtn = { appearance: "none", border: "none", borderRadius: 12, padding: "10px 12px", background: `linear-gradient(90deg, ${brand.green}, ${brand.green2})`, color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 12px ${brand.ring}` };
  const mapCanvas = { position: "absolute", inset: 0, width: "100%", height: "100%" };

  return (
    <div style={page}>
      <div style={{ width: "min(1100px, 100%)", marginBottom: 12 }}>
        <button style={btnGhost} onClick={() => navigate(`/sport/${sportName}`)}>← Back</button>
      </div>

      <div style={shell}>
        {/* Left: FORM */}
        <form style={left} onSubmit={onSubmit}>
          <h1 style={h1}>Host a {formatSport(sportName)} Game</h1>
          <p style={hint}>Fill in the details and drop a pin on the map.</p>

          <div>
            <label style={label}>Game Name</label>
            <input style={input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Pick-Up @ Rec Centre" />
          </div>

          <div style={row}>
            <div>
              <label style={label}>Mode</label>
              <select style={input} value={mode} onChange={e => setMode(e.target.value)}>
                <option>Lobby</option>
                <option>Round Robin</option>
                <option>Tournament</option>
                <option>Pickup</option>
              </select>
            </div>
            <div>
              <label style={label}>Max Players</label>
              <input style={input} type="number" min={2} max={24} value={maxPlayers} onChange={e => setMaxPlayers(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Date & Time</label>
            <input style={input} type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} />
          </div>

          <div>
            <label style={label}>Tags (comma separated)</label>
            <input style={input} value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., casual, friendly, beginner" />
          </div>

          <div>
            <label style={label}>Notes</label>
            <textarea style={{ ...input, minHeight: 88, resize: "vertical" }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any specifics players should know…" />
          </div>

          <div>
            <label style={label}>Chosen Location</label>
            <input style={{ ...input, background: "#f3f4f6" }} value={locationText} readOnly />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="button" style={btnGhost} onClick={() => navigate(`/join/${sportName}`)}>Preview Join Page</button>
            <button type="submit" style={btnPrimary}>Create Game</button>
          </div>
        </form>

        {/* Right: MAP */}
        <div style={right}>
          <div style={mapSearchWrap}>
            <input ref={searchInputRef} style={mapSearchInput} placeholder="Search an address (press Enter)" />
            <button type="button" style={geoBtn} onClick={geoLocate}>Use My Location</button>
          </div>
          {!leafletReady && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: brand.muted }}>
              Loading map…
            </div>
          )}
          <div ref={mapElRef} style={mapCanvas} />
        </div>
      </div>
    </div>
  );
}
