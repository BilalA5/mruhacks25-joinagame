<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Available games</title>
  <style>
    :root {
      --bg: #ffffff;            /* white */
      --bg-glow-1: transparent; /* no glow on white theme */
      --bg-glow-2: transparent;
      --card: #ffffff;          /* card surface */
      --muted: #6b7280;         /* secondary text */
      --text: #111827;          /* primary text (near-black) */
      --accent: #16a34a;        /* green primary (emerald 600) */
      --accent-2: #22c55e;      /* green gradient (emerald 500) */
      --ring: rgba(34, 197, 94, 0.35);
      --ok: #16a34a;            /* test pass color uses green */
      --warn: #f59e0b;
      --fail: #dc2626;
      --border: rgba(0,0,0,0.08);
      --chip-bg: rgba(34, 197, 94, 0.08);
      --chip-br: rgba(34, 197, 94, 0.25);
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      background: var(--bg);
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
      color: var(--text);
    }
    .subtitle { color: var(--muted); margin: 0 0 20px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    .card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 6px 16px rgba(0,0,0,.06);
      display: flex; flex-direction: column; gap: 12px;
    }
    .card h3 { margin: 0; font-size: 18px; line-height: 1.2; color: var(--text); }
    .meta { color: var(--muted); font-size: 13px; display: flex; gap: 10px; align-items: center; }
    .chip {
      padding: 4px 8px; border-radius: 999px; border: 1px solid var(--chip-br);
      background: var(--chip-bg);
      font-size: 12px; color: var(--muted);
    }
    .actions { margin-top: auto; display: flex; gap: 8px; }
    button {
      appearance: none; border: none; cursor: pointer;
      padding: 10px 12px; border-radius: 10px; font-weight: 600; font-size: 14px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      color: white; box-shadow: 0 6px 16px var(--ring);
      transition: transform .08s ease, box-shadow .2s ease, filter .2s ease;
    }
    button:hover { transform: translateY(-1px); filter: brightness(1.05); }
    button:active { transform: translateY(0); filter: brightness(.98); }
    button[disabled] { opacity: .55; cursor: not-allowed; box-shadow: none; background: #e5e7eb; color: #9ca3af; }

    .ghost {
      background: transparent; color: var(--muted);
      border: 1px dashed rgba(16, 185, 129, 0.35);
      box-shadow: none;
    }

    .toolbar { display: flex; align-items: center; gap: 10px; margin: 22px 0 16px; }
    .search {
      flex: 1; display: flex; gap: 8px;
      background: #f3f4f6; border: 1px solid #e5e7eb;
      padding: 8px 10px; border-radius: 12px;
    }
    .search input { flex: 1; background: transparent; border: 0; outline: none; color: var(--text); font-size: 14px; }
    .empty {
      text-align: center; padding: 40px 12px; color: var(--muted);
      border: 1px dashed rgba(34, 197, 94, 0.25); border-radius: 14px; background: rgba(34, 197, 94, 0.06);
    }

    /* Simple test UI */
    details.tests { margin-top: 22px; background: #ffffff; border: 1px solid var(--border); border-radius: 12px; }
    details.tests summary { cursor: pointer; padding: 10px 12px; color: var(--muted); }
    .test-pass { color: var(--ok); }
    .test-warn { color: var(--warn); }
    .test-fail { color: var(--fail); }
    .test-log { padding: 0 12px 12px; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; color: #111827; }
  </style>
</head>
<body>
  <main class="container">
    <h1 class="title">Available games</h1>
    <p class="subtitle">Pick a lobby below to join.</p>

    <section class="toolbar" aria-label="Game controls">
      <div class="search" role="search">
        <input id="q" type="search" placeholder="Search games (e.g., Game 3, casual)" aria-label="Search games" />
      </div>
      <button class="ghost" id="shuffle" title="Shuffle list" aria-label="Shuffle games">Shuffle</button>
    </section>

    <section id="grid" class="grid" aria-live="polite"></section>

    <p id="empty" class="empty" hidden>No games match your search. Try another keyword.</p>

    <details class="tests" open>
      <summary>Built‑in Tests (click to toggle)</summary>
      <div id="test-log" class="test-log"></div>
    </details>
  </main>

  <script>
    // =============================
    //  Available Games — JS Logic
    //  (Well‑commented for clarity)
    // =============================

    // Whether to suppress alert() popups (used by tests)
    let suppressAlerts = false;

    // --- Data model ---------------------------------------------------------
    // We keep an in‑memory array of game lobbies. In a real app, this would
    // likely come from a backend API (WebSocket/HTTP) and be updated live.
    // Here we initialize exactly 6 lobbies as requested.
    let games = [
      { id: crypto.randomUUID(), name: "Game 1", mode: "Lobby", tags: ["game"], players: 0, maxPlayers: 4 },
      { id: crypto.randomUUID(), name: "Game 2", mode: "Lobby", tags: ["game"], players: 0, maxPlayers: 4 },
      { id: crypto.randomUUID(), name: "Game 3", mode: "Lobby", tags: ["game"], players: 0, maxPlayers: 4 },
      { id: crypto.randomUUID(), name: "Game 4", mode: "Lobby", tags: ["game"], players: 0, maxPlayers: 4 },
      { id: crypto.randomUUID(), name: "Game 5", mode: "Lobby", tags: ["game"], players: 0, maxPlayers: 4 },
      { id: crypto.randomUUID(), name: "Game 6", mode: "Lobby", tags: ["game"], players: 0, maxPlayers: 4 },
    ];

    // --- DOM references -----------------------------------------------------
    const grid = document.getElementById('grid');       // container for game cards
    const emptyState = document.getElementById('empty'); // empty results message
    const q = document.getElementById('q');              // search input
    const shuffleBtn = document.getElementById('shuffle');
    const testLog = document.getElementById('test-log'); // test output panel

    // Helper to show players/capacity e.g. "1/4"
    function capacityLabel(g) { return `${g.players}/${g.maxPlayers}`; }

    // --- Rendering ----------------------------------------------------------
    // Render a list of game objects into the grid as "cards" with buttons.
    function render(list) {
      grid.innerHTML = '';

      // If there's nothing to show, reveal the empty state and stop.
      if (!list.length) {
        emptyState.hidden = false;
        return;
      }
      emptyState.hidden = true;

      for (const g of list) {
        const full = g.players >= g.maxPlayers; // is lobby full?

        // Card root
        const card = document.createElement('article');
        card.className = 'card';
        card.setAttribute('aria-label', g.name);

        // Title
        const title = document.createElement('h3');
        title.textContent = g.name;

        // Meta chips
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.innerHTML = `
          <span class="chip" title="Mode">${g.mode}</span>
          <span class="chip" title="Capacity">${capacityLabel(g)}</span>
          <span class="chip" title="Tags">${g.tags.join(' • ')}</span>
        `;

        // Action buttons (Join / Details)
        const actions = document.createElement('div');
        actions.className = 'actions';

        const joinBtn = document.createElement('button');
        joinBtn.textContent = full ? 'Full' : 'Join game';
        joinBtn.disabled = full;                // disable if full
        joinBtn.setAttribute('aria-pressed', 'false');
        joinBtn.addEventListener('click', () => joinGame(g.id));

        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'ghost';
        detailsBtn.textContent = 'Details';
        detailsBtn.addEventListener('click', () => showDetails(g));

        actions.append(joinBtn, detailsBtn);
        card.append(title, meta, actions);
        grid.append(card);
      }
    }

    // --- UI helpers & handlers ---------------------------------------------
    // Build the details text for a game (joined with proper newlines).
    function formatDetails(g) {
      const lines = [
        `Game: ${g.name}`,
        `Mode: ${g.mode}`,
        `Players: ${capacityLabel(g)}`,
        `Tags: ${g.tags.join(', ')}`,
      ];
      return lines.join('\n'); // <-- FIX: use "\n" (newline) not a broken literal
    }

    // Show a simple details dialog for a given game object.
    function showDetails(g) {
      const text = formatDetails(g);
      if (!suppressAlerts) alert(text);
      return text; // convenient for tests
    }

    // Attempt to join a lobby by id. If lobby isn't full, increment players
    // and re-render. When lobby becomes full, the button text updates to "Full".
    function joinGame(id) {
      const game = games.find(x => x.id === id);
      if (!game) return; // guard: id not found

      if (game.players < game.maxPlayers) {
        game.players++;
        render(filter(q.value)); // re-render with current search filter

        if (game.players >= game.maxPlayers) {
          console.log(`${game.name} is now full.`);
        }
        if (!suppressAlerts) alert(`You joined: ${game.name}`);
      }
    }

    // Filter games by search text (matches name/mode/tags).
    function filter(text) {
      const t = (text || '').trim().toLowerCase();
      if (!t) return games; // no search → return all
      return games.filter(g =>
        g.name.toLowerCase().includes(t) ||
        g.mode.toLowerCase().includes(t) ||
        g.tags.some(tag => tag.toLowerCase().includes(t))
      );
    }

    // Live-search as the user types
    q.addEventListener('input', () => render(filter(q.value)));

    // Shuffle the order of games for a quick variety view
    shuffleBtn.addEventListener('click', () => {
      games = [...games].sort(() => Math.random() - 0.5);
      render(filter(q.value));
    });

    // Initial paint
    render(games);

    // -----------------------------------------------------------------------
    // Built-in smoke tests (for quick validation in the browser)
    // -----------------------------------------------------------------------
    function runTests() {
      suppressAlerts = true; // silence alert() during automated checks

      const log = (msg, status = 'pass') => {
        const line = document.createElement('div');
        const cls = status === 'pass' ? 'test-pass' : status === 'warn' ? 'test-warn' : 'test-fail';
        line.className = cls;
        line.textContent = (status === 'pass' ? '✔ ' : status === 'warn' ? '⚠ ' : '✘ ') + msg;
        testLog.appendChild(line);
      };

      // Snapshot original state so tests can mutate safely
      const snapshot = JSON.parse(JSON.stringify(games));

      try {
        // Test 1: Should render exactly 6 cards
        const cards = grid.querySelectorAll('.card');
        if (cards.length === 6) log('Renders exactly 6 game cards.');
        else log(`Expected 6 cards, found ${cards.length}.`, 'fail');

        // Test 2: Names are "Game 1".."Game 6" in order
        const expectedNames = Array.from({length: 6}, (_, i) => `Game ${i+1}`);
        const renderedNames = Array.from(cards).map(c => c.querySelector('h3')?.textContent.trim());
        const nameMatch = expectedNames.every((n, i) => renderedNames[i] === n);
        if (nameMatch) log('Game names are correct and in order.');
        else log(`Game names mismatch. Got: ${renderedNames.join(', ')}`, 'fail');

        // Test 3: Joining increments players and disables when full
        const targetId = games[0].id;            // pick first lobby
        const before = games[0].players;
        joinGame(targetId);                      // attempt a join → +1
        if (games[0].players === before + 1) log('Joining increments player count by 1.');
        else log('Joining did not increment player count.', 'fail');

        // Fill lobby to capacity and check button state
        while (games[0].players < games[0].maxPlayers) joinGame(targetId);
        const firstBtn = grid.querySelector('.card button');
        if (firstBtn?.disabled && firstBtn.textContent.trim() === 'Full') log('Full lobby shows disabled "Full" button.');
        else log('Full‑lobby UI not applied correctly.', 'fail');

        // Test 4: Search should isolate "Game 3"
        q.value = 'Game 3';
        render(filter(q.value));
        const filtered = grid.querySelectorAll('.card');
        if (filtered.length === 1 && filtered[0].querySelector('h3')?.textContent.trim() === 'Game 3') log('Search filter isolates "Game 3".');
        else log('Search filter failed to isolate "Game 3".', 'fail');

        // Test 5: Details formatter uses proper \n newlines and expected content
        const sample = games[1]; // untouched by join/full logic above
        const detailsText = formatDetails(sample);
        const lines = detailsText.split('\n');
        const expectedFirst = `Game: ${sample.name}`;
        const expectedSecond = `Mode: ${sample.mode}`;
        const expectedThird = `Players: ${capacityLabel(sample)}`;
        if (
          detailsText.includes('\n') &&
          lines[0] === expectedFirst &&
          lines[1] === expectedSecond &&
          lines[2] === expectedThird
        ) log('Details text uses "\\n" separators and includes expected lines.');
        else log('Details text formatting failed (newline/content mismatch).', 'fail');

      } catch (e) {
        log(`Unexpected test error: ${e.message}`, 'fail');
        console.error(e);
      } finally {
        // Restore original state and UI after tests
        games = snapshot;
        q.value = '';
        render(games);
        suppressAlerts = false;
      }
    }

    // Defer running tests until the first paint has occurred
    requestAnimationFrame(() => runTests());
  </script>
</body>
</html>
