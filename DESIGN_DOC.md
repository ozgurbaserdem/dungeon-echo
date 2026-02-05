# Dungeon Echo - Stickiness Design Doc

## Problem

The game works and is playable, but lacks the "one more thing" that makes players want to come back and do better. The result screen says "X over par" -- factually correct but emotionally flat. The core memory mechanic (the "echo") is invisible in the results. There is no shorthand players can share that sparks conversation.

## Current State

- Player navigates a procedurally-generated dungeon to find treasure using distance hints
- Core mechanic: you only see distance-to-treasure in the room you're standing in; all other rooms show "?"
- Performance is measured as moves vs par (optimal shortest path, typically 4-6)
- Stats track: games played/won, streak, average moves, last 30 move counts
- Share text shows an emoji grid + "X moves (Par: Y)" -- functional but not emotional

## Proposal 1: Echo Rating (Letter Grade System)

### What

After finding treasure, assign a letter grade based on moves relative to par. Display it prominently in the result modal and share text.

| Grade | Name           | Condition     |
|-------|----------------|---------------|
| S     | Silent Steps   | Under par     |
| A     | Sharp Echo     | Exactly par   |
| B     | Clear Echo     | 1-2 over par  |
| C     | Fading Echo    | 3-4 over par  |
| D     | Lost Echo      | 5+ over par   |

### Why It Works

- **Letter grades are emotionally loaded.** Everyone has a visceral reaction to getting a C vs an A. "3 over par" is just math; "Fading Echo" stings.
- **S-rank is aspirational.** Borrowed from Japanese game grading, "S" is the trophy tier. Players who get A will wonder "could I have gotten S?" -- that question alone drives replay intent for tomorrow's puzzle.
- **Themed names reinforce brand.** "Silent Steps" and "Sharp Echo" are memorable and shareable. They turn the rating into a story, not just a score.
- **Categorical compression aids sharing.** "I got an S!" is a better conversation starter than "I was 1 under par!" The grade is a hook; the details follow.

### Share Text Example

```
Dungeon Echo #42

[emoji grid]

Rating: S - Silent Steps
5 moves (Par: 6) | Echoes: 5

dungeonecho.game
```

### Files to Change

- `src/types/index.ts` -- Add `EchoRating` type (grade + name + emoji)
- `src/utils/sharing.ts` -- Add `getEchoRating(moves, par)` function; update `generateShareText()` to include rating
- `src/components/ShareModal.tsx` -- Display grade prominently with themed name; style by grade tier
- `src/hooks/useStats.ts` -- Track rating distribution alongside move history (count of S/A/B/C/D)
- `src/components/Stats.tsx` -- Show rating distribution bar in stats modal

## Proposal 2: Echo Count (Surface the Memory Skill)

### What

Display "Echoes: N" in the result screen -- the number of unique rooms where the player saw a distance reading. This is simply `visitedRoomIds.size` which already exists in game state. No new tracking needed.

The framing: each room visit where you read a distance number is one "echo." Fewer echoes means you triangulated from less information -- you relied on memory, not re-checking.

### Why It Works

- **Makes the invisible skill visible.** The entire game is about remembering distances, but that skill is never surfaced in results. A player who backtracks to re-read a distance and one who remembers perfectly look the same if they end with equal move counts. Echo count differentiates them.
- **Creates a secondary optimization axis.** Beyond "fewer moves," players now think about "fewer readings." This is a deeper layer of mastery that doesn't add complexity -- just awareness.
- **Gentle pressure to trust memory.** Seeing "Echoes: 8" when you won in 6 moves reveals you re-checked rooms. Next time you'll try to trust your memory more. That's the "echo" mechanic being rewarded.
- **Zero implementation cost.** `visitedRoomIds.size` already captures this. This is purely a presentation/framing change on existing data.
- **Shareable.** "I only needed 3 echoes!" becomes a brag that showcases the game's unique mechanic.

### Files to Change

- `src/components/ShareModal.tsx` -- Show echo count in result display
- `src/utils/sharing.ts` -- Include echo count in share text
- `src/components/Game.tsx` -- Pass `visitedRoomIds.size` to ShareModal (trivial prop addition)

## What NOT to Do

- No new game modes or mechanics
- No changes to dungeon generation or difficulty
- No timers, leaderboards, or competitive features
- No changes to the core gameplay loop
- The game must remain completable in under 2 minutes

## Summary of All File Changes

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `EchoRating` type |
| `src/utils/sharing.ts` | Add `getEchoRating()`, update share text with rating + echoes |
| `src/components/ShareModal.tsx` | Display grade + themed name + echo count |
| `src/components/Game.tsx` | Pass echo count to ShareModal |
| `src/hooks/useStats.ts` | Track rating distribution |
| `src/components/Stats.tsx` | Show rating distribution |
