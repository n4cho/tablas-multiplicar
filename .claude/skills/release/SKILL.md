---
name: release
description: Bump the app version and service worker cache version, commit, and push to main to publish a new release of the app. Use only when the user explicitly asks to release/publish/deploy.
disable-model-invocation: true
---

Publish the current state of the app to GitHub Pages.

1. Run `git status` and `git diff` to review what's changed.
2. Bump the app version (semver — patch for fixes/tweaks, minor for new backwards-compatible features, major for breaking changes) in both places, keeping them identical:
   - `APP_VERSION` in `index.html`.
   - `"version"` in `package.json`.
3. If the uncommitted changes touch `index.html`, `game-logic.js`, `manifest.json`, or `icons/`, make sure `sw.js`'s `CACHE_NAME` has also been bumped (e.g. `tablas-multiplicar-v9` → `v10`). If it hasn't, bump it now.
4. Stage the relevant files and create a commit with a concise Spanish message in the imperative/descriptive style used in this repo's history (e.g. "Subir a v0.2.0: <breve descripción del cambio>").
5. Push to `main` (`git push`). This triggers the GitHub Pages deploy — no further action needed.
6. Report the new app version, the new `CACHE_NAME` version, and confirm the push succeeded.

Do not open a PR or create a branch — this repo commits and pushes directly to `main`.
