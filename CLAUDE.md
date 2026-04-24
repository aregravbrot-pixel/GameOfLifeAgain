# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Implementations

| Folder | Language | Notes |
|--------|----------|-------|
| `python/` | Python | stdlib only (`curses`) |
| `js/` | Node.js | requires `npm install` |

## Running the demo

**Python:**
```bash
python python/main.py
```
Requires a terminal with curses and UTF-8 support.

**JavaScript:**
```bash
cd js && npm install
npm start
```

## JavaScript tests

```bash
cd js
npm test               # run all tests
npm run test:coverage  # with coverage report
```

Tests live in `js/test/` and cover all game-logic functions in `js/src/grid.js` and all seed definitions in `js/src/seeds.js`. `main.js` (terminal UI) is excluded from tests.

## Controls

| Key | Action |
|-----|--------|
| `s` | Open seed selection menu |
| `r` | Reset to current seed |
| `space` | Pause / resume |
| `+` / `=` | Increase speed |
| `-` | Decrease speed |
| `q` | Quit |

## Architecture

Everything lives in `python/main.py`. Key sections:

- **`SEEDS` dict** — maps seed names to lists of `(row, col)` offsets. `None` means random fill. `SEED_NAMES` preserves insertion order for the menu.
- **`seed_grid`** — centers a seed pattern on the grid, silently clipping any cells that fall outside the terminal bounds (relevant for wide patterns like Gosper Gun).
- **`next_generation`** — standard Conway rules with toroidal wrapping (edges connect to the opposite side).
- **`show_seed_menu`** — temporarily switches curses to blocking input, draws a box-border menu with arrow-key navigation, then restores non-blocking mode before returning.
- **`main`** — initialises curses, runs the animation loop: draw → status bar → handle input → step generation → sleep.

## Adding a new seed

Add an entry to the `SEEDS` dict with a list of `(row, col)` offsets. The pattern is automatically centered on the grid when loaded. `SEED_NAMES` will pick it up automatically since it is derived from `SEEDS`.
