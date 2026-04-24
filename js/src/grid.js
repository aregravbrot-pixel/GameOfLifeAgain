const { SEEDS } = require('./seeds');

function randomGrid(rows, cols, density = 0.3) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() < density ? 1 : 0))
  );
}

function seedGrid(rows, cols, cells) {
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const minR = Math.min(...cells.map(([r]) => r));
  const maxR = Math.max(...cells.map(([r]) => r));
  const minC = Math.min(...cells.map(([, c]) => c));
  const maxC = Math.max(...cells.map(([, c]) => c));
  const originR = Math.floor((rows - (maxR - minR + 1)) / 2) - minR;
  const originC = Math.floor((cols - (maxC - minC + 1)) / 2) - minC;
  for (const [r, c] of cells) {
    const nr = originR + r;
    const nc = originC + c;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      grid[nr][nc] = 1;
    }
  }
  return grid;
}

function makeGrid(rows, cols, seedName) {
  const cells = SEEDS[seedName];
  if (cells == null) return randomGrid(rows, cols);
  return seedGrid(rows, cols, cells);
}

function countNeighbors(grid, row, col, rows, cols) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      count += grid[(row + dr + rows) % rows][(col + dc + cols) % cols];
    }
  }
  return count;
}

function nextGeneration(grid, rows, cols) {
  const next = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = countNeighbors(grid, r, c, rows, cols);
      if (grid[r][c]) {
        next[r][c] = n === 2 || n === 3 ? 1 : 0;
      } else {
        next[r][c] = n === 3 ? 1 : 0;
      }
    }
  }
  return next;
}

function countAlive(grid) {
  return grid.reduce((sum, row) => sum + row.reduce((s, c) => s + c, 0), 0);
}

module.exports = { randomGrid, seedGrid, makeGrid, countNeighbors, nextGeneration, countAlive };
