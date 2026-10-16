import { isCharacterMovingPose } from "./characterPresentation";

/**
 * Owner-approved character movement (Walk Lab, October 7, 2026): contact
 * shadow, hop steps, squash and stretch, breathing and a furniture drop-in.
 * Presentation only. Routes, travel speed, arrival times and saves are
 * unchanged: hop offsets are bounded and return to zero at every landing
 * and after every stop.
 */
export const CHARACTER_HOP = {
  /** Peak hop height in base-world pixels at camera zoom 1. */
  liftHeight: 7,
  /** 1 means the feet stop completely at each landing. */
  plant: 1,
  squash: 0.03,
  stretch: 0.025,
  /** Strides grow in whole tiles so fast game speeds never exceed this. */
  maxHopsPerSecond: 4,
  /** Each character's first hop is shorter by up to this share of a stride. */
  maxFirstHopShortening: 0.5,
  startSquashRampMilliseconds: 25,
  settleMilliseconds: 120,
  landingSquashMilliseconds: 160,
  sitDropHeight: 6,
  sitDropMilliseconds: 110,
  sitSquash: 0.04,
  sitSquashMilliseconds: 130,
  breathDepth: 0.02,
  breathPeriodMilliseconds: 3_200,
  breathPeriodSpread: 0.15,
  breathFadeInStartMilliseconds: 250,
  breathFadeInEndMilliseconds: 700,
  shadowAlpha: 0.45,
  /** Shadow width as a share of the still's display width. */
  shadowWidthRatio: 0.6,
  /** Shadow height as a share of the shadow's width. */
  shadowHeightRatio: 0.32,
  shadowShrinkAtPeak: 0.2,
  shadowFadeAtPeak: 0.4,
} as const;

const TAU = Math.PI * 2;

/** Stable pseudo-random value in [0, 1) for one character key (FNV-1a), so a
 * character keeps the same rhythm through pauses, redraws and reloads. */
export function characterMotionSeed(key: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) / 0x1_0000_0000;
}

/** Whole tiles per hop: one tile at 1× and 2×, two tiles at 4×. */
export function characterHopStrideTiles(tilesPerSecond: number): number {
  const speed = Number.isFinite(tilesPerSecond) ? Math.max(0, tilesPerSecond) : 0;
  return Math.max(1, Math.ceil(speed / CHARACTER_HOP.maxHopsPerSecond - 1e-9));
}

export interface CharacterHopState {
  readonly moving: boolean;
  /** Hop phase in radians; landings fall on whole multiples of 2π. */
  readonly phase: number;
  readonly firstHopTiles: number;
  readonly strideTiles: number;
  /** Game-speed milliseconds since setting off. */
  readonly walkMilliseconds: number;
  /** Game-speed milliseconds since stopping. */
  readonly stopMilliseconds: number;
  /** Real milliseconds since stopping (breathing ignores game speed). */
  readonly restMilliseconds: number;
  readonly settleFromOffsetTiles: number;
  readonly settleFromLift: number;
  /** Last travel direction as a grid unit vector. */
  readonly travelX: number;
  readonly travelY: number;
  /** True once the character has walked, which enables the furniture drop. */
  readonly walked: boolean;
}

export interface CharacterHopInput {
  readonly moving: boolean;
  /** Route distance the logical position advanced this frame, in tiles. */
  readonly travelledTiles: number;
  readonly realMilliseconds: number;
  readonly gameMilliseconds: number;
  /** Logical travel speed including game speed. */
  readonly tilesPerSecond: number;
  readonly seed: number;
  readonly travelX: number;
  readonly travelY: number;
}

function phaseToTiles(phase: number, firstHopTiles: number, strideTiles: number): number {
  return phase < TAU
    ? (phase / TAU) * firstHopTiles
    : firstHopTiles + ((phase - TAU) / TAU) * strideTiles;
}

function tilesToPhase(tiles: number, firstHopTiles: number, strideTiles: number): number {
  return tiles < firstHopTiles
    ? (tiles / firstHopTiles) * TAU
    : TAU + ((tiles - firstHopTiles) / strideTiles) * TAU;
}

function hopLift(phase: number): number {
  return (0.5 - 0.5 * Math.cos(phase)) * CHARACTER_HOP.liftHeight;
}

function settleRemaining(milliseconds: number): number {
  const progress = Math.min(1, Math.max(0, milliseconds / CHARACTER_HOP.settleMilliseconds));
  return 1 - (3 * progress ** 2 - 2 * progress ** 3);
}

function smoothstep(start: number, end: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

/**
 * Advances one character's hop by the distance its logical route position
 * moved. A route waiting for its next tick finishes the hop in progress at
 * walking speed, then waits on the ground instead of hanging in the air.
 */
export function advanceCharacterHop(
  previous: CharacterHopState | undefined,
  input: CharacterHopInput,
): CharacterHopState | undefined {
  const realMilliseconds = Math.max(0, input.realMilliseconds);
  const gameMilliseconds = Math.max(0, input.gameMilliseconds);
  if (input.moving) {
    const strideTiles = characterHopStrideTiles(input.tilesPerSecond);
    const starting = !previous?.moving;
    const firstHopTiles = starting
      ? strideTiles * (1 - CHARACTER_HOP.maxFirstHopShortening * Math.min(1, Math.max(0, input.seed)))
      : previous!.firstHopTiles;
    let phase = starting ? 0 : previous!.phase;
    const travelledTiles = Math.max(0, input.travelledTiles);
    if (travelledTiles > 0) {
      phase = tilesToPhase(
        phaseToTiles(phase, firstHopTiles, strideTiles) + travelledTiles,
        firstHopTiles,
        strideTiles,
      );
    } else if (!starting && realMilliseconds > 0) {
      const nextLanding = Math.ceil(phase / TAU - 1e-9) * TAU;
      const coasted = phaseToTiles(phase, firstHopTiles, strideTiles) +
        (Math.max(0, input.tilesPerSecond) * realMilliseconds) / 1_000;
      phase = Math.min(nextLanding, tilesToPhase(coasted, firstHopTiles, strideTiles));
    }
    return {
      moving: true,
      phase,
      firstHopTiles,
      strideTiles,
      walkMilliseconds: (starting ? 0 : previous!.walkMilliseconds) + gameMilliseconds,
      stopMilliseconds: 0,
      restMilliseconds: 0,
      settleFromOffsetTiles: 0,
      settleFromLift: 0,
      travelX: input.travelX,
      travelY: input.travelY,
      walked: true,
    };
  }
  if (!previous) return undefined;
  if (previous.moving) {
    // The first stopped frame eases out from exactly what was last drawn.
    return {
      ...previous,
      moving: false,
      stopMilliseconds: 0,
      restMilliseconds: 0,
      settleFromOffsetTiles: characterHopOffsetTiles(previous),
      settleFromLift: hopLift(previous.phase),
    };
  }
  return {
    ...previous,
    stopMilliseconds: previous.stopMilliseconds + gameMilliseconds,
    restMilliseconds: previous.restMilliseconds + realMilliseconds,
  };
}

/**
 * How far the drawn position trails the logical route position, in tiles
 * (negative values lead it). Zero at every landing, so feet plant there.
 */
export function characterHopOffsetTiles(state: CharacterHopState | undefined): number {
  if (!state) return 0;
  if (!state.moving) {
    return state.settleFromOffsetTiles * settleRemaining(state.stopMilliseconds);
  }
  const hopTiles = state.phase < TAU ? state.firstHopTiles : state.strideTiles;
  return (CHARACTER_HOP.plant * Math.sin(state.phase) * hopTiles) / TAU;
}

export interface CharacterDrawMotion {
  /** Base-world pixels above the floor at camera zoom 1. */
  readonly lift: number;
  readonly scaleX: number;
  readonly scaleY: number;
  /** Contact shadow alpha; zero hides it. */
  readonly shadowAlpha: number;
  /** Contact shadow size multiplier; it shrinks as the character rises. */
  readonly shadowScale: number;
}

export const RESTING_CHARACTER_MOTION: CharacterDrawMotion = {
  lift: 0,
  scaleX: 1,
  scaleY: 1,
  shadowAlpha: CHARACTER_HOP.shadowAlpha,
  shadowScale: 1,
};

export function characterDrawMotion(
  state: CharacterHopState | undefined,
  pose: string,
  breathing: Readonly<{ seed: number; clockMilliseconds: number }>,
): CharacterDrawMotion {
  let lift = 0;
  let squash = 0;
  let stretch = 0;
  const walking = isCharacterMovingPose(pose);
  if (walking && state?.moving) {
    lift = hopLift(state.phase);
    squash = CHARACTER_HOP.squash *
      Math.max(0, Math.cos(state.phase)) ** 6 *
      Math.min(1, state.walkMilliseconds / CHARACTER_HOP.startSquashRampMilliseconds);
    stretch = CHARACTER_HOP.stretch * Math.sin(state.phase) ** 2;
  } else if (!walking && state && !state.moving) {
    const since = state.stopMilliseconds;
    if (pose === "seated" || pose === "exam-table") {
      if (since < CHARACTER_HOP.sitDropMilliseconds) {
        const progress = since / CHARACTER_HOP.sitDropMilliseconds;
        lift = CHARACTER_HOP.sitDropHeight * (1 - progress * progress);
      } else if (since < CHARACTER_HOP.sitDropMilliseconds + CHARACTER_HOP.sitSquashMilliseconds) {
        squash = CHARACTER_HOP.sitSquash * Math.sin(
          (Math.PI * (since - CHARACTER_HOP.sitDropMilliseconds)) / CHARACTER_HOP.sitSquashMilliseconds,
        );
      }
    } else {
      lift = state.settleFromLift * settleRemaining(since);
      if (since < CHARACTER_HOP.landingSquashMilliseconds) {
        squash = CHARACTER_HOP.squash * Math.sin((Math.PI * since) / CHARACTER_HOP.landingSquashMilliseconds);
      }
    }
  }
  let breath = 0;
  if (!walking) {
    const seed = Math.min(1, Math.max(0, breathing.seed));
    const fade = state && !state.moving
      ? smoothstep(
          CHARACTER_HOP.breathFadeInStartMilliseconds,
          CHARACTER_HOP.breathFadeInEndMilliseconds,
          state.restMilliseconds,
        )
      : state?.moving ? 0 : 1;
    const period = CHARACTER_HOP.breathPeriodMilliseconds *
      (1 + CHARACTER_HOP.breathPeriodSpread * (2 * seed - 1));
    const wave = 0.5 - 0.5 * Math.cos(TAU * (breathing.clockMilliseconds / period + seed));
    breath = CHARACTER_HOP.breathDepth * fade * wave;
  }
  const rise = Math.min(1, Math.max(0, lift / CHARACTER_HOP.liftHeight));
  return {
    lift,
    scaleX: (1 + 0.75 * squash - 0.5 * stretch) * (1 - 0.3 * breath),
    scaleY: (1 - squash + stretch) * (1 + breath),
    shadowAlpha: pose === "exam-table"
      ? 0
      : CHARACTER_HOP.shadowAlpha * (1 - CHARACTER_HOP.shadowFadeAtPeak * rise),
    shadowScale: 1 - CHARACTER_HOP.shadowShrinkAtPeak * rise,
  };
}
