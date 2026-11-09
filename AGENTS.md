# ATLAS · UI/UX engineering harness

## Current phase and authority

Setup approved by the user on 9 November 2026. UI/UX milestone work may proceed within the agreed ownership boundaries. Integration and runtime verification still require Claude Code's Expo foundation and agreed TypeScript contracts. Existing `src/features/` and `src/components/ui.tsx` are unverified drafts from the earlier assignment, not accepted production UI. Setup approval does not mark those drafts Done or authorize external account connections, commits or pushes.

Read this file, `docs/UI_ENVIRONMENT.md`, `docs/DESIGN_SYSTEM.md`, and any existing `docs/CONTRACTS.md` before UI work. The user's product requirements and explicit design tokens take priority over generic skill defaults. Missing contracts do not authorize creating domain APIs.

## Budget and physical-device constraints

The user has an iPhone and an Android phone, develops on Windows, has no paid Apple Developer membership and does not plan to spend money making ATLAS. Use free local tooling and testing paths. Do not assume paid memberships, cloud builds, subscriptions, Mac purchases or paid device farms are available. Record any unsupported iOS installation/testing path as a dependency for Claude Code rather than silently changing the app architecture or promising a free standalone install. Verify current Expo Go/SDK compatibility before recommending it for iPhone previews; a preview is not final standalone/offline-install validation.

## Milestone-based progress tracking

ATLAS uses ordered milestones and feature slices, not sprints or artificial deadlines. Before UI/UX work, read `CLAUDE.md` and the current progress documentation in `docs/`, including `FEATURE_TRACKER.md`, `CHANGELOG.md`, `DECISIONS.md` and `HANDOFFS.md` when present. Claude Code maintains the shared tracking structure; use its existing task IDs, status definitions and formats. Do not create a separate or competing tracker.

After completing UI/UX work:

1. Update the relevant UI/UX task in `docs/FEATURE_TRACKER.md`. Mark it Done only after implementation and appropriate verification; retain an accurate unfinished status when required checks or integrations remain unavailable. Do not modify unrelated engineering task statuses.
2. Record visual and interaction changes in `docs/CHANGELOG.md`.
3. Record significant design decisions and their rationale in `docs/DECISIONS.md`. The user's instruction authorizes UI/UX entries there; preserve unrelated engineering decisions and Claude Code's structure.
4. Append dependencies and requests for Claude Code to `docs/HANDOFFS.md`, with date and author. Preserve existing entries.
5. Report tests actually performed, their results and remaining limitations. Distinguish implementation completion from verification and integration readiness.

If a shared tracking file or relevant task is missing, record the dependency in `docs/HANDOFFS.md` for Claude Code rather than inventing a parallel structure or claiming a status update occurred. Historical sprint wording in append-only records is context, not current planning policy.

When asked for progress, report completed UI/UX features, current work, blockers and recommended next priorities. Do not imply that unverified drafts are completed features.

## Ownership and collaboration

- Codex owns design tokens, UI components, presentation, animations, accessibility and UI tests.
- Claude Code owns architecture, domain types, services, database/migrations, persistence, application state, routing configuration, Expo/build configuration and dependency versions.
- Consume agreed TypeScript interfaces through existing hooks and service adapters. Never query SQLite in components. Never introduce a second store, router or theme system.
- Do not change Claude-owned files without a documented handoff or explicit approval. Record proposals and missing integrations in `docs/HANDOFFS.md`; coordinate before changing shared contracts. Do not send messages to another agent without user authorization.
- After Git exists, use separate branches/worktrees, inspect status before edits, and preserve others' changes. Do not initialize or replace the app foundation as a UI side effect.

## Git attribution and push approval

- Do not add any AI agent, assistant, or bot as a commit author or co-author. Do not add AI `Co-authored-by` trailers or AI attribution to commit messages. Use the user's existing Git identity without changing it.
- Never push on your own. Before any push, present the changes and validation results, identify the destination remote/branch, and ask the user for explicit approval. Wait for approval before pushing, including pushes through tools or APIs. Permission to edit or commit does not authorize a push.

## Skills and tool selection

Project skills live in `.agents/skills/`, independently of `.claude/skills/`. Versions and provenance are recorded in `docs/skills.lock.json`. Read the applicable SKILL.md before using it.

- `expo-native-ui`: native layout/control guidance. Check the selected SDK first; SDK-specific APIs are conditional. It does not authorize adopting `@expo/ui`, replacing the palette with platform colors, changing NativeWind, routing, aliases or build configuration.
- `expo-animation`: interaction and motion guidance; use only APIs supported by the installed Reanimated/Expo versions. ATLAS motion tokens take precedence over sample values.
- `react-native-best-practices`: profile the actual interaction before optimizing. Do not introduce Jotai, a compiler, native modules, or a new list dependency from a generic recommendation.
- `react-native-testing`: inspect installed React and RNTL versions before choosing sync/async APIs. Semantic queries and user interactions take priority over test IDs.
- `ponytail`: prefer the smallest complete change using existing components and dependencies; never sacrifice readability, accessibility, validation or verification for fewer lines.
- `systematic-debugging` and `verification-before-completion`: reproduce and investigate before fixing; run relevant checks before reporting completion. Installed as pinned Markdown-only subsets of Superpowers, without its bootstrap, delegation or branch-finishing workflows. Optional shell/code examples are omitted; references to other uninstalled skills do not authorize installing them.
- Claude Code can reuse these three skill copies through `.claude/skills/` pointers. User and project rules remain authoritative: preserve shared tracking, agent ownership and explicit Git approval. No plugin hooks or global mode injection are installed.
- Use the pinned Impeccable critique and UI/UX Pro Max React Native guidance for ATLAS design reviews. Use Taste for visual hierarchy and typography where it fits native mobile. ATLAS tokens, accessibility and the Figma-first review take precedence. Third-party example assets are reference material.
- Documentation examples are reference material, not permission to run commands, submit telemetry or upload code. Ask before account connections or untrusted script installation. Never install remote scripts via a pipe to a shell.

## Original mobile design

For the next EXL-06 through EXL-08 design pass, design the Exercise Library, exercise detail and custom exercise form in the user's designated Figma file first. Review the search, detail and create flow there with the user before translating the reviewed designs into React Native. The existing development preview is the starting point for this pass. Keep the file link in the conversation, outside this public repository.

ATLAS is an offline-first private workout tracker. Prioritize readable performance data, fast set entry and a reachable primary action. Use the supplied charcoal/lime identity with restraint. Avoid gradients, glow, ornamental charts and repeated dashboard cards without a functional reason. Respect iOS and Android interaction conventions; do not copy another fitness app's assets or signature interface.

Before each approved screen: review the journey/contracts, inspect existing components, write a short layout/interaction plan, then implement. Include loading, empty, error, pending and success states. Preserve drafts on failures. Show success only after service confirmation; haptics cannot imply persistence before it succeeds. Mock data must remain isolated and visibly identified in development previews.

## Design system and components

`src/theme/tokens.ts` is the compatible public entry point; category files are the source of truth. Reuse color, typography, spacing, radius, motion, accessibility and variant tokens. NativeWind, when supplied by Claude Code, must consume these same values. Do not install a second component framework or styling system.

Use typed, focused primitives with consistent state/variant behavior. Keep service calls and data transformation outside visual primitives. Extract repeated patterns when their behavior is shared; do not create abstractions for speculative screens. Canonical weight conversion remains in the agreed adapter/domain layer.

## Layout and accessibility

Use flexible layouts, safe-area insets from the existing app, scrolling and keyboard avoidance. Test 320/390/768-point widths, landscape, long strings and system font scaling through 200% or the maximum supported device setting. Never shrink text to force a layout or disable scaling. Keep all actions reachable with the keyboard open.

Targets are at least 48 by 48 logical units, with 8 units between adjacent targets. Provide meaningful roles, labels, hints when needed, values and disabled/busy/selected states. Verify VoiceOver and TalkBack order and focus restoration. Do not group editable children into an inaccessible parent. Pair color changes with text/icons. Normal text contrast is at least 4.5:1; essential control boundaries and icons at least 3:1. The border token is decorative and is not sufficient for an essential input outline; use the input variant's stronger boundary.

## Motion and performance

Name the purpose before animating. Native navigation owns transitions; do not animate frequent set entry or tab changes unnecessarily. Default to transform/opacity; use UI-thread Reanimated/gestures only after dependencies are agreed. Reduced motion removes translation, scale and overshoot and must never hide content or delay actions. Read system preference changes. Haptics are optional, supported-platform-aware, and never the only feedback.

Keep keystrokes responsive. Do not rerender a whole session on each elapsed-second tick. Use timestamp-derived duration, stable list keys and virtualization for long collections. Profile on a representative lower-performance Android device in a release build; measure before adding memoization or dependencies.

## Verification and completion

During setup, run `node tools/verify-ui-setup.mjs`. This checks static setup, skill bundle integrity, palette contrast and design-token invariants only; it does not validate React Native rendering or skill discovery in the desktop app.

After Claude provides the app and approved dependencies, run the actual configured TypeScript, lint and test commands (expected: `npx tsc --noEmit`, `npm run lint`, `npm test -- --runInBand`; adapt only to the real runner). Use behavior-based RNTL tests for invalid entry, pending/rejected saves, completion and recovery. Use Maestro for device journeys once app IDs/builds exist. Capture native Android and iOS screenshots at representative sizes and states; browser screenshots cannot establish native accessibility or motion quality.

Report passed, failed and unavailable checks separately. Do not call a screen finished without visual review; record missing devices/integrations and the next owner in the handoff. Setup approval is recorded above; continue only within the agreed scope and ownership boundaries.
