# CentWise — Personal Finance Dashboard

CentWise is a modern, responsive, and visual personal finance core application built on top of **React** and **Vite**. It features an obsidian-glassmorphic styling system with smooth transition micro-animations, designed to track expense histories and manage savings targets on the fly.

## Key Features

- 💸 **Transaction Logger**: Record income and expense items quickly. Includes automatic categorization tags.
- 🎯 **Savings Target Goal**: Dynamic visual SVG progress ring to track how close you are to completing a set savings target. Add increments of cash instantly.
- 🔍 **Realtime Search & Filter**: Filter transactions in the ledger history by description or category.
- 🕒 **Active Digital Clock**: Displays current local time and date.
- 💾 **Local Storage Sync**: Automatically persists your ledger history and current goals to the client browser's `localStorage` (no backend required).
- 🌌 **Obsidian Glassmorphic UI**: Ultra-premium UI styling featuring glowing accents, glass filters, harmony palettes, and responsive layouts.

## Technical Setup & Run Commands

### Installation

Clone the repository and install packages:

```bash
npm install
```

### Run Dev Server

Launch Vite's hot-reload local development server:

```bash
npm run dev
```

### Build Production Bundle

Verify types, syntax compilation, and build optimized production bundle:

```bash
npm run build
```

## Structure

- `src/App.jsx`: Main UI dashboard core, transaction calculations, search logic, and state.
- `src/App.css`: CentWise custom glassmorphism design variables, layouts, and animations.
- `src/index.css`: Global body backdrop gradient gradients, typography config, and scrollbars.
- `index.html`: Header metadata & font loading scripts.
