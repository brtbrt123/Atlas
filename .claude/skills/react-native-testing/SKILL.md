---
name: react-native-testing
description: Write tests using React Native Testing Library (RNTL) v13 and v14 (`@testing-library/react-native`). Use when writing, reviewing, or fixing React Native hook or component tests — render, screen, queries (getBy/getAllBy/queryBy/findBy), Jest matchers, userEvent, fireEvent, waitFor, and async patterns. Supports v13 (React 18, sync render) and v14 (React 19+, async render).
---

# React Native Testing Library (pointer)

The content of this skill lives in **`.agents/skills/react-native-testing/`** — a single shared copy vendored from `callstackincubator/agent-skills` @ `59e9d17446a248b21d86f078fcd0bd2d36db1ca4` (MIT), pinned in `docs/skills.lock.json`. That folder is Codex-owned; read it, never edit it.

1. Read `.agents/skills/react-native-testing/SKILL.md` in full.
2. Check the installed `react` and `@testing-library/react-native` versions in `package.json`, then read `references/api-reference-v13.md` or `references/api-reference-v14.md` accordingly, plus `references/anti-patterns.md`.

ATLAS scope (from `.claude/rules/testing.md`): Claude Code uses RNTL for adapter hooks and stores; UI rendering/accessibility tests are Codex-owned. Repository/service tests use a real in-memory SQLite database, not RNTL.
