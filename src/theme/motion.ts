/** Proposals for approved interactions, not an animation implementation. Durations are ms. */
export const motion = {
  duration: { instant: 0, press: 120, feedback: 180, disclosure: 240 },
  easing: { enter: [0.23, 1, 0.32, 1], move: [0.77, 0, 0.175, 1] },
  spring: { settle: { duration: 400, dampingRatio: 1 }, sheet: { duration: 300, dampingRatio: 0.8 } },
  reduced: { spatialDuration: 0, feedbackDuration: 0, scale: 1, translation: 0, overshoot: false },
  haptics: { enabledByDefault: false, completion: 'success', selection: 'selection' },
} as const;
