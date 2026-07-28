# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Tablas de Multiplicar" — a vanilla HTML/CSS/JS PWA that helps kids practice multiplication tables, with speech recognition/synthesis and es/en/de/zh UI languages. No frameworks, no package manager, no build step.

- `index.html` — most of the app: CSS in a `<style>` block, DOM-bound JS/UI logic in a `<script>` block starting around line 834.
- `game-logic.js` — pure game logic with no DOM/browser-API dependencies (question generation, spoken-number parsing), loaded via `<script src>` in `index.html` and `require()`d directly from tests, so both run the exact same code.
- `sw.js` — service worker, caches static assets for offline use.
- `manifest.json`, `manifest.en.json`, `manifest.de.json`, `manifest.zh.json` — per-language PWA manifests (translated `name`/`short_name`, so "Add to Home Screen" shows the app name in the currently selected UI language). `index.html` swaps the `<link rel="manifest">` href and the `apple-mobile-web-app-title` meta tag in `applyLanguage()`. Keep all four in sync on any other manifest field (icons, colors, etc.).
- `icons/` — app icons.

There is no formatter. Verify DOM/UI changes by opening `index.html` in a browser (or serving it statically) and exercising the feature manually.

## Linting

ESLint is configured to lint the inline `<script>` in `index.html` (via `eslint-plugin-html`), `sw.js`, `game-logic.js`, and `test/**/*.js`. Run with:

```
pnpm run lint
```

Uses `pnpm` as the package manager (not npm/yarn) — `pnpm install` to set up `node_modules`.

## Tests

Only the pure logic in `game-logic.js` is unit tested (question generation/no-repeat logic, spoken-number parsing per language), using Node's built-in test runner — no extra test dependency. Run with:

```
pnpm test
```

DOM-bound code in `index.html` (scoring, speech recognition wiring, animations) has no automated coverage — verify those manually in the browser.

## Cache versioning (important)

`sw.js` caches `index.html`, `game-logic.js`, all `manifest*.json` files, and the icons under `CACHE_NAME`. **Any change to those cached files requires bumping `CACHE_NAME` in `sw.js`** (e.g. `tablas-multiplicar-v10` → `v11`), otherwise devices with the app already installed won't pick up the change.

## App version (important)

The app follows [semantic versioning](https://semver.org), starting at `0.1.0`. **Every change bumps the version by at least a patch** — patch for fixes/tweaks, minor for new backwards-compatible features, major for breaking changes. Update both:

- `APP_VERSION` in `index.html` (shown discreetly under the title, e.g. `v0.1.0`).
- `"version"` in `package.json` — keep it identical to `APP_VERSION`.

## Workflow

- Commit directly to `main` — no feature branches or PRs.
- Commit messages are written in Spanish, imperative/descriptive style (e.g. "Añadir modo 'Aprender'...").
- Pushing to `main` deploys automatically via GitHub Pages.
