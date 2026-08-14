# Mascot — Pip

## Character

**Pip** is a soft, round cream creature with tiny stubby arms, two-dot eyes, a simple mouth, coral cheek dots, and a small stitched "pocket" on the belly. Original SVG — not a stock icon.

## Anatomy (SVG layers)

1. Body — cream ellipse `#F5E6D3`, soft shadow
2. Cheeks — coral dots `#E85D4C` at 40% opacity
3. Eyes — two dark dots `#1C1917`
4. Mouth — simple stroke path, varies by mood
5. Pocket — small rounded rect on belly, dashed stitch lines
6. Arms — two stubby rounded rects, angle varies by mood

## Sizes

| Prop | Width | Height |
|---|---|---|
| `sm` | 48px | 56px |
| `md` | 80px | 96px |
| `lg` | 140px | 168px |

## Moods

### happy
- Eyes: normal dots, slight upward curve implied
- Mouth: gentle smile (upward arc)
- Arms: slightly raised
- Optional: tiny sparkle near head

### neutral
- Eyes: normal dots
- Mouth: flat line
- Arms: at sides

### concerned
- Eyes: slightly smaller, angled inward
- Mouth: small wavy frown
- Arms: clasped or pulled in
- Optional: small sweat drop

### tired
- Eyes: half-closed (horizontal lines)
- Mouth: small open yawn or flat droop
- Arms: drooping down
- Optional: Zzz bubble (small, subtle)

### celebrating
- Eyes: closed happy arcs (^_^ style)
- Mouth: wide open smile
- Arms: raised high
- Optional: confetti dots around body (accent + success colors)

## Health & streak display

- **Health:** heart icon + numeric `0–100`, bar fill proportional
- **Streak:** fire emoji + day count
- Complete task: `+5` health (cap 100)

## Mood derivation (from store)

| Condition | Mood |
|---|---|
| `justCompleted === true` | celebrating |
| `health < 20` | tired |
| any overdue tasks OR `health < 40` | concerned |
| `health >= 70` AND no overdue | happy |
| else | neutral |

## Speech lines (examples)

| Mood | Example |
|---|---|
| happy | "You're on a roll — let's keep it going!" |
| neutral | "One thing at a time. You've got this." |
| concerned | "A few tasks need attention. I'm here." |
| tired | "Rest helps too. Maybe tackle one small win?" |
| celebrating | "Yes! That felt great!" |
| after capture | "Got it — I'll keep this close." |
