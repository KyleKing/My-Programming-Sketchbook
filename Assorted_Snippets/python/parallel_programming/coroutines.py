"""Example coroutines adapted from: https://github.com/gto76/python-cheatsheet#coroutines."""

import asyncio
import collections
import curses
import enum
import random

P = collections.namedtuple('P', 'x y')   # Position
D = enum.Enum('D', 'n e s w')            # Direction


def main(screen):
    curses.curs_set(0)                   # Makes cursor invisible.
    screen.nodelay(True)                 # Makes getch() non-blocking.
    asyncio.run(main_coroutine(screen))  # Starts running asyncio code.


async def main_coroutine(screen):
    state = {'*': P(0, 0), **{id_: P(30, 10) for id_ in range(10)}}
    moves = asyncio.Queue()
    routines = (*(random_controller(id_, moves) for id_ in range(10)),
                human_controller(screen, moves),
                model(moves, state, *screen.getmaxyx()),
                view(state, screen))
    await asyncio.wait(routines, return_when=asyncio.FIRST_COMPLETED)


async def random_controller(id_, moves):
    while True:
        moves.put_nowait((id_, random.choice(list(D))))
        await asyncio.sleep(random.random() / 2)


async def human_controller(screen, moves):
    while True:
        ch = screen.getch()
        key_mappings = {259: D.n, 261: D.e, 258: D.s, 260: D.w}
        if ch in key_mappings:
            moves.put_nowait(('*', key_mappings[ch]))
        await asyncio.sleep(0.01)  # Non-blocking sleep


async def model(moves, state, height, width):
    while state['*'] not in {p for id_, p in state.items() if id_ != '*'}:
        id_, d = await moves.get()
        p = state[id_]
        deltas = {D.n: P(0, -1), D.e: P(1, 0), D.s: P(0, 1), D.w: P(-1, 0)}
        new_p = P(p.x + deltas[d].x, p.y + deltas[d].y)
        if 0 <= new_p.x < width - 1 and 0 <= new_p.y < height:
            state[id_] = new_p


async def view(state, screen):
    while True:
        screen.clear()
        for id_, p in state.items():
            screen.addstr(p.y, p.x, str(id_))
        await asyncio.sleep(0.01)


curses.wrapper(main)
