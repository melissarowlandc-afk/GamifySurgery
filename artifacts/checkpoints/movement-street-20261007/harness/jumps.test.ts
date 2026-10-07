// Claude diagnostic harness (2026-10-07). Not a game test.
// Runs the real domain tick by tick, builds the real facility view model, and
// replays the renderer's route-motion logic at 60 fps to find visible jumps.
// Env: JUMP_SCENARIO=l1|l2, JUMP_TICKS, JUMP_HITCH_EVERY (ticks between a
// 250 ms frame hitch, Phaser drops >200 ms deltas), JUMP_OUT (file name).
import { it } from "vitest";
import { writeFileSync } from "node:fs";
import { gameReducer, type GridPoint } from "../../packages/game-domain/src";
import * as Current from "../../apps/player/src/facility/routeMotion";
type RouteMotionTrack = Current.RouteMotionTrack;
const M = Current;
const { advanceRouteMotion, getRouteTilesPerSecond, routeMotionComplete, sampleRouteMotion, syncRouteMotion } = M;
import { actorInputs, autoplayStep, domainNote, fmt, levelOneClinic, levelTwoClinic, retailClinic, pathNote, REAL_MS, type Input } from "./harness";

const FRAMES_PER_TICK = 60;
const TICKS = Number(process.env.JUMP_TICKS ?? 1800);
const SCENARIO = process.env.JUMP_SCENARIO ?? "l2";
const HITCH_EVERY = Number(process.env.JUMP_HITCH_EVERY ?? 0);
const JUMP_TILES = 0.6;
const COLUMNS = 72;
const ROWS = 32;

interface JumpEvent { tick: number; frame: number; key: string; label: string; kind: string; from?: string; to?: string; dist?: number; before?: string; now?: string; domain?: string }

it("replays", () => {
  let state = SCENARIO === "l1" ? levelOneClinic() : SCENARIO === "retail" ? retailClinic() : levelTwoClinic();
  const tracks = new Map<string, RouteMotionTrack>();
  const lastShown = new Map<string, GridPoint>();
  const lastInput = new Map<string, Input>();
  const lagSamples: number[] = [];
  const events: JumpEvent[] = [];
  const tilesPerSecond = getRouteTilesPerSecond(2, 1_000, 1);
  let n = 0;
  for (let t = 0; t < TICKS; t += 1) {
    for (let guard = 0; guard < 20; guard += 1) {
      const next = autoplayStep(state, n++);
      if (!next) break;
      state = next;
    }
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `j.tick.${t}`, advancedAtRealMs: REAL_MS + t * 1_000 });
    const inputs = actorInputs(state);
    for (let frame = 0; frame < FRAMES_PER_TICK; frame += 1) {
      // Phaser replaces any delta over 200 ms with an earlier sane delta, so
      // a long main-thread frame loses render time while ticks keep coming.
      const hitchTick = HITCH_EVERY > 0 && t % HITCH_EVERY === 0;
      // A 250 ms main-thread stall: Phaser replaces the >200 ms delta with an
      // earlier ~16.7 ms delta, so 15 frames of render time are simply lost.
      if (hitchTick && frame >= 2 && frame < 17) continue;
      const delta = frame === 0 ? 0 : 1_000 / FRAMES_PER_TICK;
      for (const [key, input] of inputs) {
        const previous = tracks.get(key);
        let track = syncRouteMotion(previous, { ...input, lookaheadPathNodes: 2 });
        let shown: GridPoint | undefined;
        let cause = "";
        if (!track) {
          cause = previous ? "track-dropped" : "no-track";
          tracks.delete(key);
          shown = input.location;
        } else {
          if (previous && previous.signature !== track.signature && !previous.signature.startsWith('parked:') && track.sourceOffset === 0 && track.path.length === input.path?.length) cause = "handoff-no-shared-waypoint";
          else if (!previous) cause = "track-created";
          else if (previous.signature !== track.signature) cause = "handoff";
          track = advanceRouteMotion(track, delta, tilesPerSecond);
          const sample = sampleRouteMotion(track);
          tracks.set(key, routeMotionComplete(track) ? Current.parkRouteMotion(track) : track);
          shown = sample.location;
          if (frame === FRAMES_PER_TICK - 1 && input.path && input.location && sample.moving) {
            lagSamples.push(Math.hypot(sample.location.x - input.location.x, sample.location.y - input.location.y));
          }
        }
        const before = lastShown.get(key);
        const base = { tick: t, frame, key, label: input.label, before: frame === 0 ? pathNote(lastInput.get(key)) : undefined, now: pathNote(input), domain: domainNote(state, key) };
        if (!before && shown) {
          const edge = shown.x <= 0 || shown.x >= COLUMNS - 1 || shown.y >= ROWS - 1 || shown.y <= 0;
          events.push({ ...base, kind: edge ? "appear-edge" : `appear-inside:${cause}`, to: fmt(shown) });
        } else if (before && shown) {
          const dist = Math.hypot(shown.x - before.x, shown.y - before.y);
          if (dist > JUMP_TILES) events.push({ ...base, kind: `jump:${cause || "same-track"}`, from: fmt(before), to: fmt(shown), dist: Math.round(dist * 10) / 10 });
        } else if (before && !shown) {
          const edge = before.x <= 0 || before.x >= COLUMNS - 1 || before.y >= ROWS - 1;
          events.push({ ...base, kind: edge ? "vanish-edge" : "vanish-inside", from: fmt(before) });
        }
        if (shown) lastShown.set(key, shown); else lastShown.delete(key);
      }
      for (const key of [...lastShown.keys()]) {
        if (!inputs.has(key)) {
          const from = lastShown.get(key)!;
          const edge = from.x <= 0 || from.x >= COLUMNS - 1 || from.y >= ROWS - 1;
          events.push({ tick: t, frame, key, label: lastInput.get(key)?.label ?? "?", kind: edge ? "removed-edge" : "removed-inside", from: fmt(from), before: pathNote(lastInput.get(key)), domain: domainNote(state, key) });
          lastShown.delete(key);
          tracks.delete(key);
        }
      }
    }
    for (const [key, input] of inputs) lastInput.set(key, input);
    for (const key of [...lastInput.keys()]) if (!inputs.has(key)) lastInput.delete(key);
  }
  const summary: Record<string, number> = {};
  for (const e of events) {
    if (e.kind.startsWith("appear-edge") || e.kind.endsWith("-edge")) continue;
    const k = `${e.kind} | ${e.label}`;
    summary[k] = (summary[k] ?? 0) + 1;
  }
  lagSamples.sort((a, b) => a - b);
  const lag = { n: lagSamples.length, p50: lagSamples[Math.floor(lagSamples.length * 0.5)], p95: lagSamples[Math.floor(lagSamples.length * 0.95)], max: lagSamples.at(-1) };
  writeFileSync(new URL(`./${process.env.JUMP_OUT ?? `events-${SCENARIO}`}.json`, import.meta.url), JSON.stringify({ summary, lag, events: events.filter((e) => !e.kind.endsWith("-edge")) }, null, 1));
}, 900_000);
