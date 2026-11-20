import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, gameReducer, serializeGameState, type InspectorStillId } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../../tests/fixtures/level-five-state";
import { createPrototypePlayerView } from "../../session/viewModels";
import { describeFacilityCharacter } from "../../session/characterActivityPresentation";
import { characterRefFromKey, patientChartIdForCharacter } from "../../facility/characterInspect";
import { MobileInspectorSheet } from "../MobileInspectorSheet";
import { cleanupPhoneTests, phoneTestDom } from "../screenTestUtils";
import { describeMobileCharacter, refreshMobileSelection } from "./selection";
import { characterStandingBitmapDescriptors } from "../../art/characterBitmapArt";
import { loadMobileInspectorBitmap } from "../performance/inspectorAssets";
import { codecTestCampaign } from "../../session/cloud/codecTestSupport";
import { encodeCloudSnapshot, loadCloudSnapshot } from "../../session/cloud/snapshotCodec";

const context = createLevelFiveStateQaContext(), balance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
afterEach(async () => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = balance; await cleanupPhoneTests(); });

describe("phone inspection actors", () => {
  it("opens a small one-tap info sheet for every inspector with no chart, Praise or staff actions", async () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
    const state = createLevelFiveStateQaState("inspectors", context), model = createPrototypePlayerView(state, null, false, null).facility;
    expect(model.inspectors).toHaveLength(10);
    const before = JSON.stringify(state), close = vi.fn(), chart = vi.fn(), praise = vi.fn();
    const harness = phoneTestDom();
    for (const actor of model.inspectors!) {
      const ref = characterRefFromKey(`character:inspector:${actor.instanceId}`)!;
      expect(ref.kind).toBe("inspector"); expect(patientChartIdForCharacter(ref, model)).toBeNull();
      const describe = () => describeFacilityCharacter(state, ref);
      const selection = describeMobileCharacter(ref, model, describe, true)!;
      expect(selection).toMatchObject({ name: actor.displayName, role: "Inspector", patient: null, praise: null });
      const props = { selection, facility: model, onDescribeCharacter: describe, onClose: close, onOpenRoom: vi.fn(), onOpenPatient: chart, onPraiseEmployee: praise };
      const markup = renderToStaticMarkup(<MobileInspectorSheet {...props} />);
      expect(markup).toContain('class="mobile-sheet is-bottom"');
      for (const action of ["Open patient chart", "Praise Employee", "Room actions", "Hire", "Train", "Salary"]) expect(markup).not.toContain(action);
      await harness.render(<MobileInspectorSheet {...props} />); expect(harness.element.textContent).toContain(actor.activity);
      await harness.click(`Close ${actor.displayName}`);
    }
    expect(close).toHaveBeenCalledTimes(10); expect(chart).not.toHaveBeenCalled(); expect(praise).not.toHaveBeenCalled();
    expect(JSON.stringify(state)).toBe(before);
  });
  it("refreshes the observed room and drops a cancelled inspector instead of selecting another actor", () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
    let state = createLevelFiveStateQaState("inspectors", context), model = createPrototypePlayerView(state, null, false, null).facility;
    const actor = model.inspectors![0]!, ref = { kind: "inspector" as const, id: actor.instanceId };
    const selection = describeMobileCharacter(ref, model)!;
    state.levelFive!.inspectionPresentation.actors[0]!.targetRoomInstanceId = state.rooms.find(room => room.roomDefinitionId === "room.staff_gym")!.id;
    model = createPrototypePlayerView(state, null, false, null).facility;
    expect(refreshMobileSelection(selection, model)).toMatchObject({ activity: "Inspector · reviewing Staff Gym" });
    state = gameReducer(state, { type: "CANCEL_INSPECTION", operationId: "m7b.phone.cancel" }, context);
    expect(refreshMobileSelection(selection, createPrototypePlayerView(state, null, false, null).facility)).toBeNull();
    expect(createPrototypePlayerView(state, null, false, null).facility.inspectors).toBeUndefined();
  });
  it("deduplicates the phone's live standing-cardinal image requests without preloading seated poses", async () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
    const model = createPrototypePlayerView(createLevelFiveStateQaState("inspectors", context), null, false, null).facility;
    const images: { src?: string; onload?: () => void; onerror?: () => void }[] = [];
    vi.stubGlobal("Image", class { constructor() { images.push(this); } });
    const descriptors = characterStandingBitmapDescriptors(model.inspectors![0]!.appearance);
    const first = loadMobileInspectorBitmap(descriptors[0]!);
    expect(loadMobileInspectorBitmap(descriptors[0]!)).toBe(first);
    for (const descriptor of descriptors.slice(1)) loadMobileInspectorBitmap(descriptor);
    expect(images).toHaveLength(4);
    expect(images.every(image => image.src?.includes("/inspector-v7a/") && image.src.includes("/stand-"))).toBe(true);
    images[0]!.onload!(); expect(await first).toBe(images[0]);
  });

  it("keeps a legacy native snapshot verifiable and shows the same remapped party as local loading", async () => {
    const state = createLevelFiveStateQaState("inspectors", context);
    const lane = state.levelFive!.inspectionPresentation;
    lane.actors.forEach((actor, index) => {
      actor.stillId = `inspector-v6f.${String(index + 1).padStart(3, "0")}` as InspectorStillId;
    });
    const before = serializeGameState(state);
    const { snapshot, lineage } = await encodeCloudSnapshot({
      state, campaign: codecTestCampaign(before), lineage: { branchId: "legacy-reviewer-fixture", sequence: 0, parents: [] },
    });
    const loaded = await loadCloudSnapshot({ snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: state.campaignId, lineage });
    expect(loaded.state.levelFive).toEqual(state.levelFive);
    expect(serializeGameState(state)).toBe(before);
    const nativeParty = createPrototypePlayerView(loaded.state, null, false, null).facility.inspectors!;
    const localParty = createPrototypePlayerView(deserializeGameState(before, context), null, false, null).facility.inspectors!;
    expect(nativeParty).toEqual(localParty);
    expect(nativeParty).toHaveLength(10);
    expect(nativeParty[0]!.displayName).toBe("Dr. Ivascu");
    expect(new Set(nativeParty.map(actor => actor.appearance.stillId)).size).toBe(10);
    expect(nativeParty.every(actor => actor.appearance.stillId?.startsWith("inspector-v7a."))).toBe(true);
  });
});
