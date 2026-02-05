# Dungeon Echo - UI/Interaction Spec

This spec covers the visual and interaction treatment for the two proposals in DESIGN_DOC.md: **Echo Rating** (letter grades) and **Echo Count** (memory skill metric). It also addresses the end-of-game moment, share experience, and micro-interactions.

All animations are CSS-only. No animation libraries.

---

## 1. Color System for Echo Ratings

Each grade has a distinct color identity used consistently across the share modal, stats, and share text.

| Grade | Color Name    | Hex Value | CSS Variable          | Emoji |
|-------|---------------|-----------|-----------------------|-------|
| S     | Legendary Gold| `#ffd700` | `--grade-s`           | `✨`  |
| A     | Bright Gold   | `#f0c040` | `--grade-a`           | `⚡`  |
| B     | Silver         | `#a8b4c0` | `--grade-b`           | `🔮`  |
| C     | Dim Bronze    | `#8a7060` | `--grade-c`           | `🕯️`  |
| D     | Faded Gray    | `#606068` | `--grade-d`           | `💀`  |

**File: `src/index.css`** -- Add these as CSS custom properties under `:root`.

---

## 2. Share Modal Redesign

**File: `src/components/ShareModal.tsx`**

### 2a. Layout (top to bottom)

1. **Grade Letter** -- Large, centered, single character
2. **Grade Name** -- Themed subtitle (e.g., "Silent Steps")
3. **Stats Row** -- Moves, Par, and Echoes in a horizontal row
4. **Emoji Grid** -- The dungeon map visualization
5. **Action Buttons** -- Share / Close

### 2b. Grade Letter Display

- Font size: `text-7xl` (72px equivalent)
- Font weight: `font-bold`
- Font family: `'Courier New', monospace` (consistent with game)
- Color: Use the grade's color variable
- The letter should have a `text-shadow` glow matching its grade color:
  - S: `0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)`
  - A: `0 0 15px rgba(240, 192, 64, 0.5), 0 0 30px rgba(240, 192, 64, 0.2)`
  - B: `0 0 10px rgba(168, 180, 192, 0.4)`
  - C/D: no text-shadow
- Animation on appear: use the `grade-reveal` keyframe (see Section 6)

### 2c. Grade Name Display

- Positioned directly below the grade letter, `mt-1`
- Font size: `text-lg`
- Color: same as grade color but at 80% opacity
- Text transform: uppercase, `tracking-widest` (letter-spacing)
- Example: "SILENT STEPS", "SHARP ECHO", "CLEAR ECHO", "FADING ECHO", "LOST ECHO"

### 2d. Stats Row

Replace the current result message with a three-column stats row:

```
   MOVES        PAR        ECHOES
     5           6            4
```

- Container: `flex items-center justify-center gap-6`, same style as the in-game stats row in Game.tsx (lines 93-108)
- Each stat: label on top (`text-xs text-[#a0a0b0] uppercase`), value below (`text-2xl font-bold`)
- MOVES value color: use the grade color
- PAR value color: `text-[#a0a0b0]`
- ECHOES value color: `text-[#a0a0b0]`, BUT if echoes <= moves (no backtracking), color it `text-[#ffd700]` as a subtle reward
- Dividers: `w-px h-10 bg-[#4a4a6a]` between each stat (matches existing Game.tsx dividers)

### 2e. Emoji Grid

- Keep existing grid rendering
- Add a `mb-4 mt-4` spacing
- Background container: `bg-[#1a1a2e] rounded p-4 font-mono text-lg leading-relaxed` (keep current)

### 2f. Tiered Celebration (replaces current confetti)

Replace the random bouncing emoji confetti with grade-appropriate celebrations:

**S-rank:**
- 12 gold sparkle particles (`✨`) using `confetti-fall` keyframe
- Particles start above the modal, drift down with slight horizontal sway
- Duration: 2.5s, staggered delays (0 to 0.8s)
- After particles finish, the grade letter gets a persistent subtle `shimmer` animation

**A-rank:**
- 8 sparkle particles (`⚡✨`) using same `confetti-fall` keyframe
- Duration: 2s, staggered delays (0 to 0.5s)
- No persistent shimmer

**B-rank:**
- 4 subtle particles (`🔮`) using `confetti-fall` but slower (3s)
- Muted, calm celebration

**C-rank and D-rank:**
- No particle effects
- Modal fades in cleanly with just the grade reveal animation
- The grade color and name communicate the result

### 2g. "So Close" Messaging

Below the stats row, add a single-line contextual message:

| Grade | Message |
|-------|---------|
| S     | *(no message -- the grade speaks for itself)* |
| A     | `"Perfect navigation."` |
| B     | `"So close! Just ${n} step${n>1?'s':''} off."` |
| C     | `"The echoes faded..."` |
| D     | `"Lost in the dark."` |

- Font size: `text-sm`
- Color: `text-[#a0a0b0]`
- Italic style
- `mt-2 mb-4` spacing
- For B-rank specifically, the message should use `text-[#c0a070]` (warm amber) to create a "near miss" emotional tone

---

## 3. Share Text Format

**File: `src/utils/sharing.ts`**

Update `generateShareText()` output to:

```
Dungeon Echo #42

[emoji grid]

Rating: S - Silent Steps ✨
5 moves (Par: 6) | Echoes: 4

dungeonecho.game
```

- The rating line uses the grade emoji from the color table in Section 1
- "Echoes: N" appended to the moves/par line with a pipe separator
- This format is compact enough for Twitter/Mastodon and curiosity-provoking: "What's an Echo Rating? What are Echoes?"

---

## 4. Stats Modal - Rating Distribution

**File: `src/components/Stats.tsx`**

### 4a. New Section: "Echo Ratings"

Add below the "Average Moves" section, before "Recent Games":

- Section header: `"Echo Ratings"` -- same style as other section headers (`text-[#a0a0b0] text-sm mb-2 text-center`)
- Show a horizontal bar for each grade (S, A, B, C, D)
- Container: `bg-[#1a1a2e] rounded p-4 mb-6`

### 4b. Bar Design

Each row in the distribution:

```
S  ████████  3
A  ████       2
B  ██          1
C
D
```

- Left label: grade letter, `w-6 text-right font-bold`, colored with grade color
- Bar: `h-5 rounded-sm`, colored with grade color, width proportional to count (percentage of total games)
  - Minimum width when count > 0: `min-w-[8px]`
  - Use inline style for width: `width: ${(count / maxCount) * 100}%` where maxCount is the highest bar
- Right count: `w-8 text-left text-sm text-[#a0a0b0]`, only shown if count > 0
- Row layout: `flex items-center gap-2 mb-1`
- If no games played yet, show `text-[#606068] text-sm text-center`: "Play to see your ratings"

---

## 5. In-Game Micro-interactions

### 5a. Room Entry Transition

**File: `src/components/Room.tsx`**

When the player enters a new room (isCurrent becomes true), the distance number should animate in:

- Apply CSS class `distance-reveal` to the distance `<text>` element when `isCurrent` is true
- Animation: scale from 0.5 to 1.0, opacity from 0 to 1, over 300ms with `ease-out`
- This makes each room entry feel like a "reading" moment -- you're discovering the echo

### 5b. Room Hover Enhancement

**File: `src/components/Room.tsx`**

For clickable (adjacent) rooms on hover:

- Change the existing hover overlay from `opacity-0` / `hover:opacity-30` to using a CSS class `room-hover` that transitions stroke color to `#ffd700` at 40% opacity over 150ms
- This is more visible than the current near-invisible hover state

### 5c. Treasure Discovery Pulse

**File: `src/components/Room.tsx`**, **`src/index.css`**

When the treasure room is entered (`isTreasure && isCurrent`):

- Apply class `treasure-found` to the room `<g>` element
- Animation: two concentric golden ring pulses that expand outward from the room and fade
- Implemented as a `<circle>` SVG element with `treasure-pulse` keyframe: radius grows from room size to 3x room size, opacity fades from 0.6 to 0, over 800ms
- Add two circles with 200ms stagger for a ripple effect
- The treasure emoji already exists; keep it, but add the `torch-glow` class to it for the flicker effect

### 5d. Win State in Game Area

**File: `src/components/Game.tsx`**

When `hasWon` is true, the game info area (lines 80-112) currently shows "Treasure Found!" immediately. Change to:

- Delay the text appearance by 600ms (let the treasure-pulse animation play first)
- "Treasure Found!" text uses `win-text-reveal` keyframe: slides up 10px and fades in over 400ms
- The "Share Result" button appears 200ms after the text (total 800ms delay from win)

---

## 6. CSS Keyframes

**File: `src/index.css`** -- Add all of these:

### grade-reveal
```css
@keyframes grade-reveal {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.grade-reveal {
  animation: grade-reveal 0.5s ease-out forwards;
}
```

### shimmer (S-rank persistent glow)
```css
@keyframes shimmer {
  0%, 100% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3);
  }
  50% {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4);
  }
}

.grade-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
```

### confetti-fall (celebration particles)
```css
@keyframes confetti-fall {
  0% {
    transform: translateY(-20px) scale(0);
    opacity: 0;
  }
  15% {
    transform: translateY(0px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(120px) translateX(var(--drift, 10px)) scale(0.5);
    opacity: 0;
  }
}

.confetti-particle {
  position: absolute;
  top: 0;
  animation: confetti-fall var(--duration, 2s) ease-out forwards;
  animation-delay: var(--delay, 0s);
  pointer-events: none;
  font-size: 1.5rem;
}
```

Use CSS custom properties `--drift`, `--duration`, `--delay` set via inline styles on each particle to vary their paths. Drift values should alternate between -20px and 20px.

### distance-reveal (room entry)
```css
@keyframes distance-reveal {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.distance-reveal {
  animation: distance-reveal 0.3s ease-out forwards;
}
```

### treasure-pulse (treasure discovery ripple)
```css
@keyframes treasure-pulse {
  0% {
    r: 30;
    opacity: 0.6;
    stroke-width: 3;
  }
  100% {
    r: 90;
    opacity: 0;
    stroke-width: 1;
  }
}

.treasure-pulse {
  fill: none;
  stroke: #ffd700;
  animation: treasure-pulse 0.8s ease-out forwards;
}

.treasure-pulse-delayed {
  fill: none;
  stroke: #ffd700;
  animation: treasure-pulse 0.8s ease-out 0.2s forwards;
  opacity: 0;
}
```

### win-text-reveal
```css
@keyframes win-text-reveal {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.win-text-reveal {
  opacity: 0;
  animation: win-text-reveal 0.4s ease-out 0.6s forwards;
}

.win-button-reveal {
  opacity: 0;
  animation: win-text-reveal 0.4s ease-out 0.8s forwards;
}
```

### modal-enter (share modal entrance)
```css
@keyframes modal-enter {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-enter {
  animation: modal-enter 0.3s ease-out forwards;
}
```

### room-hover
```css
.room-hover {
  transition: opacity 0.15s ease;
  opacity: 0;
}

.room-hover:hover {
  opacity: 0.4;
}
```

---

## 7. Modal Entrance

**File: `src/components/ShareModal.tsx`**

The modal content container (the `bg-[#2d2d44]` div) should use the `modal-enter` class so it slides up on open instead of appearing instantly. The backdrop (`bg-black/80`) fades in via a simple `transition-opacity` over 200ms.

---

## 8. Summary of Changes by File

| File | Changes |
|------|---------|
| **`src/index.css`** | Add grade color CSS variables. Add keyframes: `grade-reveal`, `shimmer`, `confetti-fall`, `distance-reveal`, `treasure-pulse`, `win-text-reveal`, `modal-enter`. Add utility classes for each. |
| **`src/components/ShareModal.tsx`** | Redesign layout per Section 2. Large grade letter with grade-reveal animation. Themed name subtitle. Three-column stats row (moves/par/echoes). Tiered confetti per Section 2f. Context message per Section 2g. Modal entrance animation. |
| **`src/components/Room.tsx`** | Add `distance-reveal` class to current room distance text. Add treasure pulse circles when `isTreasure && isCurrent`. Improve hover state with `room-hover` class. |
| **`src/components/Game.tsx`** | Pass `echoCount` (visitedRoomIds.size) to ShareModal. Add `win-text-reveal` / `win-button-reveal` classes to win state text and button. Increase modal delay from 500ms to 1000ms to let treasure pulse play. |
| **`src/utils/sharing.ts`** | Add `getEchoRating(moves, par)` returning `{ grade, name, emoji }`. Update `generateShareText()` to include rating line and echo count. |
| **`src/types/index.ts`** | Add `EchoRating` type: `{ grade: 'S'\|'A'\|'B'\|'C'\|'D', name: string, emoji: string }`. |
| **`src/hooks/useStats.ts`** | Add `ratingDistribution: Record<string, number>` to Stats type. Update `recordWin()` to also record the rating. |
| **`src/components/Stats.tsx`** | Add "Echo Ratings" section with horizontal bar distribution chart per Section 4. |

---

## Design Principles

- **Simplicity is the product.** Every addition must earn its place. The grade letter does the heavy lifting; everything else supports it.
- **CSS-only animations.** No animation libraries. Keyframes and transitions only.
- **Dungeon atmosphere.** Dark, moody, with gold as the reward color. Muted tones for lower grades reinforce the "lost in darkness" theme.
- **Emotional differentiation.** S-rank should feel legendary. B-rank should feel tantalizingly close. D-rank should feel quiet and humbling, not punishing.
- **Share-first design.** The grade letter and themed name are the hook. "I got an S - Silent Steps" is a complete, shareable sentence.
