# ATLAS — Master Development Documentation

Project specification v1.0 · Android + iOS · Private · Offline-first

> Source: the user's master specification, recorded verbatim in substance on 2026-11-09 (joint document — Claude Code and Codex append/merge, never replace).
> **Process amendment (2026-11-09, user decision):** ATLAS is developed by one human developer, so time-boxed sprints are not used. §10 is an ordered list of milestones / feature slices, not sprint commitments.
> **Tracking amendment (2026-11-09, user decision):** work is tracked as ten milestones of small verifiable tasks in `docs/FEATURE_TRACKER.md` (progress in `docs/PROJECT_STATUS.md`, decisions DEC-001/DEC-002 in `docs/DECISIONS.md`). That tracker supersedes the §10 table below for planning; §10 is kept for history.

## 1. Project identity and objectives

**Project name:** ATLAS — Personal Fitness Tracking Application

**Product vision:** Build a premium-quality personal workout tracker inspired by the functionality of Hevy, with original branding, interface design, and source code.

**Target platforms:** Android and iOS, using one React Native codebase.

**Distribution:** Private installation. No public release, subscriptions, advertising, or mandatory accounts.

**Core goals:**
- Fast and reliable workout logging.
- Reusable training routines.
- Exercise management.
- Rest timers.
- Workout history and personal records.
- Strength and training-volume analytics.
- Offline functionality.
- A polished, accessible interface.

**Non-goals for MVP:** Social networking, AI-generated training prescriptions, calorie tracking, wearables, payment systems, and cloud synchronization.

## 2. Agent responsibilities

| Area | Claude Code | Codex |
|---|---|---|
| Requirements and planning | Joint | Joint |
| Application architecture | Owner | Reviewer |
| Expo configuration | Owner | Consulted |
| Database and migrations | Owner | No direct edits |
| Business logic | Owner | Consumer |
| TypeScript interfaces | Owner | Reviewer |
| UI design system | Reviewer | Owner |
| Screens and components | Support | Owner |
| Navigation experience | Router ownership | Visual and interaction ownership |
| Animations and haptics | Integration | Owner |
| Unit/integration tests | Owner | Support |
| UI/accessibility tests | Support | Owner |
| Builds and distribution | Owner | Support |
| Documentation | Joint | Joint |

**Conflict rule:** Neither agent changes the other's owned files without a documented handoff or explicit approval.

## 3. Technology specification

| Layer | Technology |
|---|---|
| Framework | Expo + React Native |
| Language | TypeScript, strict mode |
| Navigation | Expo Router |
| Styling | NativeWind and shared design tokens |
| UI components | Custom reusable components |
| State management | Zustand |
| Persistence | Expo SQLite |
| ORM | Drizzle |
| Validation | Zod |
| Animations | Reanimated |
| Charts | Victory Native |
| Testing | Jest, React Native Testing Library, Maestro |
| Builds | Expo EAS |
| Version control | GitHub |

Use compatible stable versions verified against the selected Expo SDK. Avoid installing dependencies based solely on old examples.

## 4. Required screens

| Screen | Required functionality |
|---|---|
| Home | Weekly activity, recent workout, quick-start action |
| Exercise Library | Search, filters, exercise details, custom exercises |
| Routine Library | Create, edit, duplicate, delete, start routines |
| Routine Builder | Reorder exercises, configure sets, reps and rest |
| Active Workout | Log sets, weight, reps, RPE, notes and completion |
| Rest Timer | Countdown, adjustments, notifications |
| Workout Summary | Duration, exercises, completed sets, records |
| Workout History | Browse, inspect, edit, delete completed sessions |
| Progress | Strength charts, volume, frequency, personal records |
| Settings | Units, theme, notifications, export/import, privacy |

### Critical active-workout requirements

The active workout is the highest-priority experience. Set entry must require minimal taps. Every completed set must persist immediately. The workout must recover after app termination, and switching tabs must not discard the session.

Workout duration should use stored timestamps rather than relying on a continuously running JavaScript timer.

## 5. Original design system

The specification included an illustrative UI concept (an "ACTIVE SESSION" card for "Upper Body A — Incline Bench Press" with weight/reps/status fields and a "Complete Set" action). It is illustrative only, not recorded workout data. Codex maintains the design system in `docs/DESIGN_SYSTEM.md`.

**Design tokens (DEC-020, approved 2026-11-09):** a clean, light, flat look. Canvas `#F6F6F8`, surface `#FFFFFF`, raised `#F1F1F5`, primary text `#1D1D24`, secondary text `#6B6B77`, border `#D9D9E1`, danger `#D92D3A`. One accent, pastel red `#FF6961`, with dark text `#45141A` on it; red text and icons use `#C2332C`. Muscle-group colors (labels only): chest `#FFA987`, back `#86C5FF`, shoulders `#FFD06B`, arms `#F4A3D3`, core `#B4A6FF`, legs `#79D9BF`. Font: Plus Jakarta Sans. Light is the default theme; a dark mode with the same accent is defined in the design variables.

Use a 4-point spacing scale, minimum 44-point touch targets, accessible contrast, tabular numerals for workout values, and native-feeling navigation. Support reduced motion and dynamic text sizes.

Avoid excessive gradients, glowing borders, unnecessary charts, and decorative interface elements that make workout logging slower.

## 6. Database specification

Use UUID primary keys, foreign-key constraints, migrations, and transactions.

| Table | Responsibility |
|---|---|
| exercises | Built-in and custom exercise definitions |
| exercise_muscles | Primary and secondary muscle associations |
| routines | Reusable workout templates |
| routine_exercises | Ordered exercises within templates |
| routine_sets | Planned sets and target values |
| workout_sessions | Active and completed workouts |
| session_exercises | Historical exercise snapshots |
| workout_sets | Actual performance records |
| app_settings | Persistent user preferences |

Store canonical weights in kilograms and convert only for display. Completed sessions must remain independent of subsequent routine edits.

Enforce one active workout, exclude incomplete sets from analytics, and use transactions for multi-record operations.

## 7. Repository organization

```
atlas/
├── CLAUDE.md
├── AGENTS.md
├── .claude/
│   ├── agents/
│   ├── rules/
│   └── settings.json
├── app/
│   ├── (tabs)/
│   ├── session/
│   ├── routine/
│   └── exercise/
├── src/
│   ├── components/
│   ├── features/
│   ├── database/
│   ├── services/
│   ├── stores/
│   ├── theme/
│   ├── hooks/
│   └── types/
├── assets/
├── tests/
└── docs/
    ├── PRODUCT_SPEC.md
    ├── DESIGN_SYSTEM.md
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    ├── CONTRACTS.md
    ├── ROADMAP.md
    ├── DECISIONS.md
    └── HANDOFFS.md
```

`docs/CONTRACTS.md` is particularly important. Claude Code must define the TypeScript types and service interfaces that Codex's screens consume.

## 8. Development and collaboration workflow

Use separate Git branches or worktrees for the two agents.

```bash
git worktree add ../atlas-core -b feature/core
git worktree add ../atlas-ui -b feature/ui
```

The workflow for each feature is:
1. Agree on the feature specification and acceptance criteria.
2. Claude Code defines domain types, persistence, and service contracts.
3. Codex implements the original interface using those contracts.
4. Claude Code integrates the feature.
5. Both agents run relevant checks and review the result.
6. Merge only after validation.
7. Update documentation to match the verified implementation.

Do not allow both agents to edit shared configuration, route definitions, or database schemas simultaneously.

## 9. Harness and model routing

Use Claude Code's native project instructions, rules, subagents, and hooks.

Recommended model allocation: Sonnet for routine implementation, Opus for difficult architecture and debugging, and Haiku for lightweight documentation where available.

Required validation gates:

```bash
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```

Configure the test command for the actual runner. Add Maestro mobile tests once critical user flows are functional.

Hooks should automate safe validation and reporting, not grant unrestricted command execution or endlessly retry failed changes.

Obsidian can maintain project decisions and progress notes. Graphify can help analyze code relationships once the repository grows. Neither should replace Git history or the source files in `docs/`.

## 10. Milestones (ordered; not time-boxed)

| # | Claude Code deliverable | Codex deliverable |
|---|---|---|
| 1 | Expo foundation, database, navigation contracts | Design system, reusable primitives |
| 2 | Exercise repository and search logic | Exercise library and details screens |
| 3 | Routine services and persistence | Routine builder and library |
| 4 | Active workout engine and recovery | Active workout interface |
| 5 | Timer logic and session history | Timer, summary and history screens |
| 6 | Analytics calculations and queries | Progress charts and records |
| 7 | Data export, validation and integration | Accessibility and visual polish |
| 8 | Android/iOS builds and regression testing | Final device-level UI review |

These are milestones, not guaranteed deliverables on a schedule. Adjust them based on actual complexity and available development time. (Open proposal, not yet decided: build a thin end-to-end "log a workout" slice right after milestone 1 to de-risk persistence and recovery early.)

## 11. Acceptance criteria

ATLAS MVP is complete only when a user can create a routine, start it, record sets, finish the workout, and review accurate history and progress without internet access.

The app must also survive unexpected termination, restore unfinished sessions, preserve data when units change, and successfully export and restore records.

Android must install and launch on a physical device. iOS must be tested on a physical device using an appropriate Apple signing and private distribution method.
