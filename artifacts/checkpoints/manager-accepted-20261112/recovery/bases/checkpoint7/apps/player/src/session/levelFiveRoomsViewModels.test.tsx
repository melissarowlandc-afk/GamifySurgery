import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, getRoomDefinition } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState, levelFiveQaCampaignId } from "../../../../tests/fixtures/level-five-state";
import { LEVEL_FIVE_ROOMS_QA_PLACEMENTS } from "../../../../tests/fixtures/level-five-rooms";
import { prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { createFreshProfile } from "./prototypeStorage";
import { createPrototypePlayerView } from "./viewModels";
import { phoneFixture, noop } from "../mobile/screenTestUtils";
import { MobileBuildCatalog } from "../mobile/build/MobileBuildCatalog";
import { MobileBuildRoom } from "../mobile/build/MobileBuildRoom";
import { BuildPanel } from "../ui/BuildPanel";
const original = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
afterEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = original; vi.restoreAllMocks(); });
const catalog = (view: ReturnType<typeof createPrototypePlayerView>) => renderToStaticMarkup(<MobileBuildCatalog props={phoneFixture({ ...view, buildMode: true })} onChoose={noop} onOpenRoom={noop} onDoors={noop} />);
const desktop = (view: ReturnType<typeof createPrototypePlayerView>) => renderToStaticMarkup(<BuildPanel buildMode cashLabel={view.resourceBar.moneyLabel}
  roomOptions={view.roomOptions} ownedRooms={view.ownedRooms} lockedRoomOptions={view.lockedRoomOptions} placementOrientation={0}
  onEnterBuildMode={noop} onExitBuildMode={noop} onSelectRoom={noop} onCancelPlacement={noop} onRotatePlacement={noop}
  onUpgradeRoom={noop} onOpenRoom={noop} buildDoorTool={null} onBuildDoorToolChange={noop} onUndoBuildAction={noop}
  undoCount={0} exitBlockedReason={null} exitBlockedIssues={[]} onEndoscopySetupAction={noop} />);

describe("M2 shared catalog, desktop and phone parity", () => {
  it.each([0, 1, 2, 3, 4] as const)("retains the entire Level %s projection and both catalogs with new definitions withheld", level => {
    vi.spyOn(Date, "now").mockReturnValue(0);
    const state = createInitialGameState(); state.facilityLevel = level;
    const view = createPrototypePlayerView(state, null, false, null, true);
    const markup = catalog(view), desktopMarkup = desktop(view);
    for (const site of LEVEL_FIVE_ROOMS_QA_PLACEMENTS) { expect(markup).not.toContain(site.roomDefinitionId); expect(desktopMarkup).not.toContain(getRoomDefinition(site.roomDefinitionId)!.displayName); }
    const previous = structuredClone(original);
    previous.facility.roomDefinitions = previous.facility.roomDefinitions.filter(r => r.unlockFacilityLevel < 5);
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = previous;
    const priorView = createPrototypePlayerView(state, null, false, null, true);
    expect(view).toEqual(priorView); expect(markup).toBe(catalog(priorView)); expect(desktopMarkup).toBe(desktop(priorView));
  });
  it("offers all five funded placement cards and implemented effects on both shells", () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease;
    const state = createLevelFiveStateQaState("pre-goal"), view = createPrototypePlayerView(state, null, false, null, true);
    const phone = catalog(view), desk = desktop(view);
    for (const site of LEVEL_FIVE_ROOMS_QA_PLACEMENTS) {
      const definition = getRoomDefinition(site.roomDefinitionId)!;
      expect(view.roomOptions.find(r => r.id === definition.id)).toMatchObject({ enabled: true, builtCountLabel: "0 / 1 built",
        costLabel: `$${definition.constructionCost.toLocaleString()}`, upkeepLabel: "$1 upkeep / hr", footprintLabel: `${definition.width} × ${definition.height} tiles` });
      expect(phone).toContain(`data-build-room-option="${definition.id}"`);
      expect(desk).toContain(definition.displayName.replaceAll("'", "&#x27;"));
    }
    expect(phone).toContain("two-minute self-service checkout"); expect(desk).toContain("two-minute self-service checkout");
  });
  it("inspects all placed rooms with sale/refund, access, native tiers and implemented support purchases only", () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease;
    const state = createLevelFiveStateQaState("rooms");
    for (const site of LEVEL_FIVE_ROOMS_QA_PLACEMENTS) {
      const view = createPrototypePlayerView(state, null, false, null, true, site.roomId);
      const owned = view.ownedRooms.find(r => r.id === site.roomId)!;
      const active = true;
      expect(owned).toMatchObject({ upgradeable: active, maxUpgradeLevel: 5, canUpgrade: active, accessProblem: false });
      if (!active) expect(owned.benefit?.note).toContain("not active");
      else expect(owned.benefit?.note).toMatch(/Ownership|Completed|Adult visitors|Daily seated management|revenue|sales/);
      expect(view.selectedRoomBuild).toMatchObject({ canUpgrade: active, canSell: true, canMove: true, accessProblem: false });
      expect(view.selectedRoomBuild!.resaleValueLabel).toMatch(/refund/);
      const markup = renderToStaticMarkup(<MobileBuildRoom props={phoneFixture(view)} room={view.selectedRoomBuild!} onMove={noop} onDoors={noop} />);
      expect(markup).toContain("Sell");
      if (active) expect(markup).toContain("Upgrade to");
      else { expect(markup).toContain("not active"); expect(markup).not.toContain("Upgrade to"); }
    }
  });
  it("creates five separate appearance campaigns and preserves edited saves on reload/shell changes", () => {
    let profile = createFreshProfile();
    for (const tier of [1, 2, 3, 4, 5]) profile = prepareLevelFiveQaProfile(profile, "rooms", tier);
    expect(profile.campaigns).toHaveLength(5);
    for (const tier of [1, 2, 3, 4, 5]) {
      const campaign = profile.campaigns.find(c => c.campaignId === levelFiveQaCampaignId("rooms", tier))!;
      expect(campaign.state.rooms.find(r => r.roomDefinitionId === "room.founder_office")!.upgradeLevel).toBe(tier);
      expect(campaign.state.levelFive!.progress.inspectionUnlocked).toBeNull();
      campaign.state.cash = 12; campaign.state.cashCents = 1200; campaign.state.paused = false;
      const resumed = prepareLevelFiveQaProfile(profile, "rooms", tier);
      expect(resumed.campaigns).toHaveLength(5); expect(resumed.campaigns.find(c => c.campaignId === campaign.campaignId)).toBe(campaign);
    }
    expect(() => prepareLevelFiveQaProfile(profile, "rooms", 6)).toThrow();
  });
});
