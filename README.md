# Tablas de Multiplicar

A free, installable PWA that helps kids practice multiplication tables — answer questions with a number keypad or out loud by voice, track streaks and lives, level up through stages, and unlock prizes along the way. There's also a "Learn" mode that recites and animates a table at your own pace for kids learning it from scratch.

No frameworks, no build step — just static HTML/CSS/JS that works by opening `index.html` directly or serving it from any static host.

## Features

- 🎯 **Practice mode** — answer `N × M` using the on-screen keypad or your voice.
- 🎤 **Speech recognition & synthesis** — questions can be read aloud and answered by speaking the number.
- 🎵 **Learn mode** — an animated, narrated walkthrough of a chosen table at adjustable speed.
- ❤️ **Lives & streaks** — 3 lives per round, extra lives for long streaks, prizes every 5 stages.
- 🌍 **4 languages** — Spanish, English, German, and Chinese, including per-language spoken-number parsing.
- 🎨 **Two themes** and adjustable difficulty (table ranges).
- 📴 **Offline-ready PWA** — installable to your home screen, works without a connection via a service worker.

## Playing it

Just open [`index.html`](index.html) in a browser — no installation or server required. To install it as an app on your phone/desktop, open it in a browser that supports PWAs and use the browser's "Install" / "Add to Home Screen" option (an in-app banner will prompt you too).

### How to play

- **Goal**: answer `N × M` using the keypad or by saying it out loud.
- **Voice**: tap the microphone and say the number; you have a few seconds to answer.
- **Lives**: you start with 3; you lose one for each wrong answer. If you run out, you can retry the stage.
- **Stages**: every 10 correct answers you level up and move along the mountain.
- **Streak**: get many in a row to earn an extra life.
- **Prizes**: every 5 stages you win a special prize.
- **Learn mode**: repeat the tables out loud and visually at your own pace — great for learning them from scratch.
- **Settings**: change difficulty, language, theme, and more from the settings icon.

## Development

Requires [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

```sh
pnpm install   # set up dev dependencies (ESLint)
pnpm run lint  # lint index.html, sw.js, and game-logic.js
pnpm test      # run unit tests for the game logic (game-logic.js)
```

There's no build step — edit `index.html`, `game-logic.js`, or `sw.js` directly and reload the page to see changes. See [`CLAUDE.md`](CLAUDE.md) for more details on the project's structure and conventions (including the service worker's cache-versioning requirement).

## Project structure

- `index.html` — the app itself: markup, styles, and DOM-bound UI/game logic.
- `game-logic.js` — pure game logic (question generation, spoken-number parsing) shared between the app and the test suite.
- `sw.js` — service worker for offline caching.
- `manifest.json` — PWA manifest.
- `icons/` — app icons.
- `test/` — unit tests for `game-logic.js`.
