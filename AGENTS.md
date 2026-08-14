# Pocketly Agent Rules

## Scope

UI/UX only. Local mock state via Zustand. No backend, APIs, auth, database, or real shake sensors.

## Design

- Follow tokens in `src/styles/tokens.css` and specs in `docs/01-DESIGN-SYSTEM.md`.
- Single accent: coral `#E85D4C`.
- Typography: Plus Jakarta Sans (UI), Fraunces (greeting + speech).
- Compose screens from shared components in `docs/04-COMPONENTS.md`.

## Mascot

- Name: **Pip**
- Moods: `happy`, `neutral`, `concerned`, `tired`, `celebrating`
- Original SVG only — no stock icons or emoji as the mascot body.

## Do not

- Add API calls, auth flows, or persistence layers.
- Use Tailwind or generic shadcn defaults without matching Pocketly tokens.
- Invent new routes beyond those in `docs/00-OVERVIEW.md`.
- Implement real accelerometer / DeviceMotion listeners.

## Do

- Keep mobile-first layout (430px max content width).
- Wire complete flow: capture task → schedule → view → shake → complete → mascot reacts.
- Cover empty, overdue, deadline-soon, completed, and celebration states.
