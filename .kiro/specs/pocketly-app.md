# Pocketly — Feature Spec

## Overview
Pocketly is a gamified task-management mobile web app. Users complete tasks, earn XP, and keep their companion (Pocky the cat) healthy and happy.

## Core Features

### 1. Today Screen
- Shows tasks due today sorted by priority
- "Next Up" card highlights the single most urgent pending task
- Quick-add FAB opens the capture modal

### 2. Calendar Screen
- Monthly calendar view with task density indicators
- Tap a date to see tasks for that day
- Long-tap (or "+" button) opens quick-add for that date

### 3. Companion Screen (Pocky)
- Mood system: happy / thinking / concerned / tired / celebrating
- Health bar (0–100%) increases +5 per completed task
- XP + level-up system: 45 XP per task, threshold doubles each level
- Streak counter: consecutive days with at least one completed task

### 4. Shake-to-Complete
- Triggered from Next Up card or task detail
- Device motion API or button simulation
- Full-screen celebration with confetti on success

### 5. Quick Capture Modal
- Title, date, time, priority (low / medium / high / urgent)
- Persists to localStorage

## Tech Stack
- React 19 + TypeScript
- Tailwind CSS v4 (Vite plugin)
- Framer Motion (motion/react)
- Vite 6
- canvas-confetti for celebrations

## Sponsored By
- **RevenueCat** — in-app subscription infrastructure powering the future monetization layer of Pocketly
