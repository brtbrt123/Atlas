# ATLAS design system

DEC-020 and DEC-021 are approved. The light interface uses a #F6F6F8 canvas, white surfaces, #F1F1F5 elevated controls, #FF6961 actions with #45141A labels, #C2332C action text, #1D1D24 primary text, #6B6B77 secondary text and #D9D9E1 decorative separators. Essential input boundaries use secondary text color. Shadows use 0 4 16 with 6% charcoal opacity.

Plus Jakarta Sans is embedded in the development client, weights 400 through 800. Scalable type sizes are 13/16/20/28/36 with line heights 20/24/26/36/44. Screen gutters are 20. Touch targets remain at least 48. Input radius is 16, cards 24 and buttons use capsule rounding when appropriate.

The public entry point remains src/theme/tokens.ts, with category files as sources of truth. Muscle label colors are chest #FFA987, back #86C5FF, shoulders #FFD06B, arms #F5A0D2, core #B4A6FF and legs #79D9BF. These colors identify muscles and never carry essential text alone. Body maps retain the provided path IDs, use full color for primary muscles and 55% opacity for secondary muscles, with textual muscle labels.

Equipment uses local PNGs with other.png for unsupported or unknown equipment. The preview owns example history and recent data until EXL-05 provides adapters. Runtime verification is tracked in UI_REVIEW.md. Native iOS, large text and screen-reader checks remain pending.
