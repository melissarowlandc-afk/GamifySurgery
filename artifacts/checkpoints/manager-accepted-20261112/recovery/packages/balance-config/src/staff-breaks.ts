/** Editorial simulation weights for staff welfare, not clinical/fitness claims. */
export const STAFF_BREAK_POLICY = {
  durationMinutes: 15,
  cooldownMinutes: 480,
  highMoraleThreshold: 90,
  highMoraleCooldownMultiplier: 2,
  moraleGain: 5,
  dailyMoraleGain: 1,
  dailyMoraleGainPerUpgrade: 1,
} as const;

/** Accepted saved work keeps its original duration/reward across the rebalance. */
export const LEGACY_STAFF_BREAK_DURATION_MINUTES = 30;
export const LEGACY_STAFF_BREAK_MORALE_GAIN = 5;
export const LEGACY_GYM_BREAK_MORALE_GAIN = LEGACY_STAFF_BREAK_MORALE_GAIN;
/** Keep an already accepted preview task valid after the owner's +5 correction. */
export const PREVIEW_GYM_BREAK_MORALE_GAIN = 12;
