# Tech Steering — Pocketly

## Stack Decisions
- **React 19** with TypeScript strict mode
- **Tailwind v4** via Vite plugin (no postcss config needed)
- **motion/react** for all animated transitions — do not use CSS keyframes for interactive animations
- **localStorage** for persistence — no backend in v1

## Code Conventions
- Components live in `src/components/`, screens are also components (no separate screens/ dir)
- All data types in `src/types.ts`
- Seed data in `src/data/initialData.ts`
- No external state library — useState + prop drilling is intentional for this scope

## Build & Deploy
- `npm run build` outputs to `dist/`
- Deployed on Vercel as a static SPA
- `vercel.json` rewrites all routes to `index.html`
