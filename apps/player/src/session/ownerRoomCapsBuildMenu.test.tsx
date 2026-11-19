import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  getRoomDefinition,
  getRotatedFootprint,
  roomsOverlap,
  serializeGameState,
  type GameState,
  type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { BuildPanel } from "../ui/BuildPanel";
import { MobileBuildCatalog } from "../mobile/build/MobileBuildCatalog";
import { phoneFixture } from "../mobile/screenTestUtils";
import { createPrototypePlayerView } from "./viewModels";

// D-2026-11-18-09, including "Peri-op 4, Break rooms 3". These are owner
// expectations, not labels supplied to a mocked presenter or read from balance.
const ownerCaps = [
  ["room.waiting", 3], ["room.examination", 10],
  ["room.pediatric_waiting", 2], ["room.pediatric_examination", 4],
  ["room.bathroom", 6], ["room.phlebotomy", 3], ["room.laboratory", 1],
  ["room.reading", 4], ["room.minor_procedure", 3], ["room.periop_recovery", 4],
  ["room.evs_closet", 6], ["room.coffee_kiosk", 5], ["room.staff_break", 3],
  ["room.pharmacy", 2], ["room.wound_ostomy", 2], ["room.vending", 5],
  ["room.xray", 2], ["room.ultrasound", 2], ["room.ct", 2], ["room.endoscopy", 6],
  ["room.training", 1], ["room.glp1_telehealth_suite", 5], ["room.ambulatory_or", 4],
  ["room.maintenance_workshop", 1], ["room.surgeon_office", 4], ["room.mri", 1],
  ["room.founder_office", 1], ["room.executive_office", 1], ["room.gift_shop", 2],
  ["room.indoor_garden", 4], ["room.staff_gym", 1],
] as const;
const noop = () => undefined;

function savedClinic(id: string, built: number): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.owner-caps-build-menu",
    campaignSeed: "owner-caps-build-menu-synthetic",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 5;
  state.cash = 1_000_000;
  state.cashCents = 100_000_000;
  state.paused = true;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  const add = (definitionId: string) => {
    const definition = getRoomDefinition(definitionId)!;
    const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
    const size = getRotatedFootprint(definition, 0);
    for (let y = 0; y <= facility.gridHeight - size.height; y++) {
      for (let x = 0; x <= facility.gridWidth - size.width; x++) {
        const room: PlacedRoom = {
          id: `menu.fixture.${state.rooms.length}`, roomDefinitionId: definitionId,
          x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
        };
        if (state.rooms.every(other => !roomsOverlap(room, definition, other, getRoomDefinition(other.roomDefinitionId)!))) {
          state.rooms.push(room);
          return;
        }
      }
    }
    throw new Error(`No legal synthetic site for ${definitionId}`);
  };
  const ensureDependencies = (definitionId: string) => {
    for (const required of getRoomDefinition(definitionId)!.requiredRoomDefinitionIds) {
      if (state.rooms.some(room => room.roomDefinitionId === required)) continue;
      ensureDependencies(required);
      add(required);
    }
  };
  ensureDependencies(id);
  for (let index = 0; index < built; index++) add(id);
  // Present a real hydrated saved clinic, including over-cap clinics. No supplied
  // RoomBuildOptionView can conceal an incorrect cap in the production selector.
  const loaded = deserializeGameState(serializeGameState(state));
  expect(loaded.rooms.filter(room => room.roomDefinitionId === id)).toHaveLength(built);
  return loaded;
}

function catalog(layout: "desktop" | "phone", state: GameState): string {
  const view = createPrototypePlayerView(state, null, false, null, true);
  if (layout === "phone") {
    return renderToStaticMarkup(<MobileBuildCatalog props={phoneFixture({ ...view, buildMode: true })}
      onChoose={noop} onOpenRoom={noop} onDoors={noop} />);
  }
  return renderToStaticMarkup(<BuildPanel buildMode cashLabel={view.resourceBar.moneyLabel}
    roomOptions={view.roomOptions} ownedRooms={view.ownedRooms} lockedRoomOptions={view.lockedRoomOptions}
    placementOrientation={0} onEnterBuildMode={noop} onExitBuildMode={noop} onSelectRoom={noop}
    onCancelPlacement={noop} onRotatePlacement={noop} onUpgradeRoom={noop} onOpenRoom={noop}
    buildDoorTool={null} onBuildDoorToolChange={noop} onUndoBuildAction={noop} undoCount={0}
    exitBlockedReason={null} exitBlockedIssues={[]} onEndoscopySetupAction={noop} />);
}

function roomButton(markup: string, layout: "desktop" | "phone", id: string): string {
  const attribute = layout === "phone" ? "data-build-room-option" : "data-room-definition-id";
  const card = [...markup.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)]
    .map(match => match[0]).find(button => button.includes(`${attribute}="${id}"`));
  expect(card, `${layout} must render the real ${id} catalog button`).toBeDefined();
  return card!;
}

describe.each(["desktop", "phone"] as const)("owner room cap labels in the %s Build presenter", layout => {
  it.each(ownerCaps)("shows %s's built/%i label below and at the owner cap, with the corresponding command gate", (id, cap) => {
    for (const built of [cap - 1, cap]) {
      const state = savedClinic(id, built);
      const button = roomButton(catalog(layout, state), layout, id);
      const visibleText = button.replace(/<[^>]*>/g, " ");
      expect(visibleText).toContain(`${built} / ${cap} built`);
      const openingTag = button.slice(0, button.indexOf(">") + 1);
      expect(/\sdisabled(?:=|\s|>)/.test(openingTag), `${layout} ${id} at ${built}/${cap}`).toBe(built === cap);
      if (built === cap) expect(visibleText).toContain(`Maximum ${cap} built.`);
    }
  });

  it("shows all 14 grandfathered exams as 14 / 10 built and blocks only further construction", () => {
    const state = savedClinic("room.examination", 14);
    const view = createPrototypePlayerView(state, null, false, null, true);
    expect(view.ownedRooms.filter(room => room.roomDefinitionId === "room.examination")).toHaveLength(14);
    const button = roomButton(catalog(layout, state), layout, "room.examination");
    const visibleText = button.replace(/<[^>]*>/g, " ");
    expect(visibleText).toContain("14 / 10 built");
    expect(visibleText).toContain("Maximum 10 built.");
    expect(/\sdisabled(?:=|\s|>)/.test(button.slice(0, button.indexOf(">") + 1))).toBe(true);
  });
});
