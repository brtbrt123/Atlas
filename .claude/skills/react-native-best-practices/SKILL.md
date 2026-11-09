---
name: react-native-best-practices
description: Provides React Native performance optimization guidelines for FPS, TTI, bundle size, memory leaks, re-renders, and animations. Applies to tasks involving Hermes optimization, JS thread blocking, bridge overhead, FlashList, native modules, or debugging jank and frame drops.
---

# React Native best practices (pointer)

The content of this skill lives in **`.agents/skills/react-native-best-practices/`** — a single shared copy vendored from `callstackincubator/agent-skills` @ `59e9d17446a248b21d86f078fcd0bd2d36db1ca4` (MIT), pinned in `docs/skills.lock.json`. That folder is Codex-owned; read it, never edit it.

1. Read `.agents/skills/react-native-best-practices/SKILL.md` in full.
2. Then read only the `references/*.md` files it points to for the problem at hand.

ATLAS overrides (from `.claude/rules/react-native.md`): profile the real interaction before optimizing; do not add a new state, list, compiler or native dependency from a generic recommendation without a recorded decision in `docs/DECISIONS.md`.
