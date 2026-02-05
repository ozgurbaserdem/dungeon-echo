# Echo Fragments — Design Document

## Problem

The current game shows an exact distance number in each room. Players just follow decreasing numbers toward the treasure — there's no real deduction, no "aha!" moment, and the puzzle feels like a hot/cold game rather than a logic challenge.

## Solution: Echo Fragments

Replace distance numbers with **property clues** about the treasure room. Each room reveals a different constraint (exit count, grid position, adjacency, entrance distance). Players combine clues from 3-4 rooms to logically eliminate candidates until only one room fits — then navigate there.

## Core Mechanic

- Each room holds a **clue** — a true statement about a property of the treasure room.
- Before entering, rooms show a small **icon** indicating the clue category. This lets players plan routes toward useful information.
- Clues **stay visible** after leaving a room. The challenge is logical deduction, not memorization.
- Fog-of-war remains: you only see adjacent rooms. Balances exploration (discovering candidates) with deduction (eliminating them).
- Win condition unchanged: walk into the treasure room.

## Clue Types

Four categories, each with a distinct icon:

### Connection Clues (chain icon)

About the treasure room's structure.

- Example: "The treasure room has exactly 3 exits"
- Compact display: `3 exits`
- Player eliminates rooms by counting visible doors

### Spatial Clues (compass icon)

About the treasure room's grid position.

- Examples: "The treasure is in row 2" / "The treasure is in column 4"
- Compact display: `Row 2` or `Col 4`
- Immediately useful — player scans the map layout

### Relational Clues (eye icon)

About the treasure's relationship to the clue room.

- Examples: "The treasure is NOT adjacent to this room" / "The treasure IS adjacent to this room"
- Compact display: `Not adj.` or `Adjacent`
- Eliminates or confirms neighboring rooms as candidates

### Entrance Clues (door icon)

About distance from the entrance.

- Example: "The treasure is 5 steps from the entrance"
- Compact display: `5 from start`
- A fixed reference point everyone starts from

## Visual Design

| Room state | Display |
|---|---|
| Unvisited (adjacent) | Clue category icon only |
| Current room | Full clue text + icon |
| Visited room | Compact clue (icon + key info) |
| Treasure room (found) | Diamond emoji |

A **clue panel** at the bottom or side lists all collected clues in full sentences for easy cross-referencing.

## Clue Generation Algorithm

Runs after dungeon generation (existing dungeon code untouched):

1. Every non-treasure room gets exactly one clue assigned by the daily seed.
2. At least one of each category must exist in every dungeon.
3. Clue types spread across the map — avoid clustering.
4. Each clue is a true statement derived from the treasure room's actual properties.
5. **Solvability validation**: simulate collecting clues from the 3-4 rooms nearest the entrance. If they don't narrow candidates to exactly 1 room, reshuffle assignments (using seed) until they do.

## Gameplay Flow

1. Enter entrance — first clue revealed (e.g., `5 from start`).
2. Scan adjacent rooms' clue type icons — plan which to visit.
3. Move to chosen room — new clue revealed (e.g., `Row 2`).
4. Cross-reference clues in the clue panel — eliminate candidates.
5. After ~3-4 clue rooms, constraints combine: **"It MUST be that room."**
6. Navigate to the deduced room. If correct: win! If wrong: rooms along the way provide more clues.

Typical solve: 5-7 moves. The "aha" moment happens when 3-4 constraints click together.

## Scoring

- **Moves**: counted as before (each room transition = 1 move).
- **Par**: recalculated per dungeon — accounts for minimum clues needed + shortest path from there to treasure. Typically 5-8.
- **Rating**: same S/A/B/C/D system based on moves vs par.
- **Echoes**: becomes number of clue rooms visited (fewer = sharper deduction).
- **Share format**: unchanged — emoji grid, rating, moves vs par.

## What Doesn't Change

- Dungeon generation algorithm and seeded RNG (untouched)
- Room visuals, fog-of-war, door mechanics
- Stats tracking, streaks, share modal structure
- Daily puzzle cadence
