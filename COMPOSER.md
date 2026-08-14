# Pocketly — Composer Brief

Build the **UI/UX only** for Pocketly. Follow the docs in `docs/` — do not invent new routes, colors, or features.

## Read order

1. [docs/00-OVERVIEW.md](docs/00-OVERVIEW.md) — product + core loop
2. [docs/01-DESIGN-SYSTEM.md](docs/01-DESIGN-SYSTEM.md) — tokens, typography, spacing
3. [docs/02-MASCOT.md](docs/02-MASCOT.md) — Pip SVG moods
4. [docs/03-SCREENS.md](docs/03-SCREENS.md) — every screen layout + copy
5. [docs/04-COMPONENTS.md](docs/04-COMPONENTS.md) — reusable component API
6. [docs/05-STATE.md](docs/05-STATE.md) — types, store, seed data
7. [docs/06-IMPLEMENTATION.md](docs/06-IMPLEMENTATION.md) — file tree + build order

## Hard rules

- **No backend, APIs, auth, database, or sensors.**
- Shake-to-complete is a **scripted UI sequence** (simulate button), not DeviceMotion.
- Use **CSS custom properties** from `src/styles/tokens.css` + CSS Modules.
- Single accent color: coral `#E85D4C`.
- Mascot name is **Pip** — original SVG, 5 moods only.
- Mobile-first, max width 430px, bottom nav on primary tabs.

## Core flow (must work end-to-end)

**CAPTURE → SCHEDULE → DO → SHAKE → COMPLETE → MASCOT REACTS**
