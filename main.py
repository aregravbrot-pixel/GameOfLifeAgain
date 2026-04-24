import curses
import time
import random

SEEDS = {
    "Random":     None,
    "Glider":     [(0,1),(1,2),(2,0),(2,1),(2,2)],
    "Blinker":    [(0,0),(0,1),(0,2)],
    "Toad":       [(0,1),(0,2),(0,3),(1,0),(1,1),(1,2)],
    "Beacon":     [(0,0),(0,1),(1,0),(1,1),(2,2),(2,3),(3,2),(3,3)],
    "Pulsar":     [
        (0,2),(0,3),(0,4),(0,8),(0,9),(0,10),
        (2,0),(2,5),(2,7),(2,12),
        (3,0),(3,5),(3,7),(3,12),
        (4,0),(4,5),(4,7),(4,12),
        (5,2),(5,3),(5,4),(5,8),(5,9),(5,10),
        (7,2),(7,3),(7,4),(7,8),(7,9),(7,10),
        (8,0),(8,5),(8,7),(8,12),
        (9,0),(9,5),(9,7),(9,12),
        (10,0),(10,5),(10,7),(10,12),
        (12,2),(12,3),(12,4),(12,8),(12,9),(12,10),
    ],
    "R-pentomino": [(0,1),(0,2),(1,0),(1,1),(2,1)],
    "Acorn":       [(0,1),(1,3),(2,0),(2,1),(2,4),(2,5),(2,6)],
    "Diehard":     [(0,6),(1,0),(1,1),(2,1),(2,5),(2,6),(2,7)],
    "LWSS":        [(0,1),(0,4),(1,0),(2,0),(2,4),(3,0),(3,1),(3,2),(3,3)],
    "Gosper Gun":  [
        (0,24),
        (1,22),(1,24),
        (2,12),(2,13),(2,20),(2,21),(2,34),(2,35),
        (3,11),(3,15),(3,20),(3,21),(3,34),(3,35),
        (4,0),(4,1),(4,10),(4,16),(4,20),(4,21),
        (5,0),(5,1),(5,10),(5,14),(5,16),(5,17),(5,22),(5,24),
        (6,10),(6,16),(6,24),
        (7,11),(7,15),
        (8,12),(8,13),
    ],
}

SEED_NAMES = list(SEEDS.keys())


def random_grid(rows, cols, density=0.3):
    return [[1 if random.random() < density else 0 for _ in range(cols)] for _ in range(rows)]


def seed_grid(rows, cols, cells):
    grid = [[0] * cols for _ in range(rows)]
    min_r = min(r for r, c in cells)
    max_r = max(r for r, c in cells)
    min_c = min(c for r, c in cells)
    max_c = max(c for r, c in cells)
    origin_r = (rows - (max_r - min_r + 1)) // 2 - min_r
    origin_c = (cols - (max_c - min_c + 1)) // 2 - min_c
    for r, c in cells:
        nr, nc = origin_r + r, origin_c + c
        if 0 <= nr < rows and 0 <= nc < cols:
            grid[nr][nc] = 1
    return grid


def make_grid(rows, cols, seed_name):
    cells = SEEDS.get(seed_name)
    if cells is None:
        return random_grid(rows, cols)
    return seed_grid(rows, cols, cells)


def count_neighbors(grid, row, col, rows, cols):
    count = 0
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            if dr == 0 and dc == 0:
                continue
            count += grid[(row + dr) % rows][(col + dc) % cols]
    return count


def next_generation(grid, rows, cols):
    new_grid = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            n = count_neighbors(grid, r, c, rows, cols)
            if grid[r][c]:
                new_grid[r][c] = 1 if n in (2, 3) else 0
            else:
                new_grid[r][c] = 1 if n == 3 else 0
    return new_grid


def count_alive(grid):
    return sum(cell for row in grid for cell in row)


def show_seed_menu(stdscr, rows, max_cols):
    stdscr.nodelay(False)

    inner_w = max(len(name) for name in SEED_NAMES) + 4
    box_w = inner_w + 4
    box_h = len(SEED_NAMES) + 5
    box_r = max(0, (rows - box_h) // 2)
    box_c = max(0, (max_cols - box_w) // 2)

    selected = 0
    while True:
        # Box background
        for i in range(box_h):
            try:
                stdscr.addstr(box_r + i, box_c, " " * box_w)
            except curses.error:
                pass

        # Border
        try:
            stdscr.addstr(box_r, box_c, "┌" + "─" * (box_w - 2) + "┐")
            for i in range(1, box_h - 1):
                stdscr.addstr(box_r + i, box_c, "│")
                stdscr.addstr(box_r + i, box_c + box_w - 1, "│")
            stdscr.addstr(box_r + box_h - 1, box_c, "└" + "─" * (box_w - 2) + "┘")
        except curses.error:
            pass

        # Title
        title = " Select Seed "
        try:
            stdscr.addstr(box_r, box_c + (box_w - len(title)) // 2, title,
                          curses.color_pair(2) | curses.A_BOLD)
        except curses.error:
            pass

        # Hint
        hint = "↑↓ navigate   Enter select   Esc cancel"
        try:
            stdscr.addstr(box_r + 1, box_c + 2, hint[:inner_w + 2], curses.color_pair(2))
        except curses.error:
            pass

        # Separator
        try:
            stdscr.addstr(box_r + 2, box_c, "├" + "─" * (box_w - 2) + "┤")
        except curses.error:
            pass

        # Items
        for i, name in enumerate(SEED_NAMES):
            attr = curses.A_REVERSE if i == selected else 0
            prefix = " > " if i == selected else "   "
            line = f"{prefix}{name:<{inner_w}}"
            try:
                stdscr.addstr(box_r + 3 + i, box_c + 1, line, attr)
            except curses.error:
                pass

        stdscr.refresh()

        key = stdscr.getch()
        if key == curses.KEY_UP:
            selected = (selected - 1) % len(SEED_NAMES)
        elif key == curses.KEY_DOWN:
            selected = (selected + 1) % len(SEED_NAMES)
        elif key in (curses.KEY_ENTER, ord("\n"), ord("\r")):
            stdscr.nodelay(True)
            return SEED_NAMES[selected]
        elif key in (27, ord("q")):
            stdscr.nodelay(True)
            return None


def main(stdscr):
    curses.curs_set(0)
    stdscr.nodelay(True)

    if curses.has_colors():
        curses.start_color()
        curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_CYAN, curses.COLOR_BLACK)

    max_rows, max_cols = stdscr.getmaxyx()
    rows = max_rows - 2  # reserve 2 lines for status bar
    cols = max_cols

    current_seed = "Random"
    grid = make_grid(rows, cols, current_seed)
    generation = 0
    paused = False

    CELL = "█"
    SPEEDS = [0.25, 0.15, 0.08, 0.04, 0.02]
    speed_idx = 2

    while True:
        # Draw cells
        for r in range(rows):
            for c in range(cols):
                if c >= max_cols:
                    break
                try:
                    if grid[r][c]:
                        if curses.has_colors():
                            stdscr.addch(r, c, CELL, curses.color_pair(1))
                        else:
                            stdscr.addch(r, c, CELL)
                    else:
                        stdscr.addch(r, c, " ")
                except curses.error:
                    pass

        # Status bar
        alive = count_alive(grid)
        status = (
            f" Gen: {generation:>6}  Alive: {alive:>6}  "
            f"Speed: {speed_idx + 1}/5  "
            f"{'[PAUSED]' if paused else '[RUNNING]'}  "
            f"Seed: {current_seed}  "
            f"q:quit  r:reset  s:seeds  space:pause  +/-:speed"
        )
        try:
            if curses.has_colors():
                stdscr.addstr(rows, 0, status[:max_cols].ljust(max_cols), curses.color_pair(2))
            else:
                stdscr.addstr(rows, 0, status[:max_cols].ljust(max_cols))
        except curses.error:
            pass

        stdscr.refresh()

        # Input (non-blocking)
        key = stdscr.getch()
        if key == ord("q"):
            break
        elif key == ord("r"):
            grid = make_grid(rows, cols, current_seed)
            generation = 0
        elif key == ord("s"):
            choice = show_seed_menu(stdscr, rows, max_cols)
            if choice is not None:
                current_seed = choice
                grid = make_grid(rows, cols, current_seed)
                generation = 0
            stdscr.clear()
        elif key == ord(" "):
            paused = not paused
        elif key in (ord("+"), ord("=")):
            speed_idx = min(speed_idx + 1, len(SPEEDS) - 1)
        elif key in (ord("-"), ord("_")):
            speed_idx = max(speed_idx - 1, 0)

        delay = SPEEDS[speed_idx]

        if not paused:
            grid = next_generation(grid, rows, cols)
            generation += 1

        time.sleep(delay)


curses.wrapper(main)
