# ATLAS design system · Setup approved

Setup approved by the user on 9 November 2026. The existing UI primitives and screens are earlier, unverified drafts. Their descriptions below record the intended direction, not accepted milestone completion. Runtime integration and visual review still require the Expo foundation and agreed contracts.

## Token structure

`src/theme/tokens.ts` preserves the draft import API and re-exports category tokens:

- `colors.ts`: exact eight-color ATLAS palette.
- `typography.ts`: native font families, scalable sizes, line heights, weights and tabular numerals.
- `spacing.ts`: 4-point scale, 20-point gutter, 680-point content cap and 48-point target baseline.
- `radii.ts`: 8-point inputs, 16-point cards and capsule radius.
- `variants.ts`: button, input and card recipes plus pressed/disabled/focus states; configuration only, not applied to the earlier draft.
- `motion.ts`: 120ms press, 180ms feedback, 240ms disclosure, easing and proposed springs; no animation library or behavior is installed. Reduced motion removes spatial movement. Native navigation retains platform timing.
- `accessibility.ts`: target size/spacing, contrast thresholds, text scaling and review sizes.

NativeWind must reuse these tokens once the foundation supplies it. Do not replace the brand with a skill's generated palette or introduce a parallel theme.

## Accessible color use

Use dark text on the lime primary button. Do not put white labels on lime. Primary and secondary text, accent and danger must pass 4.5:1 against the dark surfaces. Essential control boundaries need 3:1. `#344047` remains a decorative separator; input recipes use `#A6B0B7`, lime focus and red invalid outlines. Disabled opacity is not a substitute for disabled semantics, and enabled text must be reviewed in actual pressed/composited states. A checked token pair is not a rendered screen audit.

The visual identity is a compact ATLAS wordmark, charcoal surfaces, restrained lime actions and readable native typography. The Home journey moves from weekly activity to starting a session, then the last workout. Active Workout puts the exercise and previous performance directly above editable set rows. Completed sets retain their values and explicit completion labels.

## Tokens and primitives

`src/theme/tokens.ts` is the canonical palette: background #101418, surface #1E252B, elevated #293239, accent #B7F36B, text #F5F7F8, secondary #A6B0B7, border #344047, danger #EF7777. Spacing uses multiples of four. Screen gutters are 20; content caps at 680. Inputs use radius 8, cards 16. Text sizes are 13/16/22/32/40 with native system fonts; workout inputs use tabular numerals. No font download is required.

`src/components/ui.tsx` exports Type, Button, Card, Screen, Section, Feedback and useReducedMotion. Actions have at least 48-point targets, native text scaling, explicit busy/disabled semantics and pressed feedback. Feedback covers loading, empty, error and success. No automatic motion or haptic dependency is introduced. Future motion must consume the reduced-motion hook; haptics should fire only after a persisted completion.

## Responsive and accessibility review

Content is a single scrolling column. Set fields stack below 360 points or above 1.3 font scale. Labels remain visible above inputs, and inputs identify exercise, set, field and units to screen readers. Completion is conveyed by text as well as color. iOS keyboard avoidance and scrolling keep notes and controls reachable. The host app must provide safe areas, Android edge-to-edge insets, keyboard configuration and navigation focus behavior.

Device verification remains required at 320, 390 and 768 points, with large text, VoiceOver/TalkBack, landscape and the software keyboard. Review weekly labels at the largest accessibility sizes. The preview toolbar is development-only.
