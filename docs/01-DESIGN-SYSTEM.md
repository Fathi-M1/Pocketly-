# Design System

## Colors

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#F6F3EE` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, sheets |
| `--color-text` | `#1C1917` | Primary text |
| `--color-muted` | `#78716C` | Secondary text, labels |
| `--color-accent` | `#E85D4C` | FAB, primary buttons, hearts, active nav |
| `--color-success` | `#2F9D7A` | Completed chips |
| `--color-warning` | `#D4A017` | Due-soon chips |
| `--color-danger` | `#DC2626` | Overdue chips |
| `--color-border` | `rgba(28,25,23,0.08)` | Dividers, inputs |

## Typography

- **UI:** Plus Jakarta Sans — 400, 500, 600, 700
- **Display / speech:** Fraunces — 500, 600

| Token | Size | Weight | Use |
|---|---|---|---|
| `--text-greeting` | 28px | 600 Fraunces | Home greeting |
| `--text-title` | 20px | 600 | Section headers |
| `--text-body` | 15px | 400 | Body copy |
| `--text-small` | 13px | 500 | Labels, chips |
| `--text-caption` | 12px | 400 | Timestamps |

## Spacing

- Page gutter: `16px` (`--space-page`)
- Card padding: `16px`–`20px`
- Section gap: `24px`
- List item gap: `12px`
- Safe area: `env(safe-area-inset-bottom)` on bottom nav

## Radius

- Cards: `20px`–`24px` (`--radius-card`)
- Inner elements: `8px` (`--radius-sm`)
- Buttons: `12px` (`--radius-btn`)
- FAB: `50%` circle

## Shadows

```css
--shadow-card: 0 8px 24px rgba(28, 25, 23, 0.06);
--shadow-sheet: 0 -4px 32px rgba(28, 25, 23, 0.12);
--shadow-fab: 0 4px 16px rgba(232, 93, 76, 0.35);
```

## Layout

- Max content width: `430px`, centered
- Bottom nav height: `64px` + safe area
- App shell: flex column, min-height 100dvh

## Components chrome

- Cards: white surface, card radius, card shadow, no border (or 1px border on inputs)
- Primary button: accent fill, white text, 48px min height
- Secondary button: transparent, accent border
- Destructive: danger text, no fill
- Inputs: 48px height, 8px radius, subtle border, focus ring accent at 30% opacity
