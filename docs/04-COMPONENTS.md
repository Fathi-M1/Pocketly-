# Components

## AppShell

Wraps all routes. Provides max-width container, bottom padding for nav, renders BottomNav + children.

```tsx
<AppShell>{children}</AppShell>
```

## BottomNav

4 items: Today, Calendar, + (FAB center), Companion.
Active tab: accent color + bold label.
`+` triggers `onCaptureOpen` callback, not navigation.

## Mascot

```tsx
<Mascot size="sm" | "md" | "lg" mood="happy" | "neutral" | "concerned" | "tired" | "celebrating" />
```

SVG component with mood-specific paths.

## SpeechBubble

```tsx
<SpeechBubble>{message}</SpeechBubble>
```

White card, small tail pointing toward mascot, Fraunces font.

## StatChip

```tsx
<StatChip icon="❤️" value={72} label="Health" />
```

Inline pill for health/streak.

## TaskCard

```tsx
<TaskCard task={task} onClick={() => navigate(`/tasks/${task.id}`)} />
```

Shows title, due time, PriorityChip, status chip. Variants via task state.

## TaskList

```tsx
<TaskList tasks={tasks} emptyMessage="..." />
```

Maps TaskCard with spacing.

## PriorityChip

```tsx
<PriorityChip priority="low" | "medium" | "high" />
```

Low=muted, Med=accent outline, High=accent fill.

## Countdown

```tsx
<Countdown dueAt={Date} />
```

Live updating "2h 14m" or "Overdue by 1h" format. Updates every 60s.

## QuickCaptureSheet

```tsx
<QuickCaptureSheet
  open={boolean}
  onClose={() => void}
  editTask?: Task | null
/>
```

Bottom sheet with form. Prefill when editing.

## MonthCalendar

```tsx
<MonthCalendar
  selectedDate={Date}
  onSelectDate={(d) => void}
  taskDates={Date[]}
/>
```

## DayTimeline

```tsx
<DayTimeline date={Date} tasks={Task[]} />
```

## HealthBar

```tsx
<HealthBar value={0-100} />
```

Horizontal bar, accent fill.

## StreakBadge

```tsx
<StreakBadge count={number} />
```

Fire + count pill.

## WeeklyActivity

```tsx
<WeeklyActivity data={[{ day: string, count: number }]} />
```

7 bars, accent fill.

## EmptyState

```tsx
<EmptyState title="..." description="..." />
```

Centered muted text + optional small Pip sm.

## CelebrationBurst

```tsx
<CelebrationBurst active={boolean} />
```

Confetti dots animation overlay (framer-motion).
