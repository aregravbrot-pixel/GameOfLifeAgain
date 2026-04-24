const { randomGrid, seedGrid, makeGrid, countNeighbors, nextGeneration, countAlive } = require('../src/grid');

// ── helpers ──────────────────────────────────────────────────────────────────

function makeEmpty(rows, cols) {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

function place(rows, cols, cells) {
  const g = makeEmpty(rows, cols);
  for (const [r, c] of cells) g[r][c] = 1;
  return g;
}

// ── randomGrid ───────────────────────────────────────────────────────────────

describe('randomGrid', () => {
  test('returns correct dimensions', () => {
    const grid = randomGrid(5, 10);
    expect(grid).toHaveLength(5);
    grid.forEach(row => expect(row).toHaveLength(10));
  });

  test('all cells are 0 or 1', () => {
    const grid = randomGrid(10, 10);
    grid.forEach(row => row.forEach(cell => expect([0, 1]).toContain(cell)));
  });

  test('density 0 produces all-dead grid', () => {
    expect(countAlive(randomGrid(10, 10, 0))).toBe(0);
  });

  test('density 1 produces all-alive grid', () => {
    expect(countAlive(randomGrid(10, 10, 1))).toBe(100);
  });
});

// ── seedGrid ─────────────────────────────────────────────────────────────────

describe('seedGrid', () => {
  test('single cell is placed at center of grid', () => {
    const grid = seedGrid(5, 5, [[0, 0]]);
    expect(grid[2][2]).toBe(1);
    expect(countAlive(grid)).toBe(1);
  });

  test('pattern is centered horizontally and vertically', () => {
    // 3-wide blinker on 9-wide, 5-tall grid:
    // width=3 → centered at col 3,4,5; height=1 → row 2
    const grid = seedGrid(5, 9, [[0, 0], [0, 1], [0, 2]]);
    expect(grid[2][3]).toBe(1);
    expect(grid[2][4]).toBe(1);
    expect(grid[2][5]).toBe(1);
    expect(countAlive(grid)).toBe(3);
  });

  test('rest of grid is dead', () => {
    const grid = seedGrid(6, 6, [[0, 0]]);
    expect(countAlive(grid)).toBe(1);
  });

  test('out-of-bounds cells are silently clipped', () => {
    // Pattern wider than grid — should not throw, just place what fits
    const grid = seedGrid(5, 5, [[0, 0], [0, 50]]);
    expect(() => grid).not.toThrow();
    expect(countAlive(grid)).toBeLessThanOrEqual(2);
  });

  test('multi-row pattern centers correctly', () => {
    // 2×2 block on 4×4 grid → top-left of block at (1,1)
    const grid = seedGrid(4, 4, [[0, 0], [0, 1], [1, 0], [1, 1]]);
    expect(grid[1][1]).toBe(1);
    expect(grid[1][2]).toBe(1);
    expect(grid[2][1]).toBe(1);
    expect(grid[2][2]).toBe(1);
    expect(countAlive(grid)).toBe(4);
  });
});

// ── makeGrid ─────────────────────────────────────────────────────────────────

describe('makeGrid', () => {
  test('returns grid with correct dimensions for Random', () => {
    const grid = makeGrid(6, 8, 'Random');
    expect(grid).toHaveLength(6);
    grid.forEach(row => expect(row).toHaveLength(8));
  });

  test('returns correct alive count for Blinker seed', () => {
    expect(countAlive(makeGrid(10, 10, 'Blinker'))).toBe(3);
  });

  test('returns correct alive count for Glider seed', () => {
    expect(countAlive(makeGrid(10, 10, 'Glider'))).toBe(5);
  });

  test('unknown seed name falls back to random grid', () => {
    const grid = makeGrid(5, 5, 'NotASeed');
    expect(grid).toHaveLength(5);
    grid.forEach(row => expect(row).toHaveLength(5));
  });
});

// ── countNeighbors ────────────────────────────────────────────────────────────

describe('countNeighbors', () => {
  test('returns 8 when all 8 neighbours are alive', () => {
    const grid = place(3, 3, [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]);
    expect(countNeighbors(grid, 1, 1, 3, 3)).toBe(8);
  });

  test('returns 0 when no neighbours are alive', () => {
    const grid = place(3, 3, [[1, 1]]);
    expect(countNeighbors(grid, 1, 1, 3, 3)).toBe(0);
  });

  test('does not count the cell itself', () => {
    // Only the center cell is alive; it should report 0 neighbours
    const grid = place(3, 3, [[1, 1]]);
    expect(countNeighbors(grid, 1, 1, 3, 3)).toBe(0);
  });

  test('wraps toroidally at left/right edges', () => {
    // Alive at col 0 and col 4 on the same row — they are neighbours via wrap
    const grid = place(3, 5, [[1, 0], [1, 4]]);
    // (1,4) should see (1,0) as a neighbour
    expect(countNeighbors(grid, 1, 4, 3, 5)).toBeGreaterThanOrEqual(1);
  });

  test('wraps toroidally at top/bottom edges', () => {
    const grid = place(5, 3, [[0, 1], [4, 1]]);
    // (0,1) should see (4,1) as a neighbour via wrap
    expect(countNeighbors(grid, 0, 1, 5, 3)).toBeGreaterThanOrEqual(1);
  });

  test('corner cell wraps on both axes', () => {
    // Only alive cells are at the two diagonally-opposite corners
    const grid = place(3, 3, [[0, 0], [2, 2]]);
    // (0,0) corner: (2,2) is its diagonal neighbour via toroidal wrap
    expect(countNeighbors(grid, 0, 0, 3, 3)).toBe(1);
  });

  test('counts exact number of live neighbours for known pattern', () => {
    //  .*.
    //  ..*
    //  ***
    const grid = place(3, 3, [[0,1],[1,2],[2,0],[2,1],[2,2]]);
    // (1,1) neighbours: (0,0)=0,(0,1)=1,(0,2)=0,(1,0)=0,(1,2)=1,(2,0)=1,(2,1)=1,(2,2)=1 → 5
    expect(countNeighbors(grid, 1, 1, 3, 3)).toBe(5);
  });
});

// ── nextGeneration ────────────────────────────────────────────────────────────

describe('nextGeneration', () => {
  test('live cell with fewer than 2 neighbours dies (underpopulation)', () => {
    const grid = place(3, 3, [[1, 1]]); // isolated cell, 0 neighbours
    expect(nextGeneration(grid, 3, 3)[1][1]).toBe(0);
  });

  test('live cell with exactly 2 neighbours survives', () => {
    // Block is a still life — every cell has exactly 2 or 3 neighbours
    const grid = place(4, 4, [[1,1],[1,2],[2,1],[2,2]]);
    const next = nextGeneration(grid, 4, 4);
    expect(next[1][1]).toBe(1);
  });

  test('live cell with exactly 3 neighbours survives', () => {
    const grid = place(4, 4, [[1,1],[1,2],[2,1],[2,2]]);
    const next = nextGeneration(grid, 4, 4);
    expect(next[1][2]).toBe(1);
  });

  test('live cell with more than 3 neighbours dies (overpopulation)', () => {
    // Center of fully-alive 3×3 has 8 neighbours
    const grid = place(3, 3, [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]);
    expect(nextGeneration(grid, 3, 3)[1][1]).toBe(0);
  });

  test('dead cell with exactly 3 neighbours becomes alive (reproduction)', () => {
    const grid = place(3, 3, [[0,0],[0,1],[1,0]]); // L-shape; (1,1) has 3 neighbours
    expect(nextGeneration(grid, 3, 3)[1][1]).toBe(1);
  });

  test('dead cell with 2 neighbours stays dead', () => {
    const grid = place(3, 3, [[0,0],[0,2]]); // (0,1) has 2 neighbours
    expect(nextGeneration(grid, 3, 3)[0][1]).toBe(0);
  });

  test('block (2×2) is a still life', () => {
    const grid = place(4, 4, [[1,1],[1,2],[2,1],[2,2]]);
    expect(nextGeneration(grid, 4, 4)).toEqual(grid);
  });

  test('blinker rotates from horizontal to vertical in one generation', () => {
    const grid = place(5, 5, [[2,1],[2,2],[2,3]]);
    const next = nextGeneration(grid, 5, 5);
    expect(next[1][2]).toBe(1);
    expect(next[2][2]).toBe(1);
    expect(next[3][2]).toBe(1);
    expect(next[2][1]).toBe(0);
    expect(next[2][3]).toBe(0);
  });

  test('blinker returns to original shape after 2 generations', () => {
    const grid = place(5, 5, [[2,1],[2,2],[2,3]]);
    const gen2 = nextGeneration(nextGeneration(grid, 5, 5), 5, 5);
    expect(gen2[2][1]).toBe(1);
    expect(gen2[2][2]).toBe(1);
    expect(gen2[2][3]).toBe(1);
    expect(countAlive(gen2)).toBe(3);
  });

  test('glider moves one step diagonally after 4 generations', () => {
    // Glider at (0,1),(1,2),(2,0),(2,1),(2,2) on a 15×15 grid.
    // After 4 gens it should be at (1,2),(2,3),(3,1),(3,2),(3,3).
    const R = 15, C = 15;
    let g = place(R, C, [[0,1],[1,2],[2,0],[2,1],[2,2]]);
    for (let i = 0; i < 4; i++) g = nextGeneration(g, R, C);

    expect(g[1][2]).toBe(1);
    expect(g[2][3]).toBe(1);
    expect(g[3][1]).toBe(1);
    expect(g[3][2]).toBe(1);
    expect(g[3][3]).toBe(1);
    expect(countAlive(g)).toBe(5);
  });

  test('Gosper Gun increases alive count over time', () => {
    // The gun fires gliders, so alive count should grow past initial 36
    const R = 40, C = 80;
    let g = makeGrid(R, C, 'Gosper Gun');
    const initial = countAlive(g);
    for (let i = 0; i < 30; i++) g = nextGeneration(g, R, C);
    expect(countAlive(g)).toBeGreaterThan(initial);
  });
});

// ── countAlive ────────────────────────────────────────────────────────────────

describe('countAlive', () => {
  test('returns 0 for all-dead grid', () => {
    expect(countAlive([[0, 0], [0, 0]])).toBe(0);
  });

  test('returns total cell count for all-alive grid', () => {
    expect(countAlive([[1, 1], [1, 1]])).toBe(4);
  });

  test('returns correct partial count', () => {
    expect(countAlive([[1, 0], [0, 1], [1, 1]])).toBe(4);
  });

  test('handles single-row grid', () => {
    expect(countAlive([[1, 0, 1, 0, 1]])).toBe(3);
  });
});
