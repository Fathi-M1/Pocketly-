# Pocketly 🐾

> **Gamified task management with a living companion** — built for the RevenueCat Ship-a-thon 2025

Pocketly turns your to-do list into a living creature. Every task you complete keeps **Pocky** — your pocket companion — healthy, happy, and levelling up. Skip your work, and watch Pocky get tired.

---

## ✨ Features

### 🗓 Today Screen
Focused view of everything due today. The **Next Up** card surfaces your most urgent pending task so you always know what to do next.

### 📅 Calendar
Monthly view with task density indicators. Tap any day to see its tasks, or tap **+** to add directly to that date.

### 🐱 Pocky — Your Companion
A fully animated mascot with five distinct mood states:

| Mood | Trigger |
|---|---|
| 😊 Happy | Default — streak is healthy |
| ⚙️ Thinking | You have many pending tasks |
| ⏰ Concerned | Urgent/overdue tasks exist |
| 🪫 Tired | Health is critically low |
| 🎉 Celebrating | Task just completed! |

- **Health bar** — increases +5 HP per completed task, decays if you miss work
- **XP + Levels** — earn 45 XP per task; level up to unlock new companion states
- **Streak counter** — tracks consecutive active days
- **Pet Pocky** button — tap for +1 HP and a purr

### 📳 Shake to Complete
The signature feature. Trigger the full-screen shake experience from any task — shake your device (or click the simulator button on desktop) to mark a task done with a confetti burst.

### ⚡ Quick Capture
Bottom-sheet task entry in under 5 seconds. Set title, date, time, and priority.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy as a static site on Vercel, Netlify, or any CDN.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Animations | Framer Motion (`motion/react`) |
| Build | Vite 6 |
| Celebrations | canvas-confetti |
| Persistence | localStorage |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── PockyMascot.tsx        # Animated SVG companion
│   ├── DeviceFrame.tsx        # Desktop simulator shell
│   ├── TodayScreen.tsx        # Main task feed
│   ├── CalendarScreen.tsx     # Monthly calendar view
│   ├── CompanionScreen.tsx    # Pocky stats & mood panel
│   ├── ShakeCompleteModal.tsx # Shake-to-complete experience
│   ├── QuickCaptureModal.tsx  # Fast task entry
│   ├── TaskDetailsModal.tsx   # Full task editor
│   ├── TaskItem.tsx           # Task row component
│   ├── NextUpCard.tsx         # Priority task highlight
│   ├── BottomNavBar.tsx       # Navigation
│   └── TopHeader.tsx          # Screen title bar
├── data/
│   └── initialData.ts        # Seed tasks & companion state
├── types.ts                  # Shared TypeScript interfaces
├── App.tsx                   # Root state & event handlers
└── main.tsx                  # Entry point
.kiro/
├── specs/pocketly-app.md     # Feature specification
└── steering/
    ├── product.md            # Product vision & roadmap
    └── tech.md               # Architecture decisions
```

---

## 💳 Powered by RevenueCat

Pocketly's future monetization layer is designed around **[RevenueCat](https://www.revenuecat.com)** — the industry-standard SDK for in-app subscriptions and purchases.

Planned premium features gated behind a RevenueCat paywall:
- 🎨 Pocky cosmetic skins & accessories
- 📊 Advanced productivity analytics
- ☁️ Cloud sync across devices
- 🔔 Smart push notification reminders

> RevenueCat makes handling subscriptions, restores, and cross-platform receipts trivially easy — the obvious choice for any consumer app with a companion-based premium model.

---

## 🏆 Hackathon Submission

Built for the **RevenueCat Ship-a-thon 2025**.

**By:** Fathi M.

---

## License

MIT
