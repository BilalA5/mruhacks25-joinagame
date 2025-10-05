// src/hostGame.jsx  (case-sensitive: import with the same name you're saving)
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ====== CONFIG ======
const GOOGLE_MAPS_API_KEY = "AIzaSyAeBjfq_87fNza9OCRJ5ehKxYlBLJDkphY";
const LS_HOSTED_KEY = "hostedGames_v1";

// ====== LOADERS ======
function useGoogleMaps(apiKey) {
  const [ready, setReady] = useState(!!window.google?.maps);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.google?.maps) {
      setReady(true);
      return;
    }
    const id = "gmaps-script";
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => setReady(true);
    s.onerror = () =>
      setError("Google Maps script failed to load. Check API key/referrers/billing.");
    document.head.appendChild(s);

    // safety timeout to flip to fallback if Google never calls onload
    const t = setTimeout(() => {
      if (!window.google?.maps) {
        setError("Google Maps did not initialize (likely key/referrer/billing).");
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [apiKey]);

  return { ready, error };
}

function useLeaflet() {
  const [ready, setReady] = useState(!!window.L);
  useEffect(() => {
    if (window.L) {
      setReady(true);
      return;
    }
    const cssId = "leaflet-css";
    const jsId = "leaflet-js";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById(jsId)) {
      const s = document.createElement("script");
      s.id = jsId;
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.async = true;
      s.defer = true;
      s.onload = () => setReady(true);
      document.body.appendChild(s);
    }
  }, []);
  return ready;
}

// ====== UTILS ======
function formatSport(s) {
  if (!s) return "Sport";
  return s.split("-").map(t => t[0]?.toUpperCase() + t.slice(1)).join(" ");
}
function uuid() {
  return (crypto?.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2);
}
const DEFAULT_CENTER = { lat: 51.0447, lng: -114.0719 }; // Calgary

// ====== PAGE ======
export default function HostGame() {
  const { sportName } = useParams();
  const navigate = useNavigate();

  const { ready: gReady, error: gError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);
  const lReady = useLeaflet(); // fallback

  const brand = {
    green: "#16a34a",
    green2: "#22c55e",
    dark: "#14532d",
    muted: "#6b7280",
    border: "rgba(0,0,0,0.08)",
    ring: "rgba(34, 197, 94, 0.35)",
  };

  // ---- Form state ----
  const [name, setName] = useState(`${formatSport(sportName)} — Game`);
  const [mode, setMode] = useState("Lobby");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [when, setWhen] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 45);
    return now.toISOString().slice(0, 16);
  });
  const [tags, setTags] = useState(`${formatSport(sportName).toLowerCase()}, casual, game`);
  const [notes, setNotes] = useState("Bring your own gear. All levels welcome.");
  const [locationText, setLocationText] = useState("");
  const [coords, setCoords] = useState(null); // {lat, lng}

  // ---- Map refs ----
  const mapRef = useRef(null);

  // ---- GOOGLE MAPS INIT ----
  useEffect(() => {
    if (!gReady || gError) return;
    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
      mapId: "hostGameMap",
      clickableIcons: true,
    });
    const marker = new google.maps.Marker({
      map,
      position: DEFAULT_CENTER,
      draggable: true,
    });
    const geocoder = new google.maps.Geocoder();

    function reverseGeocode(pos) {
      geocoder.geocode({ location: pos }, (results, status) => {
        if (status === "OK" && results?.[0]) setLocationText(results[0].formatted_address);
      });
    }

    // set defaults
    setCoords(DEFAULT_CENTER);
    reverseGeocode(DEFAULT_CENTER);

    map.addListener("click", (e) => {
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      marker.setPosition(pos);
      setCoords(pos);
      reverseGeocode(pos);
    });
    marker.addListener("dragend", () => {
      const p = marker.getPosition();
      const pos = { lat: p.lat(), lng: p.lng() };
      setCoords(pos);
      reverseGeocode(pos);
    });

    // Places Autocomplete
    const input = document.getElementById("place-input");
    if (input) {
      const ac = new google.maps.places.Autocomplete(input, {
        fields: ["geometry", "formatted_address", "name"],
        types: ["establishment", "geocode"],
      });
      ac.bindTo("bounds", map);
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place.geometry) return;
        const loc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        map.panTo(loc);
        map.setZoom(15);
        marker.setPosition(loc);
        setCoords(loc);
        setLocationText(place.formatted_address || place.name || "");
      });
    }
  }, [gReady, gError]);

  // ---- LEAFLET (OSM) FALLBACK ----
  useEffect(() => {
    if (gReady || !lReady || !mapRef.current) return; // only if Google not ready/failed
    const L = window.L;
    const map = L.map(mapRef.current).setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const marker = L.marker([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], { draggable: true }).addTo(map);
    setCoords(DEFAULT_CENTER);
    nominatimReverse(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng).then(addr => addr && setLocationText(addr));

    map.on("click", (e) => {
      const pos = { lat: e.latlng.lat, lng: e.latlng.lng };
      marker.setLatLng([pos.lat, pos.lng]);
      setCoords(pos);
      nominatimReverse(pos.lat, pos.lng).then(addr => addr && setLocationText(addr));
    });

    marker.on("dragend", () => {
      const ll = marker.getLatLng();
      const pos = { lat: ll.lat, lng: ll.lng };
      setCoords(pos);
      nominatimReverse(pos.lat, pos.lng).then(addr => addr && setLocationText(addr));
    });

    // Bind a simple search if user presses Enter in the input while on Leaflet
    const input = document.getElementById("place-input");
    if (input) {
      input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (!input.value.trim()) return;
          const result = await nominatimSearch(input.value.trim());
          if (result) {
            map.setView([result.lat, result.lng], 15);
            marker.setLatLng([result.lat, result.lng]);
            setCoords({ lat: result.lat, lng: result.lng });
            setLocationText(result.display_name);
          }
        }
      });
    }
  }, [gReady, lReady]);

  // Nominatim helpers
  async function nominatimReverse(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        { headers: { "Accept": "application/json" } }
      );
      const j = await res.json();
      return j.display_name;
    } catch { return null; }
  }
  async function nominatimSearch(q) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
        { headers: { "Accept": "application/json" } }
      );
      const j = await res.json();
      if (!j?.length) return null;
      return { lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon), display_name: j[0].display_name };
    } catch { return null; }
  }

  function geoLocate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (res) => {
      const loc = { lat: res.coords.latitude, lng: res.coords.longitude };
      setCoords(loc);
      // Try to center on whichever map is active
      if (window.google?.maps && gReady && !gError) {
        const map = new window.google.maps.Map(mapRef.current); // temp ref not ideal; we’ll pan via DOM query:
      }
      // In both modes, just set the text via reverse lookup:
      if (window.google?.maps && gReady && !gError) {
        // Google geocode
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: loc }, (results, status) => {
          if (status === "OK" && results?.[0]) setLocationText(results[0].formatted_address);
        });
      } else {
        const addr = await nominatimReverse(loc.lat, loc.lng);
        if (addr) setLocationText(addr);
      }

      // Move marker visually
      if (window.google?.maps && gReady && !gError) {
        // Recreate a marker at new pos (simple way without keeping refs)
        const map = new window.google.maps.Map(mapRef.current, { center: loc, zoom: 15 });
        new window.google.maps.Marker({ map, position: loc, draggable: false });
      } else if (window.L) {
        const map = window.L.map(mapRef.current);
        map.setView([loc.lat, loc.lng], 15);
        window.L.marker([loc.lat, loc.lng]).addTo(map);
      }
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!coords || !locationText) {
      alert("Please choose a location on the map (or type/search it) first.");
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
      lat: coords.lat,
      lng: coords.lng,
      notes,
      sport: sportName,
      createdAt: Date.now(),
    };
    try {
      const raw = localStorage.getItem(LS_HOSTED_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(game);
      localStorage.setItem(LS_HOSTED_KEY, JSON.stringify(arr));
    } catch {}

    navigate(`/join/${sportName}`);
  }

  // ---- Styles (split layout) ----
  const page = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)",
    display: "grid",
    placeItems: "center",
    fontFamily: "Poppins, Arial, sans-serif",
    padding: 16,
  };
  const shell = {
    width: "min(1100px, 100%)",
    background: "#fff",
    borderRadius: 20,
    border: `1px solid ${brand.border}`,
    boxShadow: "0 14px 40px rgba(0,0,0,.10)",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1.1fr 1.3fr",
    gap: 0,
  };
  const left = { padding: 22, display: "grid", alignContent: "start", gap: 14 };
  const right = { position: "relative", minHeight: 520, background: "#eef7f0" };
  const h1 = { margin: 0, fontSize: 26, color: brand.dark };
  const hint = { marginTop: -6, color: brand.muted, fontSize: 14 };
  const label = { fontWeight: 600, fontSize: 13, color: "#111827" };
  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    background: "#f9fafb",
    fontSize: 14,
  };
  const row = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
  const btnPrimary = {
    appearance: "none",
    border: "none",
    cursor: "pointer",
    padding: "12px 14px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    background: `linear-gradient(90deg, ${brand.green}, ${brand.green2})`,
    color: "#fff",
    boxShadow: `0 6px 16px ${brand.ring}`,
  };
  const btnGhost = {
    appearance: "none",
    border: `1px solid ${brand.border}`,
    background: "#fff",
    color: brand.dark,
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
  };
  const mapSearchWrap = {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    display: "flex",
    gap: 8,
    zIndex: 2,
  };
  const mapSearchInput = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    background: "#ffffff",
    fontSize: 14,
  };
  const geoBtn = {
    appearance: "none",
    border: "none",
    borderRadius: 12,
    padding: "10px 12px",
    background: `linear-gradient(90deg, ${brand.green}, ${brand.green2})`,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: `0 4px 12px ${brand.ring}`,
  };
  const mapCanvas = { position: "absolute", inset: 0 };
  const helper = {
    position: "absolute",
    top: 56,
    right: 12,
    zIndex: 2,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 12,
    color: brand.muted,
    boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
  };

  const showLeaflet = !!gError; // if Google failed, show helper

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
            <input id="place-input" style={mapSearchInput} placeholder={gError ? "Search (Leaflet/OSM)… press Enter" : "Search a place (gym, park, arena…)"}/>
            <button type="button" style={geoBtn} onClick={geoLocate}>Use My Location</button>
          </div>

          {showLeaflet && (
            <div style={helper}>
              Google Maps couldn’t load with this API key. Using a Leaflet map fallback — click to drop a pin, drag to adjust, or type an address and press Enter.
            </div>
          )}

          <div ref={mapRef} style={mapCanvas}>
            {!gReady && !gError && (
              <div style={{ display: "grid", placeItems: "center", height: "100%", color: brand.muted }}>
                Loading Google Maps…
              </div>
            )}
            {gError && !lReady && (
              <div style={{ display: "grid", placeItems: "center", height: "100%", color: brand.muted }}>
                Loading fallback map…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
