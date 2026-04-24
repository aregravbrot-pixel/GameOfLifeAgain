const { SEED_NAMES } = require('./seeds');
const { makeGrid, nextGeneration, countAlive } = require('./grid');

const CELL = '█';
const SPEEDS = [250, 150, 80, 40, 20]; // ms per frame

const G    = '\x1b[32m'; // green
const C    = '\x1b[36m'; // cyan
const R    = '\x1b[0m';  // reset
const REV  = '\x1b[7m';  // reverse video
const BOLD = '\x1b[1m';  // bold

const cols     = process.stdout.columns || 80;
const termRows = process.stdout.rows    || 24;
const rows     = termRows - 2; // reserve 2 lines at bottom to prevent scroll

const state = {
  grid:         makeGrid(rows, cols, 'Random'),
  generation:   0,
  paused:       false,
  speedIdx:     2,
  currentSeed:  'Random',
  mode:         'running', // 'running' | 'menu'
  menuSelected: 0,
};

// ── Terminal setup ──────────────────────────────────────────────────────────

process.stdout.write('\x1b[2J\x1b[?25l'); // clear screen, hide cursor
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

function quit() {
  process.stdout.write('\x1b[2J\x1b[H\x1b[?25h');
  process.exit(0);
}

process.on('SIGTERM', quit);
process.on('exit', () => process.stdout.write('\x1b[?25h'));

// ── Rendering ───────────────────────────────────────────────────────────────

function render() {
  let out = '\x1b[H';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out += state.grid[r][c] ? G + CELL + R : ' ';
    }
    out += '\r\n';
  }

  const alive  = countAlive(state.grid);
  const status = ` Gen: ${String(state.generation).padStart(6)}  Alive: ${String(alive).padStart(6)}  Speed: ${state.speedIdx + 1}/5  ${state.paused ? '[PAUSED]' : '[RUNNING]'}  Seed: ${state.currentSeed}  q:quit  r:reset  s:seeds  space:pause  +/-:speed`;
  out += C + status.slice(0, cols).padEnd(cols) + R;

  process.stdout.write(out);

  if (state.mode === 'menu') renderMenu();
}

function renderMenu() {
  const innerW = Math.max(...SEED_NAMES.map(n => n.length)) + 4;
  const boxW   = innerW + 4;
  const boxH   = SEED_NAMES.length + 5;
  const boxR   = Math.max(0, Math.floor((rows - boxH) / 2));
  const boxC   = Math.max(0, Math.floor((cols - boxW) / 2));

  const at = (r, c, text, attr = '') =>
    process.stdout.write(`\x1b[${r + 1};${c + 1}H${attr}${text}${R}`);

  at(boxR,          boxC, '┌' + '─'.repeat(boxW - 2) + '┐');
  for (let i = 1; i < boxH - 1; i++)
    at(boxR + i, boxC, '│' + ' '.repeat(boxW - 2) + '│');
  at(boxR + boxH - 1, boxC, '└' + '─'.repeat(boxW - 2) + '┘');

  const title = ' Select Seed ';
  at(boxR,     boxC + Math.floor((boxW - title.length) / 2), title, C + BOLD);
  at(boxR + 1, boxC + 2, '↑↓ navigate   Enter select   Esc cancel', C);
  at(boxR + 2, boxC, '├' + '─'.repeat(boxW - 2) + '┤');

  for (let i = 0; i < SEED_NAMES.length; i++) {
    const prefix = i === state.menuSelected ? ' > ' : '   ';
    const line   = (prefix + SEED_NAMES[i]).padEnd(boxW - 2);
    at(boxR + 3 + i, boxC + 1, line, i === state.menuSelected ? REV : '');
  }
}

// ── Input ───────────────────────────────────────────────────────────────────

process.stdin.on('data', key => {
  if (key === '\x03') quit(); // Ctrl-C always exits

  if (state.mode === 'menu') {
    handleMenuKey(key);
  } else {
    handleGameKey(key);
  }
});

function handleMenuKey(key) {
  if (key === '\x1b[A') {
    state.menuSelected = (state.menuSelected - 1 + SEED_NAMES.length) % SEED_NAMES.length;
  } else if (key === '\x1b[B') {
    state.menuSelected = (state.menuSelected + 1) % SEED_NAMES.length;
  } else if (key === '\r' || key === '\n') {
    state.currentSeed = SEED_NAMES[state.menuSelected];
    state.grid        = makeGrid(rows, cols, state.currentSeed);
    state.generation  = 0;
    state.mode        = 'running';
    process.stdout.write('\x1b[2J');
  } else if (key === '\x1b' || key === 'q') {
    state.mode = 'running';
    process.stdout.write('\x1b[2J');
  }
}

function handleGameKey(key) {
  if (key === 'q') {
    quit();
  } else if (key === 'r') {
    state.grid       = makeGrid(rows, cols, state.currentSeed);
    state.generation = 0;
  } else if (key === 's') {
    state.menuSelected = Math.max(0, SEED_NAMES.indexOf(state.currentSeed));
    state.mode         = 'menu';
  } else if (key === ' ') {
    state.paused = !state.paused;
  } else if (key === '+' || key === '=') {
    state.speedIdx = Math.min(state.speedIdx + 1, SPEEDS.length - 1);
  } else if (key === '-' || key === '_') {
    state.speedIdx = Math.max(state.speedIdx - 1, 0);
  }
}

// ── Game loop ────────────────────────────────────────────────────────────────

function loop() {
  if (state.mode === 'running' && !state.paused) {
    state.grid = nextGeneration(state.grid, rows, cols);
    state.generation++;
  }
  render();
  setTimeout(loop, SPEEDS[state.speedIdx]);
}

loop();
