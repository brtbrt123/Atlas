---
paths:
  - "app/**"
  - "src/**"
  - "app.json"
  - "app.config.*"
  - "babel.config.*"
  - "metro.config.*"
  - "tailwind.config.*"
  - "package.json"
  - "eas.json"
---

# React Native / Expo rules

## Platform baseline (verified 2026-11-09 — re-verify at scaffold time)

- Expo SDK 58 (`expo` 58.0.x) → React Native 0.88.1, React 19.3, Reanimated 4.7.1 + `react-native-worklets` 0.13, Expo Router ~58.0.x, `expo-sqlite` ~58.0.x.
- Install Expo-managed packages with `npx expo install <pkg>` so versions match the SDK; run `npx expo install --check` after dependency changes.
- New Architecture only (Reanimated 4 requires it).
- Run on devices with **development builds** (`expo-dev-client`), not Expo Go. Native folders (`/android`, `/ios`) are generated (CNG) and git-ignored; configure native behavior via `app.config.ts` and config plugins.
- Styling: NativeWind 4.2.x with Tailwind CSS 3.4 (NativeWind 5 is still RC; NativeWind 4 does not support Tailwind 4). NativeWind must consume Codex's tokens from `src/theme/tokens.ts`; never duplicate token values in `tailwind.config`.

## Routing (Claude owns route files)

- Expo Router file-based routes under `app/`; enable typed routes.
- Route files stay thin: resolve params, call an adapter hook, render a Codex screen from `src/features/**`.
- The active workout must survive tab switches and app termination — its state lives in SQLite + store, never only in a screen's local state.

## Performance

- Never block the JS thread with large synchronous queries during interaction; keep per-set writes small.
- Lists of history/exercises use virtualization with stable keys.
- Do not re-render a whole session tree on a 1-second tick; derive elapsed time from timestamps in a small leaf component.
- Profile before optimizing (see the `react-native-best-practices` skill); no new list/state/compiler dependency without a recorded decision in `docs/DECISIONS.md`.

## Privacy

- No analytics, crash-reporting SDKs or network calls in app code unless the user approves a decision record.
- Data export/import stays local (share sheet / document picker).
