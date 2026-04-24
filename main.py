import curses
import time
import random


def random_grid(rows, cols, density=0.3):
    return [[1 if random.random() < density else 0 for _ in range(cols)] for _ in range(rows)]


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

    grid = random_grid(rows, cols)
    generation = 0
    paused = False
    delay = 0.08  # seconds per frame

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
            f"q:quit  r:reset  space:pause  +/-:speed"
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
            grid = random_grid(rows, cols)
            generation = 0
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
