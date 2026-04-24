const { SEEDS, SEED_NAMES } = require('../src/seeds');

describe('SEEDS structure', () => {
  test('SEED_NAMES matches Object.keys(SEEDS) in order', () => {
    expect(SEED_NAMES).toEqual(Object.keys(SEEDS));
  });

  test('Random seed is null', () => {
    expect(SEEDS.Random).toBeNull();
  });

  test('all non-null seeds are non-empty arrays', () => {
    Object.entries(SEEDS).forEach(([name, cells]) => {
      if (name === 'Random') return;
      expect(Array.isArray(cells)).toBe(true);
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  test('all seed cells are [row, col] pairs of non-negative integers', () => {
    Object.entries(SEEDS).forEach(([, cells]) => {
      if (!cells) return;
      cells.forEach(([r, c]) => {
        expect(Number.isInteger(r)).toBe(true);
        expect(Number.isInteger(c)).toBe(true);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(c).toBeGreaterThanOrEqual(0);
      });
    });
  });

  test('no duplicate cells within any seed', () => {
    Object.entries(SEEDS).forEach(([name, cells]) => {
      if (!cells) return;
      const keys = cells.map(([r, c]) => `${r},${c}`);
      const unique = new Set(keys);
      expect(unique.size).toBe(keys.length);
    });
  });
});

describe('known cell counts', () => {
  test('Glider has 5 cells', ()           => expect(SEEDS.Glider).toHaveLength(5));
  test('Blinker has 3 cells', ()          => expect(SEEDS.Blinker).toHaveLength(3));
  test('Toad has 6 cells', ()             => expect(SEEDS.Toad).toHaveLength(6));
  test('Beacon has 8 cells', ()           => expect(SEEDS.Beacon).toHaveLength(8));
  test('Pulsar has 48 cells', ()          => expect(SEEDS.Pulsar).toHaveLength(48));
  test('R-pentomino has 5 cells', ()      => expect(SEEDS['R-pentomino']).toHaveLength(5));
  test('Acorn has 7 cells', ()            => expect(SEEDS.Acorn).toHaveLength(7));
  test('Diehard has 7 cells', ()          => expect(SEEDS.Diehard).toHaveLength(7));
  test('LWSS has 9 cells', ()             => expect(SEEDS.LWSS).toHaveLength(9));
  test('Gosper Gun has 36 cells', ()      => expect(SEEDS['Gosper Gun']).toHaveLength(36));
});

describe('Glider cell positions', () => {
  test('contains all expected coordinates', () => {
    const set = new Set(SEEDS.Glider.map(([r, c]) => `${r},${c}`));
    expect(set.has('0,1')).toBe(true);
    expect(set.has('1,2')).toBe(true);
    expect(set.has('2,0')).toBe(true);
    expect(set.has('2,1')).toBe(true);
    expect(set.has('2,2')).toBe(true);
  });
});

describe('SEED_NAMES', () => {
  test('first entry is Random', () => {
    expect(SEED_NAMES[0]).toBe('Random');
  });

  test('contains all expected seed names', () => {
    const expected = [
      'Random', 'Glider', 'Blinker', 'Toad', 'Beacon', 'Pulsar',
      'R-pentomino', 'Acorn', 'Diehard', 'LWSS', 'Gosper Gun',
    ];
    expected.forEach(name => expect(SEED_NAMES).toContain(name));
  });

  test('has 11 entries', () => {
    expect(SEED_NAMES).toHaveLength(11);
  });
});
