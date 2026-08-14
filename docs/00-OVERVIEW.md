# Pocketly — Overview

## What it is

Pocketly is a mobile-first productivity app that helps users quickly **capture tasks**, **schedule them**, see **what's next**, and **complete tasks** with a future shake-phone interaction. A companion mascot (**Pip**) has health, mood, and streaks tied to productivity.

## Core loop

```
CAPTURE → SCHEDULE → DO → SHAKE → COMPLETE → MASCOT REACTS
```

1. **Capture** — Quick Capture bottom sheet adds a task with date, time, priority.
2. **Schedule** — Task appears on Today list and Calendar.
3. **Do** — Next Up card + Task Details show countdown and priority.
4. **Shake** — Shake Complete screen (simulated on web).
5. **Complete** — Task marked done, +5 health, streak maintained.
6. **Mascot reacts** — Pip celebrates; speech bubble updates on Home.

## Routes

| Route | Screen | Nav |
|---|---|---|
| `/` | Home / Today | Today tab |
| `/calendar` | Calendar | Calendar tab |
| `/companion` | Companion | Companion tab |
| `/tasks/:id` | Task Details | pushed |
| `/progress` | Progress | pushed from Companion |
| `/shake/:id` | Shake Complete | pushed from Task Details |

**Quick Capture** opens as a bottom sheet from the `+` FAB — not a route.

## Non-goals

- Backend, APIs, auth, database
- Real shake / accelerometer sensors
- PWA install, push notifications, accounts

## Style keywords

Minimal, premium, friendly, playful but not childish. Soft background, dark text, one accent color, rounded cards, subtle shadows, clean typography.
