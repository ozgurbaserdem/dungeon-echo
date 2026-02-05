# Dungeon Echo — Stickiness Improvement Plan

## Overview

Improve Dungeon Echo — a daily puzzle game (like Wordle) where players navigate a procedurally-generated dungeon to find treasure using distance hints. The core mechanic: you only see the distance-to-treasure number in the room you're currently standing in. When you leave, it shows "?". You must remember the numbers and triangulate. One puzzle per day, same for everyone.

The game works and is playable. What's missing is that "one more thing" that makes players WANT to come back and do better — the itch to get it right. Think about what makes Wordle sticky: the color-coded grid you share, the streak counter, the constraint of one chance per day. Dungeon Echo has streaks and sharing already, but it's missing a visceral sense of "how well did I do?" and "I can do better tomorrow."

## Agent Team

Create an agent team with these 4 teammates. Use Sonnet for each. Require plan approval before any teammate makes changes.

### 1. "game-designer" — Game Designer / Quest Designer

Research the current game mechanics (`dungeonGenerator.ts`, `useGame.ts`, `types/index.ts`, `pathfinding.ts`) and the psychology of what makes daily puzzles sticky. Propose 1-2 SMALL, surgical additions that create the "I want to get it right" feeling without ruining the elegant simplicity. Think about things like:

- A rating/grade for your performance (not just "X over par" — something that FEELS good or stings a little)
- A way to make the memory mechanic more rewarding (the "echo" is the whole game — lean into it)
- A subtle reason to care about efficiency beyond just the number

**Constraint:** Do NOT propose major new features, game modes, or mechanics. The game should still be completable in under 2 minutes. Output a short design doc with exactly what to add, why it works psychologically, and which files need to change.

**Owns:** Design doc only — no code changes.

### 2. "ui-designer" — UI/UX Designer

After the game-designer shares their proposals, review the current UI (`Game.tsx`, `Room.tsx`, `DungeonMap.tsx`, `ShareModal.tsx`, `Stats.tsx`, `index.css`) and design the visual/interaction treatment for the approved changes. Focus on:

- How the new element feels moment-to-moment (micro-interactions, transitions)
- The share experience — the emoji grid people post should make others curious
- The end-of-game moment — right now it's flat. Make finding the treasure feel like an achievement, and barely-missing-par feel like "so close!"
- Color, motion, and timing that reinforce the dungeon atmosphere

**Output:** Specific CSS/component specs the frontend dev can implement. Reference exact files and what changes where.

**Owns:** Design specs only — no code changes.

### 3. "frontend-dev" — Senior Frontend Developer

Implement the changes designed by game-designer and ui-designer. You own all code changes. The stack is React 19 + Vite 7 + Tailwind CSS 4 + TypeScript.

**Key constraints:**

- Keep bundle size minimal — no new dependencies
- All state changes go through `useGame.ts` or `useStats.ts` hooks
- The dungeon generator (`dungeonGenerator.ts`) uses seeded RNG — if you touch it, every daily puzzle changes, so be very careful
- SVG rendering is in `DungeonMap.tsx`/`Room.tsx`/`Door.tsx` — maintain the coordinate system
- Animations should use CSS only (no animation libraries)

**Owns:** All source files in `src/`. Coordinate with game-designer and ui-designer before writing code.

### 4. "tester" — QA / Testing Specialist

After frontend-dev implements changes, verify everything works:

- Run `npm run build` — must compile clean
- Run `npm run test` — all existing tests must pass
- Run `npm run lint` — no lint errors
- Verify the seeded dungeon generator still produces identical output for the same date (determinism is critical — test with specific date strings)
- Check that localStorage stats/streaks still work correctly
- Review the share text output for correctness
- Check the new features actually work as designed

If anything breaks, message frontend-dev with specific details. Create new test cases for any new functionality.

**Owns:** Test files (`*test.ts`) and verification.

## Coordination Rules

1. **game-designer** goes first. Once they share their design doc, **ui-designer** begins.
2. **frontend-dev** waits for BOTH game-designer and ui-designer before coding.
3. **tester** waits for frontend-dev to finish before verifying.
4. All teammates should message each other directly to discuss trade-offs.
5. Keep the total change small. If in doubt, do less. The game's simplicity IS the product.
6. Wait for all teammates to complete their tasks before proceeding.
