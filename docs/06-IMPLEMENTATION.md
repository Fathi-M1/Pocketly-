# Implementation Guide

## Stack

```
vite + react + typescript
react-router-dom
zustand
framer-motion
lucide-react
date-fns
```

Styling: CSS Modules + `src/styles/tokens.css`

## File tree

```
Pocketly/
├── docs/               # specs (this folder)
├── COMPOSER.md
├── AGENTS.md
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/
    │   ├── tokens.css
    │   ├── global.css
    │   └── reset.css
    ├── types/
    │   └── index.ts
    ├── store/
    │   ├── usePocketly.ts
    │   └── seed.ts
    ├── utils/
    │   ├── dates.ts
    │   ├── greeting.ts
    │   └── taskStatus.ts
    ├── components/
    │   ├── AppShell/
    │   ├── BottomNav/
    │   ├── Mascot/
    │   ├── SpeechBubble/
    │   ├── StatChip/
    │   ├── TaskCard/
    │   ├── TaskList/
    │   ├── PriorityChip/
    │   ├── Countdown/
    │   ├── QuickCaptureSheet/
    │   ├── MonthCalendar/
    │   ├── DayTimeline/
    │   ├── HealthBar/
    │   ├── StreakBadge/
    │   ├── WeeklyActivity/
    │   ├── EmptyState/
    │   └── CelebrationBurst/
    └── pages/
        ├── Home/
        ├── Calendar/
        ├── TaskDetails/
        ├── Companion/
        ├── Progress/
        └── ShakeComplete/
```

## Build order

1. Scaffold Vite, install deps, tokens + global CSS
2. Types, seed, Zustand store
3. Mascot SVG (5 moods)
4. AppShell + BottomNav + Router
5. Shared components (chips, cards, countdown)
6. Pages: Home → Capture → Calendar → Details → Companion → Progress → Shake
7. Wire complete/edit/delete + mascot reactions
8. Polish: animations, empty states, responsive check

## Commands

```bash
npm install
npm run dev
npm run build
```

## Fonts (index.html)

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```
