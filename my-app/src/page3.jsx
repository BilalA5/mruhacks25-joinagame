<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Available games</title>
<style>
:root {
--bg: #0a0a0a; /* near‑black */
--bg-glow-1: rgba(229, 9, 20, 0.15); /* red glow */
--bg-glow-2: rgba(255, 71, 87, 0.12); /* softer red/pink glow */
--card: #111214; /* card surface */
--muted: #b8b8b8; /* secondary text */
--text: #f5f5f5; /* primary text */
--accent: #e50914; /* primary red */
--accent-2: #ff4141; /* gradient red */
--ring: rgba(229, 9, 20, 0.45);
--ok: #2ecc71; /* keep semantic test colors */
--warn: #f39c12;
--fail: #e74c3c;
--border: rgba(255,255,255,0.08);
--chip-bg: rgba(229, 9, 20, 0.08);
--chip-br: rgba(229, 9, 20, 0.25);
}
* { box-sizing: border-box; }
html, body { height: 100%; }
body {
margin: 0;
font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji";
background: radial-gradient(1200px 600px at 70% -10%, var(--bg-glow-1), transparent 60%),
radial-gradient(900px 500px at 0% 100%, var(--bg-glow-2), transparent 60%),
var(--bg);
color: var(--text);
display: grid;
place-items: center;
padding: 24px;
}
.container { width: min(980px, 100%); }
.title {
font-size: clamp(28px, 4vw, 44px);
margin: 0 0 8px;
letter-spacing: .5px;
line-height: 1.15;
background: linear-gradient(90deg, var(--text), #ffd6d6);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
}
.subtitle { color: var(--muted); margin: 0 0 20px; }


.grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
gap: 16px;
}
.card {
background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
border: 1px solid var(--border);
border-radius: 16px;
padding: 16px;
backdrop-filter: blur(6px);
box-shadow: 0 10px 30px rgba(0,0,0,.35);
display: flex; flex-direction: column; gap: 12px;
}
.card h3 { margin: 0; font-size: 18px; line-height: 1.2; }
.meta { color: var(--muted); font-size: 13px; display: flex; gap: 10px; align-items: center; }
}