# ATLAS — Claude Code tooling inventory

Owner: Claude Code. Codex's UI tooling is documented separately in `docs/UI_ENVIRONMENT.md` and `docs/skills.lock.json`.
Last verified: 2026-11-09 on Windows 10 (Node 24.19.0, npm 11.17.0, git 2.51.2, gh 2.97.0, Claude Code 2.1.296).

## Plugins (project scope — `.claude/settings.json` → `enabledPlugins`)

| Plugin | Version | Source | Provides | Notes |
|---|---|---|---|---|
| `expo@claude-plugins-official` | 1.13.9 | Anthropic official marketplace → `github.com/expo/skills` (`plugins/expo`, commit `d4f48402`) | 24 Expo/EAS skills, Expo MCP server, 2 hooks | Always-on cost ≈2.9k tokens. Hooks run `skill-event.cjs` (PostHog telemetry) — **opt-in, default off**; forced off by `EXPO_SKILLS_TELEMETRY=0` in project `env`. Its UI skills (`expo-ui`, `expo-design-system`, `expo-native-ui`, `expo-animation`) are Codex's domain — Claude does not use them for UI work. |
| `typescript-lsp@claude-plugins-official` | 1.0.0 | Anthropic official marketplace | TypeScript/JS language server (go-to-definition, references, diagnostics) | Requires the global `typescript-language-server` binary (below). Verified: LSP `initialize` handshake succeeds. |
| `context7@claude-plugins-official` | `0412be76` | Anthropic official marketplace → Upstash | Context7 MCP (current library docs) | Queries go to Upstash's hosted service — never include code or secrets in queries. Needs sign-in via `/mcp`. |

Disabled for this project: `frontend-design@claude-plugins-official` (user scope) and `frontend-design@synced` (claude.ai sync) — UI design belongs to Codex.

## Project skills (`.claude/skills/`)

| Skill | Type | Content source |
|---|---|---|
| `react-native-best-practices` | Pointer | `.agents/skills/react-native-best-practices/` — Codex-vendored copy of `callstackincubator/agent-skills` @ `59e9d174` (MIT). SKILL.md verified byte-identical to upstream at that commit. |
| `react-native-testing` | Pointer | `.agents/skills/react-native-testing/` — same repo/commit (`plugins/vendored/.agents/skills/react-native-testing`). Verified identical. |

Pointer skills avoid a second copy (and drift). The Callstack plugins themselves were not installed: their skill folders are git symlinks, which do not resolve on this machine (`core.symlinks` unset, Developer Mode off).

## MCP servers

| Server | Transport | Status (2026-11-09) | Auth |
|---|---|---|---|
| `plugin:expo:expo` → `https://mcp.expo.dev/mcp` | HTTP | Registered; **needs authentication** | User signs in with an Expo account via `/mcp` (interactive `claude` terminal). `search_documentation` requires a paid Expo plan; build/simulator/store tools can incur cost or publish — all Expo MCP tools are in the `ask` permission list. Local capabilities need `npx expo install expo-mcp --dev` + `EXPO_UNSTABLE_MCP_SERVER=1 npx expo start` (PowerShell: `$env:EXPO_UNSTABLE_MCP_SERVER=1; npx expo start`); iOS local capabilities need macOS. |
| `plugin:context7:context7` → `https://mcp.context7.com/mcp` | HTTP | Registered; **needs authentication** | User signs in via `/mcp`. Optional — skip if you don't want a Context7 account. |

Not configured on purpose: GitHub MCP (the authenticated `gh` CLI covers it without a PAT), Obsidian MCP (no official server; see below), Supabase (out of scope).

## Global CLI tools installed for Claude Code

| Tool | Version | Install | Why |
|---|---|---|---|
| `typescript-language-server` | 6.0.3 | `npm i -g typescript-language-server` | Binary required by `typescript-lsp` |
| `typescript` | 6.0.3 (pinned major 6) | `npm i -g typescript@6` | TypeScript 7 (native) no longer ships `tsserver`, which the language server needs; Expo SDK 58's template uses `typescript ~6.0.3`. The project's local TypeScript takes precedence once scaffolded. |

## Harness (`CLAUDE.md`, `.claude/`)

- `CLAUDE.md` — project brief, ownership summary, workflow, gates, routing.
- `.claude/rules/` — `architecture.md`, `collaboration.md` (always loaded); `react-native.md`, `database.md`, `testing.md` (path-scoped).
- `.claude/agents/` — `architecture-reviewer` (opus, read-only), `test-debugger` (sonnet), `docs-maintainer` (haiku), `feature-implementer` (sonnet).
- `.claude/hooks/` (Node, report-only; only write to git-ignored `.claude/session-log/`):

| Hook | Event | Behavior | Verified |
|---|---|---|---|
| `session-start.mjs` | SessionStart | Injects branch, uncommitted count, latest handoff, scaffold state, ownership reminder | Script test ✓ |
| `ownership-guard.mjs` | PreToolUse (Edit/Write/MultiEdit/NotebookEdit) | `ask` before editing Codex-owned paths or overwriting an existing joint file with Write | 13 script cases ✓ |
| `lint-file.mjs` | PostToolUse (Edit/Write/MultiEdit) | Records touched file; runs ESLint on that file only, no `--fix`; silent until ESLint is installed | Script test ✓; live harness ✓ (recorded this session's edits) |
| `stop-checks.mjs` | Stop | If tracking docs changed this turn: `node scripts/tracker.mjs --check`. If code changed (after scaffold): `tsc --noEmit` + `jest --findRelatedTests`. Blocks once, then report-only (no retry loops) | Block/report/pass paths ✓ against a scratch TS project; tracker path ✓; Jest path verifies at scaffold |
| `session-end.mjs` | SessionEnd | Writes branch/status/diff-stat/commits to `.claude/session-log/<date>-<id>.md` | Script test ✓; live ✓ (also fires for `claude` CLI subcommands) |

- `.claude/settings.json` — permissions: `allow` for validation/read-only commands; `ask` for commit/push/merge/worktrees/repo+PR creation/EAS/global installs/winget/prebuild and all Expo MCP tools; `deny` for `rm -rf`, `git reset --hard`, force-push, `git clean -f`, `drizzle-kit push/drop`, `curl | sh`, and reading `.env`/signing keys/credentials. Bypass-permissions mode disabled. (Deny rule verified live: it blocked an `rm -rf` during setup.) Note: Bash-pattern rules do not cover equivalent PowerShell commands.

## Progress tracking

- `scripts/tracker.mjs` (Node, no dependencies) — validates `docs/FEATURE_TRACKER.md` (IDs, owners, statuses, dependencies, cycles, evidence rules) and generates the progress block in `docs/PROJECT_STATUS.md` (`--write`; `--check` detects staleness). 18 scripted positive/negative cases passed on 2026-11-09. Rules: `.claude/rules/tracking.md`.
- Not added: an allow-rule for `node scripts/tracker.mjs*` in `.claude/settings.json` (the auto-mode classifier declined Claude editing its own permission list). The script may prompt; add the rule yourself if wanted.
- GitHub Projects mirror: proposed only (DEC-010) — needs a GitHub repo, the `project` token scope and a sync script.

## Model routing

Native Claude Code only (no proxy). Subagents pin their model (above). Main session: Opus for architecture/planning/debugging, Sonnet for routine implementation via the model picker (`opusplan` alias optional).

## Deferred (not installed)

| Tool | When | Notes |
|---|---|---|
| Maestro CLI | Codex-managed | Codex is setting up a project-local Maestro under `.tools/maestro/` (git-ignored) with the wrapper `tools/maestro.ps1` (selects a JDK ≥ 17 per process) — see `docs/UI_ENVIRONMENT.md`. Claude Code does not install a second copy. Device runs still need an emulator/device (`adb`) and a development build; iOS flows need macOS or Maestro Cloud. |
| Graphify (`graphifyy` on PyPI) | Once the data layer exists | Needs `uv` (`winget install astral-sh.uv`). Install with `graphify install --project`; review the PreToolUse Read/Grep hooks it adds; never `--strict`; don't connect Graphify Cloud. |
| Obsidian CLI + `kepano/obsidian-skills` `obsidian-cli` skill | Only if Claude should drive the Obsidian app | Obsidian 1.14.5 is installed; enable *Settings → General → Command line interface*. For docs, simply open `docs/` as a vault — no MCP needed. |
| EAS CLI | Not used (zero-cost, DEC-011) | Paid/cloud builds are out of scope; Android APKs are built locally. |

## Android dev build (zero-cost, local) — verified 2026-11-09

First successful build and install: Infinix X695 (arm64-v8a, Android 11), JDK 25 (no JDK 17 needed), Gradle 9.4.1, AGP 9.2.1, Kotlin 2.2.0, compileSdk 37, NDK 27.1.12297006, build-tools 37.0.0. The first build needed 13 attempts because of this machine's network and Windows limits; `scripts/android/build-android.sh` encodes all fixes (details: DEC-016).

```bash
adb devices -l                                   # note the serial
bash scripts/android/build-android.sh <serial>   # build + install the debug dev client (arm64 only)
npx expo start --dev-client                      # JS server; then: adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "exp+atlas://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
```

One-time setup the script expects (all free, all verified):
- `C:\Users\Admin\gh` = short Gradle home (first run downloads about 4 GB of dependencies there).
- `C:\Users\Admin\gh\cmake-3.31.6` = CMake 3.31.6 package from `https://dl.google.com/android/repository/cmake-3.31.6-windows.zip` (sha1 `1efbef168291afc5d6ae449b1a016f8bf034b0fc`, 20 MB), extracted there; its ninja 1.12.1 is long-path aware.
- Android SDK at `%LOCALAPPDATA%\Android\Sdk` with platform android-37.0; Gradle installs build-tools 37.0.0, NDK and CMake 3.22.1 itself.

Notes: Git Bash rewrites `/sdcard` paths; set `MSYS_NO_PATHCONV=1` for adb shell commands. `android/` is generated (`expo prebuild`), git-ignored and may be regenerated; `android/local.properties` is rewritten by the script. Metro and the dev client run only while the PC serves JS; a standalone release APK is a later task (REL-03).

## Missing prerequisites (user action)

1. **JDK:** JDK 25 works for the Android build (verified); no JDK 17 needed.
2. **Android Studio / SDK:** installed and sufficient (verified by a successful build).
3. **iPhone (zero-cost):** no paid Apple membership. Free options need a Mac (Xcode Personal Team, 7-day reinstall); unresolved on Windows (DEC-011). Expo account is optional (only for the Expo MCP).
5. **GitHub private repo** — create when ready (Claude will ask before `gh repo create` / push).
