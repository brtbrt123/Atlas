# ATLAS UI/UX environment audit

Audited 9 November 2026, Asia/Singapore. Setup approved by the user on 9 November 2026. Existing screen drafts were reviewed as inventory and preserved; no screen implementation or integration was performed in the setup task. Approval removes the setup hold; foundation, contracts and device dependencies remain.

## Project baseline

Before setup: `src/theme/tokens.ts`, draft primitives, Home/Active Workout/preview sources and two Markdown handoffs. No `AGENTS.md` in the workspace or inspected ancestor locations. No `.git`, `package.json`, lockfile, `tsconfig`, Expo/app configuration, installed project packages, shared contracts or test configuration. No Claude-owned services or database files existed to modify.

Created the root harness, category token structure, verification plan and static setup verifier. Existing global Codex configuration was inspected by section/key, not overwritten. No app scaffold, SDK version, dependencies, routes, state library, database, build scripts or external account connection was introduced.

## Skills audit and installation

User/system skill roots and the Codex plugin cache were inspected. Existing capabilities include frontend-design, image generation, visualization, browser/computer use, skill discovery/installation and documentation tooling. Document/spreadsheet/PDF and computer-use skills overlap in the installed catalog; they are unrelated to native testing and were left untouched. Taste, Impeccable, UI/UX Pro Max and dedicated Expo/RN skills were absent from the inspected roots/cache before this setup.

Installed using the bundled OpenAI skill installer, with immutable commit refs and no overwrite:

| Skill | Source | Purpose | Verification |
| --- | --- | --- | --- |
| expo-native-ui | [Expo](https://github.com/expo/skills/tree/a9e5bd3fa00b4e61f632e43f85da73aee1942582/plugins/expo/skills/expo-native-ui) | Expo/native UI patterns | 9 files match upstream Git blobs |
| expo-animation | [Expo](https://github.com/expo/skills/tree/a9e5bd3fa00b4e61f632e43f85da73aee1942582/plugins/expo/skills/expo-animation) | Native motion and reduced motion | 4 files match upstream |
| react-native-best-practices | [Callstack](https://github.com/callstackincubator/agent-skills/tree/59e9d17446a248b21d86f078fcd0bd2d36db1ca4/skills/react-native-best-practices) | Rendering/performance and component guidance | 44 files match upstream |
| react-native-testing | [Callstack-maintained vendored skill](https://github.com/callstackincubator/agent-skills/tree/59e9d17446a248b21d86f078fcd0bd2d36db1ca4/plugins/vendored/.agents/skills/react-native-testing) | Version-aware RNTL tests | 4 files match upstream |

These are project-scoped under `.agents/skills/`, not `.claude/skills/`; [Codex documents this discovery location](https://learn.chatgpt.com/docs/build-skills). `docs/skills.lock.json` records commit provenance and per-file SHA-256; `docs/third-party/` retains upstream MIT notices. The installed bundles contain guidance/references/images and agent metadata, with no executable scripts or installer hooks. Upstream commands inside their prose still require review before execution. The skills should become available on the next turn; selector discovery in the desktop app has not yet been observed.

The official [Expo skill catalog](https://docs.expo.dev/skills/) and maintained Callstack repository supplied the native-specific shortlist. Repository activity/license were checked through GitHub on the audit date; popularity alone was not treated as a security review.

## Named design skills: compatibility and selection

| Requested skill | Codex compatibility | Native fit / decision |
| --- | --- | --- |
| UI/UX Pro Max | Upstream Codex platform template targets `.agents/skills/ui-ux-pro-max`; React Native stack data exists | Not installed. Raw `.claude` SKILL.md refers to `CLAUDE_PLUGIN_ROOT`; copying it alone would produce unusable paths. Use the Codex-generated bundle if approved. Python is available, but bundled search code has not received a full executable-code review. Palette/style generation overlaps existing guidance and must never replace ATLAS tokens. |
| Impeccable | Upstream provides `.agents/skills/impeccable` plus a Windows `.cmd` launcher and native review references | Not installed. Version 4.8.1 instructions run a self-contained binary, downloaded on first use if absent. Installation/execution and any hooks need explicit approval and binary provenance verification. Existing frontend-design already covers general art direction. |
| Taste | Upstream README documents Codex installation | Not installed. Current default skill `design-taste-frontend` builds HTML/CSS websites and uses Chrome/Node scripts, page assets and a finish gate. Codex support does not make these checks React Native checks. It would duplicate web design/review tools and bring a workflow that does not fit native ATLAS. |

Sources reviewed at immutable commits: [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/4f2dbb67e64969a9a30ab00742f2d55d66ddec2b), [Impeccable](https://github.com/pbakaus/impeccable/tree/a90602e9f6fed600d6d9b18cf78275d66cac7a6c), [Taste](https://github.com/Leonxlnx/taste-skill/tree/f6b76575f949707b4e3c37cd86cb44b0b98643e8).

Mobile accessibility is covered by the harness, accessibility tokens, [React Native's official accessibility guidance](https://reactnative.dev/docs/accessibility) and the device review plan, rather than an unverified additional skill. Component architecture is governed by the shared-primitives/ownership rules and Callstack references. Visual review uses existing image inspection tools plus future native screenshots; browser automation is not a native test replacement.

## Compatibility boundaries

### Approved workflow skill additions · 9 November 2026

The user approved Ponytail plus selected Superpowers debugging/verification guidance and asked whether Claude Code could use them too. Installed `ponytail` from DietrichGebert/ponytail at `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846`, and `systematic-debugging` plus `verification-before-completion` from obra/superpowers at `22f0b463e7a5e579904dd6211a520321035526f7`. These add six upstream-verified Markdown files, bringing the lock to seven skills and 67 files. Upstream MIT notices are in `docs/third-party/`.

Only Markdown is active. The debugging shell helper and TypeScript example are omitted and listed in the lock; manual debugging guidance remains available. Full plugin installers, bootstrap skills, lifecycle hooks, parallel-agent workflows and Git-finishing workflows were not installed. Bundled references to other skills do not make them installed or authorize installation. The zero-cost and Git/ownership rules still apply.

Three new `.claude/skills/<name>/SKILL.md` pointers read the same canonical files under `.agents/skills/`; existing Claude Code configuration is untouched. This is instruction sharing, not a second skill copy. Skill discoverability should be checked on the next Codex turn and in a fresh Claude Code session; neither host's actual invocation has been observed yet. No application visual or interaction change is included.

Expo skills currently mention SDK 56+ native controls and newer Reanimated APIs. No SDK is selected here, so API compatibility cannot yet be certified. The harness requires checking actual installed versions and overrides upstream suggestions to change the palette, replace NativeWind, add routing, install libraries or submit feedback. No additional state-management system or component framework was installed. RNTL references distinguish versions 13 and 14; choose from the actual project's React/RNTL dependencies after Claude supplies them.

## Integrations and local tools

| Tool | Observed state | Action / remaining work |
| --- | --- | --- |
| Git/GitHub CLI | Git 2.51.2 and gh 2.97.0 installed; existing GitHub authentication verified outside sandbox | No new account connection. Initial sandbox auth failure was misleading; the keyring credential is valid. Workspace has no repository/remote, so project access cannot be tested. |
| GitHub connector | Directory reports available but `installed: false` | Not connected; CLI already supplies needed GitHub access, so avoid duplication. |
| Figma connector/MCP | Directory reports available but `installed: false`; no Figma tools exposed | Optional account connection requires user authorization. No connectivity or file-access claim. No extra Figma MCP installed. |
| Local Node MCP | `node_repl` is configured and returned a successful health calculation | Connectivity verified for this server only. Other exposed app/artifact/computer tools were inventoried, not all exercised. |
| Expo tooling | Node 24.19.0, npm 11.17.0, pnpm 11.13.1 available; no project Expo dependency | No deprecated global Expo CLI installed. Claude Code must select SDK and supply manifest/build configuration. Node/SDK compatibility and `expo-doctor` require that foundation. |
| Expo MCP | Not configured | [Official Expo MCP](https://docs.expo.dev/mcp/) requires Expo authentication; no account was connected. Local simulator capabilities also need a running project. |
| Android tooling | adb missing from PATH and standard per-user Android SDK location | SDK/device/emulator availability not established; no device tests possible yet. No Android Studio or SDK installed as a side effect. |
| Java | PATH selects Java 8; JDK 25.0.1 exists and runs | Do not replace system PATH. Maestro needs Java 17+; use a per-process wrapper and verify CLI operation. |
| Maestro | Installed locally, version 2.12.1 verified | Official Windows ZIP passed SHA-256 verification; per-process wrapper uses the installed JDK 25. No app/device flows executed. |
| iOS local tooling | Windows host | Native iOS simulator review requires a macOS host. A physical iPhone/development build path must be agreed with Claude Code. |
| Obsidian | Desktop executable found; one vault configured | No notes were read and no vault path or content was copied. No Obsidian plugin was returned by the directory search. Optional later file-based notes need an explicitly chosen vault. Repository docs remain authoritative. |
| Graphify | Not configured or required | Omitted as optional; no value for the current small source tree. |

No external account was newly connected. No global Codex/MCP settings, system PATH, JAVA_HOME persistence or machine-wide libraries were changed. No new app integration was installed.

## Maestro status

Installed and CLI-verified from [Maestro cli-2.12.1](https://github.com/mobile-dev-inc/Maestro/releases/tag/cli-2.12.1), published 2 November 2026. The archive matched the published SHA-256 `54dbb0716425626604973cbb374c585ca30272375d9ce15177a1152765ddd9d7` before extraction under `.tools/maestro/`. This folder is ignored by Git. No remote shell installer was used.

Run `.\tools\maestro.ps1 --version`; verified output: `2.12.1`. The wrapper accepts a named `-AtlasJavaHome` override, otherwise checks the existing JAVA_HOME then the observed JDK 25 location. It restores process environment variables afterward, requests analytics/update-notification opt-outs and changes no persisted system configuration. Maestro may create its own per-user local state. The sandbox's Java home mapped to `C:\`, causing the first CLI launch to fail on local state creation; the approved version check outside the sandbox succeeded with JDK 25.0.1. This proves CLI startup on that JDK, not Android build-tool compatibility or device automation. No test flows or cloud commands ran.

The current [Maestro installation documentation](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli.md) supports a native Windows ZIP installation and requires Java 17+. WSL is not needed for this approach; WSL inventory showed only Docker Desktop, not a general-purpose development distribution.

## Verification and next owners

`node tools/verify-ui-setup.mjs` passed static token invariants, enabled-state color contrast, all 61 skill file hashes, executable-file exclusion and documentation/approval-gate presence. It does not compile the app, execute skill examples, verify desktop discovery, or prove runtime accessibility. Node's built-in TypeScript stripping is experimental; this is a data check, not a substitute for tsc. The Maestro wrapper also passed PowerShell syntax parsing and the CLI version check. No project TypeScript/lint/Jest/RNTL/device checks can run until the app foundation exists.

1. Setup approval received on 9 November 2026; proceed within the existing ownership boundaries. This does not authorize account connections, commits or pushes.
2. Claude Code provides the Expo foundation, dependency versions, navigation/state ownership, shared contracts and development build/device path.
3. Optionally authorize Figma/Expo account connections and separately decide whether Impeccable or UI/UX Pro Max merits executable tooling; Taste is unnecessary for native scope.
4. After integration, run the configured checks and the native matrix in `UI_REVIEW.md`; verify the new project skills appear in the next-turn selector.
