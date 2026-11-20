import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { deserializeGameState, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import approved from "../../../../tests/fixtures/kids-reviewers-acceptance.json";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { inspectionQaApply } from "../../../../tests/fixtures/level-five-inspection";
import { characterStandingBitmapDescriptors } from "../art/characterBitmapArt";
import { CHARACTER_STILL_DIRECTIONS } from "../art/characterStillRegistry";
import { getCharacterStillEntry } from "../art/characterStillRegistry";
import { MobileInspectorSheet } from "../mobile/MobileInspectorSheet";
import { describeMobileCharacter } from "../mobile/map/selection";
import { describeFacilityCharacter } from "../session/characterActivityPresentation";
import { createPrototypePlayerView } from "../session/viewModels";
import { characterRefFromKey } from "./characterInspect";
import { headlessFacilityScene } from "./retainedCameraTestSupport";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 }, Textures: { FilterMode: { LINEAR: 1 } },
  Display: { Color: { HexStringToColor: (value: string) => ({ color: Number.parseInt(value.slice(1), 16) }) } } } }));

const context = createLevelFiveStateQaContext();
const approvedBySouth = new Map(approved.reviewers.map(row => [row.poses["stand-south"], row]));
const releasedPartySize = 10;
const director = "Dr. Ivascu";
const abbreviated = ["Dr. M Ziegler", "Dr. K Ziegler", "Dr. J Robbins", "Dr. M Robbins"];

function startInspection(opening: GameState, number: number, nextRunSequence = 1) {
  let state = structuredClone(opening);
  state.campaignSeed = `reviewer.public.inspection.${number}`;
  state.levelFive!.inspection.nextRunSequence = nextRunSequence;
  state = inspectionQaApply(state, context, { type: "BOOK_INSPECTION" }, "reviewer.book");
  state = inspectionQaApply(state, context, { type: "SET_PAUSED", paused: false }, "reviewer.resume");
  const end = state.levelFive!.inspection.preparation!.endsAtFacilityTick;
  while (state.facilityTick < end) {
    state = inspectionQaApply(state, context, { type: "ADVANCE_TICK" }, `reviewer.preparation.${state.facilityTick}`);
  }
  expect(state.levelFive!.inspection.status).toBe("running");
  expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(releasedPartySize);
  return state;
}

function rosterMember(stillId: string | undefined) {
  const south = stillId && getCharacterStillEntry(stillId)?.poses.stand.south.sha256;
  return south ? approvedBySouth.get(south) : undefined;
}

function party(state: GameState) {
  return state.levelFive!.inspectionPresentation.actors.map(actor => ({ still: actor.stillId,
    reviewer: rosterMember(actor.stillId)?.name ?? null }));
}

const subgroup = (rows: ReturnType<typeof party>) => rows.slice(1).map(row => row.still).sort().join("|");

describe("owner D-2026-11-19-17 reviewer parties", () => {
  it("books ten distinct registered reviewers headed by Ivascu with a seeded sample that varies by campaign and inspection", () => {
    const opening = createLevelFiveStateQaState("inspection-ready", context);
    const first = startInspection(opening, 0), repeated = startInspection(opening, 0);
    expect(party(repeated)).toEqual(party(first));
    const differentSeeds = Array.from({ length: 8 }, (_, n) => party(startInspection(opening, n)));
    const differentRuns = Array.from({ length: 8 }, (_, n) => party(startInspection(opening, 0, n + 1)));
    const problems = [];
    for (const [index, members] of [...differentSeeds, ...differentRuns].entries()) {
      const names = members.map(row => row.reviewer);
      if (names[0] !== director || names.some(name => !name) || new Set(names).size !== releasedPartySize) {
        problems.push({ sample: index, lead: names[0], unregistered: members.filter(row => !row.reviewer).map(row => row.still) });
      }
    }
    expect.soft(problems.slice(0, 2), `Incorrect or unregistered reviewer parties: ${problems.length}/${differentRuns.length + differentSeeds.length}`).toEqual([]);
    expect.soft(new Set(differentSeeds.map(subgroup)).size, "Changing the campaign seed changes the other reviewers").toBeGreaterThan(1);
    expect.soft(new Set(differentRuns.map(subgroup)).size, "A new inspection in the same campaign can draw different reviewers").toBeGreaterThan(1);
  }, 120_000);

  it("keeps the released party size and each saved actor's identity, art, and route after real codec reload", () => {
    const state = startInspection(createLevelFiveStateQaState("inspection-ready", context), 1);
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.levelFive!.inspectionPresentation.actors).toHaveLength(releasedPartySize);
    expect(restored.levelFive!.inspectionPresentation.actors).toEqual(state.levelFive!.inspectionPresentation.actors);
    expect(createPrototypePlayerView(restored, null, false, null).facility.inspectors).toHaveLength(releasedPartySize);
  });

  it("draws each reviewer's own standing art and displays all approved names, including the exact abbreviated names, in map info", () => {
    const opening = createLevelFiveStateQaState("inspection-ready", context);
    const shown = new Set<string>(), observedLabels = new Set<string>();
    // Coverage is over a fixed reproducible seed window, not based on a
    // particular shuffle order. Ten actors draw nine out of 45 per inspection.
    for (let seed = 0; seed < 64 && shown.size < approved.reviewers.length; seed++) {
      const state = startInspection(opening, seed);
      const projected = createPrototypePlayerView(state, null, false, null).facility;
      const rows = projected.inspectors!;
      const matches = rows.filter(actor => {
        const member = rosterMember(actor.appearance.stillId);
        return member && !shown.has(member.name);
      });
      if (seed !== 0 && matches.length === 0) continue;
      const { scene, bridge } = headlessFacilityScene({ ...projected,
        founder: { ...projected.founder, location: undefined, path: [] },
        staff: [], patients: [], serviceVisitors: [], retailExternalActors: [], ambientPedestrians: [],
      });
      const describe = (ref: NonNullable<ReturnType<typeof characterRefFromKey>>) => describeFacilityCharacter(state, ref);
      Object.assign(bridge, { onDescribeCharacter: describe });
      // Only image IO and canvas primitives are replaced. The real scene
      // still resolves pose, direction, texture identity and inspect text.
      scene.textures.exists = (key: string) => key === "character-contact-shadow" || key.startsWith("stitchin-time-art:character-still:");
      scene.ensureCharacterStills = () => {};
      scene.drawCharacters();
      const drawn = scene.debugCharacterGaitSnapshot() as ReturnType<import("./FacilityScene").FacilityScene["debugCharacterGaitSnapshot"]>;
      for (const actor of rows) {
        const key = `character:inspector:${actor.instanceId}`, ref = characterRefFromKey(key)!;
        const visual = drawn[key], member = rosterMember(actor.appearance.stillId);
        const description = describe(ref);
        if (description) observedLabels.add(description.name);
        expect(visual?.visible, key).toBe(true);
        if (!member || shown.has(member.name)) continue;
        const entry = getCharacterStillEntry(actor.appearance.stillId!)!;
        const texture = characterStandingBitmapDescriptors(actor.appearance).find(descriptor => descriptor.id === visual!.atlasId);
        const face = CHARACTER_STILL_DIRECTIONS.find(direction => entry.poses.stand[direction].url === texture?.relativePath);
        expect(face, `${member.name} must draw a registered standing frame of their own`).toBeDefined();
        expect(entry.poses.stand[face!].sha256).toBe(member.poses[`stand-${face!}`]);
        expect(scene.inspectCharacterLabel(key, ref)?.split("\n")[0]).toContain(member.name);
        const selection = describeMobileCharacter(ref, projected, describe, true)!;
        expect(selection).toMatchObject({ name: expect.stringContaining(member.name), patient: null, praise: null });
        const markup = renderToStaticMarkup(<MobileInspectorSheet selection={selection} facility={projected}
          onDescribeCharacter={describe} onClose={() => {}} onOpenRoom={() => {}} onOpenPatient={() => {}} onPraiseEmployee={() => {}} />);
        expect(markup).toContain(member.name);
        shown.add(member.name);
      }
    }
    expect.soft([director, ...abbreviated].filter(name => !shown.has(name)), `Missing named map info and approved look. Observed labels: ${[...observedLabels].join(", ")}`).toEqual([]);
    expect(shown.size, "Every approved reviewer is reachable and shown with their own name and art").toBe(approved.reviewers.length);
  }, 120_000);
});
