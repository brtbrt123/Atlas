# ATLAS design system · Setup approved

Setup approved by the user on 9 November 2026. DS-01 token verification is complete against the Expo foundation. DS-02 primitives compile and pass component tests but remain In Review pending native rendering and accessibility checks. Home and Active Workout remain mock-backed drafts awaiting integration contracts.

## Token structure

`src/theme/tokens.ts` preserves the draft import API and re-exports category tokens:

- `colors.ts`: exact eight-color ATLAS palette.
- `typography.ts`: native font families, scalable sizes, line heights, weights and tabular numerals.
- `spacing.ts`: 4-point scale, 20-point gutter, 680-point content cap and 48-point target baseline.
- `radii.ts`: 8-point inputs, 16-point cards and capsule radius.
- `variants.ts`: button, input and card recipes plus pressed/disabled/focus states. Button and Card consume their semantic recipes; input recipes await the numeric-entry primitive.
- `motion.ts`: 120ms press, 180ms feedback, 240ms disclosure, easing and proposed springs; no animation library or behavior is installed. Reduced motion removes spatial movement. Native navigation retains platform timing.
- `accessibility.ts`: target size/spacing, contrast thresholds, text scaling and review sizes.

NativeWind must reuse these tokens once the foundation supplies it. Do not replace the brand with a skill's generated palette or introduce a parallel theme.

## Primitive implementation review · 9 November 2026

Layout/interaction plan: retain the quiet charcoal/lime identity, use the existing type scale with explicit line heights, keep actions at least 48 units with scalable labels, and preserve one stable action name while saving. Danger buttons use their own red boundary; secondary buttons use the stronger semantic boundary. Busy actions cannot be pressed and keep full text contrast. A spinner is decorative; the control exposes busy state. Typography supports optional tabular numeric text. Cards have default/elevated variants. Scrolling requests native inset adjustment; safe-area/navigation providers remain the host's responsibility.

RNTL 14 tests cover enabled/disabled/busy actions, danger colors, error retry and heading/numeric typography (six tests passed). Strict typecheck and lint passed; the complete configured suite passed seven tests. These checks do not establish large-text fit, actual native safe areas, keyboard reachability or VoiceOver/TalkBack behavior. DS-02 remains In Review until device verification; no production route has been wired.

## Accessible color use

Use dark text on the lime primary button. Do not put white labels on lime. Primary and secondary text, accent and danger must pass 4.5:1 against the dark surfaces. Essential control boundaries need 3:1. `#344047` remains a decorative separator; input recipes use `#A6B0B7`, lime focus and red invalid outlines. Disabled opacity is not a substitute for disabled semantics, and enabled text must be reviewed in actual pressed/composited states. A checked token pair is not a rendered screen audit.

The visual identity is a compact ATLAS wordmark, charcoal surfaces, restrained lime actions and readable native typography. The Home journey moves from weekly activity to starting a session, then the last workout. Active Workout puts the exercise and previous performance directly above editable set rows. Completed sets retain their values and explicit completion labels.

## Tokens and primitives

`src/theme/tokens.ts` is the canonical palette: background #101418, surface #1E252B, elevated #293239, accent #B7F36B, text #F5F7F8, secondary #A6B0B7, border #344047, danger #EF7777. Spacing uses multiples of four. Screen gutters are 20; content caps at 680. Inputs use radius 8, cards 16. Text sizes are 13/16/22/32/40 with native system fonts; workout inputs use tabular numerals. No font download is required.

`src/components/ui.tsx` exports Type, Button, Card, Screen, Section, Feedback and useReducedMotion. Actions have at least 48-point targets, native text scaling, explicit busy/disabled semantics and pressed feedback. Feedback covers loading, empty, error and success. No automatic motion or haptic dependency is introduced. Future motion must consume the reduced-motion hook; haptics should fire only after a persisted completion.

## Responsive and accessibility review

Content is a single scrolling column. Set fields stack below 360 points or above 1.3 font scale. Labels remain visible above inputs, and inputs identify exercise, set, field and units to screen readers. Completion is conveyed by text as well as color. iOS keyboard avoidance and scrolling keep notes and controls reachable. The host app must provide safe areas, Android edge-to-edge insets, keyboard configuration and navigation focus behavior.

Device verification remains required at 320, 390 and 768 points, with large text, VoiceOver/TalkBack, landscape and the software keyboard. Review weekly labels at the largest accessibility sizes. The preview toolbar is development-only.
