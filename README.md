# PokerClock

A static poker tournament timer SPA built for large TV displays and mobile phones. No backend required — deploy to GitHub Pages.

## Features

- **Countdown Timer** with drift-corrected wall-clock ticking (works in background tabs)
- **Resizable Panels** (VSCode-style draggable dividers) for timer, blind info, and tournament stats
- **Dark Theme** optimized for dim poker room environments
- **Blind Schedule Editor** with add/remove/reorder levels and breaks
- **Import/Export** tournament structures as JSON files
- **Fullscreen Mode** for TV projection
- **Wake Lock** to prevent screen sleep while the timer is running
- **Keyboard Shortcuts**: Space (play/pause), Left/Right (prev/next level), R (reset level), E (toggle view)
- **localStorage Persistence** for tournament state and panel layout

## Tech Stack

- Vite + React + TypeScript
- CSS Modules
- `react-resizable-panels` for draggable panel layout
- No router, no external state library

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` — ready for static hosting.

## Deployment

Push to `main` branch to trigger automatic deployment to GitHub Pages via the included GitHub Actions workflow.

## License

[MIT](LICENSE)
