# What Was Added (2026-02-05)

## Summary

Two features were added to improve the **post-game experience**. Neither changes how the game is actually played.

---

## Feature 1: Echo Rating (S/A/B/C/D Letter Grades)

After finding the treasure, you now see a big letter grade instead of just "X over par":

| Grade | Name | Condition |
|-------|------|-----------|
| S | Silent Steps | Under par |
| A | Sharp Echo | Exactly par |
| B | Clear Echo | 1-2 over par |
| C | Fading Echo | 3-4 over par |
| D | Lost Echo | 5+ over par |

- Large animated grade letter with tier-specific colors and glow
- Themed name displayed below the grade
- Tiered confetti celebrations (S gets 12 particles, A gets 8, B gets 4, C/D get none)
- Context messages ("So close! Just 2 steps off." for B-rank)
- Grade distribution tracked in Stats modal as a bar chart

**Psychological intent:** Letter grades feel more emotional than numbers. Getting a "C" stings more than "+3 over par." Getting an "S" feels aspirational. The idea is you see a B and think "I can get an A tomorrow."

## Feature 2: Echo Count

The result screen now shows "Echoes: N" — the number of unique rooms where you read a distance number. This is `visitedRoomIds.size`, which already existed in the code but was never shown to the player.

**Psychological intent:** Makes the memory skill visible. A player who backtracks to re-read distances gets a higher echo count than one who remembers. "I only needed 3 echoes!" becomes a brag.

## Visual Polish

- Distance number animates in when entering a room (subtle 300ms scale-in)
- Golden ripple pulse when finding the treasure room
- Win modal slides up instead of appearing instantly
- "Treasure Found!" text fades in with delay
- Room hover glow effect

## Share Text

Before:
```
🏰 Dungeon Echo #42
[emoji grid]
6 moves (Par: 5) — 1 over par
```

After:
```
Dungeon Echo #42
[emoji grid]
Rating: B - Clear Echo 🔮
6 moves (Par: 5) | Echoes: 5
```

## Files Changed (8)

- `src/types/index.ts` — EchoRating type + ratingCounts in Stats
- `src/index.css` — Grade color variables + 9 CSS keyframes
- `src/utils/sharing.ts` — getEchoRating() + updated share text format
- `src/hooks/useStats.ts` — Rating distribution tracking with migration
- `src/components/Game.tsx` — Echo count prop + win animation delays
- `src/components/ShareModal.tsx` — Full redesign with grades + tiered confetti
- `src/components/Room.tsx` — Distance reveal + treasure pulse + hover
- `src/components/Stats.tsx` — Rating distribution bar chart

## New Tests

- `src/utils/sharing.test.ts` — 28 tests covering rating boundaries, share text format, emoji grid
- Total: 70 tests (42 existing + 28 new)

---

## What This Did NOT Change

- **Zero gameplay changes.** The dungeon, movement, distance hints, memory mechanic — all identical.
- **No new decisions for the player during the game.** You still navigate rooms and remember numbers exactly the same way.
- **No new information shown during play.** The echo count is only revealed after winning.
- **The core loop is untouched.** These are all post-game presentation improvements.
