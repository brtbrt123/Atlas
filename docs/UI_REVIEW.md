# Native UI verification plan

Status: partial verification on 9 November 2026. The Expo foundation now exists. `tests/ui/primitives.test.tsx` passes six RNTL checks; full project tests pass seven checks across two suites, with typecheck/lint also passing. Native screenshot, large-text and assistive-technology checks remain unexecuted and require a mounted preview/device path. The checklist below is not a passing device report or executable Maestro flow.

## Component behavior

When the actual React/RNTL versions are installed, test semantic roles and accessible names, invalid numeric entry, pending and rejected saves, draft retention and double-tap prevention. Check success only after persistence confirmation and recovery from a service error. Shared domain validation belongs to Claude Code; UI tests exercise the agreed outcomes rather than duplicate the engine.

## Visual matrix

Capture native Android and iOS at 320/390/768 logical widths where supported, landscape, default and large text, keyboard open, reduced motion, long names, empty/loading/error/content and pending/completed states. Store reviewed screenshots in `.ui-review/` or the agreed versioned baseline location. Record device, OS, app revision, fixture and scale. Compare spacing, hierarchy, contrast, clipping, safe areas, reachability and state changes. A web preview is supplementary evidence only.

## Accessibility

Use TalkBack and VoiceOver manually: heading/field order, field names and units, completion announcements, disabled/busy controls, focus after dialogs, no focus on hidden content, external keyboard access, and no inaccessible nested groups. Test native font scaling at 200% or the device maximum and optional haptics disabled. WCAG numerical checks do not establish mobile accessibility by themselves.

## Maestro integration boundary

Do not invent app IDs, test routes or fake passing flows. Once Claude Code supplies an installable build and stable selectors, add smoke flows for start/resume, set entry, save failure/retry and finish confirmation. Then add termination/relaunch recovery with the engine owner. Run against an explicit device and record the Maestro version. Screenshots and flows require an installed app and Android SDK/device connection or macOS iOS simulator tooling.

Maestro release acquisition and local CLI verification are tracked in `UI_ENVIRONMENT.md`; a working CLI does not mean a device test passed. Native iOS simulator testing requires a macOS host. Android and physical iOS verification must be scheduled before calling screens finished.
