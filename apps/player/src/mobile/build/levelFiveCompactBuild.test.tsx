import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../../tests/fixtures/level-five-state";
import { createPrototypePlayerView } from "../../session/viewModels";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../screenTestUtils";
import { MobileBuildCatalog } from "./MobileBuildCatalog";

vi.mock("./RoomThumbnail", () => ({ RoomThumbnail: ({ definitionId }: { definitionId: string }) => <span data-thumbnail={definitionId} /> }));
const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
afterEach(async () => { await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; });

describe("M9 compact Level 5 phone Build", () => {
  it("shows five compact New and My Rooms tiles, with earlier rooms closed and original one-tap IDs", async () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease;
    const state = createLevelFiveStateQaState("integration-build"), view = createPrototypePlayerView(state, null, false, null, true);
    const choose = vi.fn(), open = vi.fn(), dom = phoneTestDom();
    const props = phoneFixture({ ...view, buildMode: true });
    await dom.render(<MobileBuildCatalog props={props} onChoose={choose} onOpenRoom={open} onDoors={vi.fn()} />);
    const tiles = () => allElements(dom.element, node => node.attributes.class === "mobile-prestige-build-tile");
    const earlier = () => allElements(dom.element, node => node.attributes.class === "mobile-earlier-build-rooms")[0]!;
    expect(tiles()).toHaveLength(5); expect(earlier().attributes.open).toBeUndefined();
    expect(tiles().map(node => node.attributes["data-build-room-option"])).toEqual([
      "room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym",
    ]);
    await dom.click("My Rooms");
    expect(tiles()).toHaveLength(5); expect(earlier().attributes.open).toBeUndefined();
    for (const tile of tiles()) {
      const id = tile.attributes["data-build-owned-room"]!;
      await dom.clickElement(tile); expect(open).toHaveBeenLastCalledWith(id);
    }
    expect(choose).not.toHaveBeenCalled();
  });

  it.each([0, 1, 2, 3, 4])("keeps the original card presentation outside Level 5 at level %i", level => {
    const state = createLevelFiveStateQaState("pre-goal"); state.facilityLevel = level as 0 | 1 | 2 | 3 | 4;
    delete state.levelFive;
    const view = createPrototypePlayerView(state, null, false, null, true);
    const markup = renderToStaticMarkup(<MobileBuildCatalog props={phoneFixture({ ...view, buildMode: true })} onChoose={vi.fn()} onOpenRoom={vi.fn()} onDoors={vi.fn()} />);
    expect(markup).not.toContain("mobile-prestige-build-tile");
    expect(markup).not.toContain("mobile-earlier-build-rooms");
    expect(markup).toContain('class="mobile-build-card"');
  });

  it("uses scoped two/five-column layout and 44px actions without changing the earlier card rules", () => {
    const css = readFileSync(new URL("./mobileBuild.css", import.meta.url), "utf8");
    expect(css).toContain('.mobile-shell .mobile-prestige-build-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr))');
    expect(css).toContain('min-height: 44px');
    expect(css).toContain('repeat(5, minmax(0, 1fr))');
    expect(css).toContain('.mobile-shell .mobile-build-card { display: grid; grid-template-columns: 76px minmax(0, 1fr)');
  });
});
