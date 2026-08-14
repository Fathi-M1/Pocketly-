# Screens

## Home / Today (`/`)

### Header
- Greeting: "Good {morning|afternoon|evening}, {name}" (Fraunces)
- Date: full formatted date below greeting (muted)

### Mascot row
- Pip `sm` + StatChips: ❤️ health number, 🔥 streak number
- SpeechBubble with mood-based message

### Next Up card
- Label: "Next Up"
- Nearest incomplete task title
- Due time + live Countdown
- Tap → Task Details
- If no tasks: show muted "Nothing scheduled — capture something?"

### Today list
- Label: "Today"
- TaskCard list sorted by due time
- States: default, overdue (red chip), due-soon ≤2h (amber chip), completed (green, strikethrough)
- Empty: EmptyState "No tasks for today" + hint to tap +

### FAB
- Coral circle + icon, opens Quick Capture sheet

---

## Quick Capture (bottom sheet)

- Title: "Quick Capture"
- Fields: task title (required), date picker, time picker, priority (Low / Med / High segmented)
- Primary: "Add Task"
- On submit: add task, close sheet, flash Pip happy line on Home
- Backdrop dismiss + drag handle at top

---

## Calendar (`/calendar`)

- Month header with prev/next arrows
- 7-column grid, current month
- Days with tasks: coral dot below number
- Today: accent ring
- Selected day: accent fill, white text
- Below grid: "Timeline" for selected day
- DayTimeline: task cards with status chips
- Empty day: "No tasks on this day"

---

## Task Details (`/tasks/:id`)

- Back button
- Title (large)
- Deadline row: date + time
- Countdown (prominent if incomplete)
- PriorityChip
- Status chip if overdue / due-soon / completed
- Actions:
  - **Complete** → navigate `/shake/:id` (hidden if already completed)
  - **Edit** → open Quick Capture sheet prefilled
  - **Delete** → confirm dialog, then navigate back

---

## Companion (`/companion`)

- Large Pip `lg` centered
- Mood label (capitalized)
- HealthBar + ❤️ numeric
- StreakBadge 🔥
- Status paragraph from mood
- Link/button: "View Progress" → `/progress`

---

## Progress (`/progress`)

- Back button
- Stat cards row: streak, health, completion rate
- Completed vs missed counts
- WeeklyActivity: 7 vertical bars (Mon–Sun), height = tasks completed that day
- Computed from seed + store (no live sync)

---

## Shake Complete (`/shake/:id`)

### Phase 1 — waiting
- Full screen, centered
- Large text: "SHAKE TO COMPLETE"
- Pip `md` neutral/waiting
- Button: "Simulate shake"
- Subtle pulse animation on text

### Phase 2 — success (after simulate)
- "Task complete +5 ❤️"
- "🔥 Streak maintained"
- Pip → celebrating
- CelebrationBurst overlay
- Auto-navigate to `/` after ~2.2s

---

## State matrix

| State | Visual |
|---|---|
| Empty | EmptyState component, muted illustration area |
| Overdue | Red "Overdue" chip, danger accent on countdown |
| Due soon (≤2h) | Amber "Soon" chip |
| Completed | Green chip, strikethrough title, muted |
| Celebration | CelebrationBurst + celebrating Pip |
