import { readFileSync } from "node:fs";
import { parse } from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "../AppShell";
import { MobileTopBar } from "../mobile/MobileTopBar";
import MobileShell from "../mobile/MobileShell";
import { MobileBuildCatalog } from "../mobile/build/MobileBuildCatalog";
import { cleanupPhoneTests, phoneFixture, phoneTestDom, noop } from "../mobile/screenTestUtils";
import { createManageFixture } from "../mobile/manage/testFixtures";
import { StaffPanel } from "./StaffPanel";
import { ResourceBar } from "./ResourceBar";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));
vi.mock("../mobile/build/RoomThumbnail", () => ({ RoomThumbnail: () => <span className="mobile-room-thumbnail" /> }));
afterEach(cleanupPhoneTests);

describe("compact workspace UI", () => {
  it("keeps clinic rails reachable in workspace modes without changing the mode or zoom", async () => {
    const env = phoneTestDom(), props = phoneFixture({ buildMode: true, paused: true });
    const camera = props.facility.camera;
    await env.render(<AppShell {...props} />);
    expect(env.find(node => Boolean(node.attributes.class?.includes("game-shell"))).attributes.class).not.toContain("has-workspace-rails");
    await env.click("Show clinic panels");
    expect(env.button("Hide clinic panels").attributes["aria-expanded"]).toBe("true");
    expect(env.find(node => node.attributes.id === "desktop-patient-panel")).toBeDefined();
    expect(env.find(node => node.attributes.id === "desktop-operations-panel")).toBeDefined();
    await env.click("Hide clinic panels");
    expect(props.facility.camera).toBe(camera);
    expect(env.button("Show clinic panels").attributes["aria-expanded"]).toBe("false");
  });

  it("uses one phone exit while preserving the full management pause restoration path", async () => {
    const exit = vi.fn(), env = phoneTestDom();
    await env.render(<MobileShell {...phoneFixture({ ...createManageFixture(), managementMode: true, paused: true, onExitManagementMode: exit })} />);
    expect(env.element.textContent).not.toContain("Clinic pausedDone");
    expect(env.button("Close Manage")).toBeDefined();
    await env.click("Close Manage"); expect(exit).toHaveBeenCalledOnce();
    expect(env.button("Resume facility time").attributes.disabled).toBe("");
  });

  it("keeps local mode, XP, the disclaimer and refusal feedback in the compact phone header", () => {
    const markup = renderToStaticMarkup(<MobileTopBar {...phoneFixture({ buildMode: true })} onCash={noop} onMore={noop} />);
    expect(markup.match(/Local only/g)).toHaveLength(1);
    expect(markup).toContain('class="mobile-level-caption"');
    expect(markup).toContain("Learning XP progress toward next level");
    expect(markup).toContain("Exit Build Mode to resume.");
    expect(markup).toContain("not clinically approved or medical advice");
    expect(markup).toContain('aria-label="More clinic options"');
    // Facility time stays together on one line; the short locked-status region
    // shares that band, leaving a full row for all four playback/menu controls.
    expect(markup).toMatch(/class="mobile-clock-label"><small>Facility time<\/small><strong>[^<]+<\/strong><\/span><small class="mobile-clock-lock" role="status">Exit Build Mode to resume\.<\/small><\/div>/);
  });

  it("keeps direct room placement plus separately labeled inline details with exact costs and counts", () => {
    const props = phoneFixture({ buildMode: true });
    const markup = renderToStaticMarkup(<MobileBuildCatalog props={props} onChoose={noop} onOpenRoom={noop} onDoors={noop} />);
    expect(markup).toContain('class="mobile-build-navigation"');
    expect(markup).toContain('class="mobile-build-choice-facts"');
    expect(markup).toContain('aria-label="Choose Examination Room"');
    expect(markup).toContain('aria-label="Details about Examination Room"');
    expect(markup).toContain('role="tablist" aria-label="Room catalog"');
    expect(markup).toContain(props.roomOptions.find(room => room.id === "room.examination")!.costLabel);
    expect(markup).toContain(props.roomOptions.find(room => room.id === "room.examination")!.builtCountLabel);
  });

  it("keeps noncapacity hire errors prominent and guidance optional without removing employee actions", () => {
    const props = createManageFixture();
    const roles = props.staffRoles.map(role => ({ ...role, canHire: false, blockedReason: "Required room has no staff access." }));
    const markup = renderToStaticMarkup(<StaffPanel roles={roles} onHire={noop} onDecreaseSalary={noop} onIncreaseSalary={noop} onFire={noop} />);
    expect(markup).toContain('class="staff-role-hire-reason"');
    expect(markup).toContain("Required room has no staff access.");
    expect(markup).toContain('class="staff-role-guidance"');
    expect(markup).toContain('class="staff-stat-row staff-morale-row"');
    expect(markup).toContain('class="staff-stat-row staff-salary-row"');
    expect(markup).toContain("Increase Morgan Fixture&#x27;s salary");
    expect(markup).toContain(">Fire</button>");
  });

  it("keeps complete desktop mode messages in unshrunk integer line boxes", () => {
    const props = phoneFixture();
    for (const mode of ["build", "management"]) {
      const markup = renderToStaticMarkup(<ResourceBar view={props.resourceBar} paused pauseLocked
        buildMode={mode === "build"} managementMode={mode === "management"} onTogglePause={noop} />);
      expect(markup).toContain(mode === "build" ? "Facility time is stopped while you remodel." : "Facility time is stopped while you manage staff.");
      expect(markup).toContain('aria-label="Resume facility time" aria-pressed="false" disabled=""');
    }
    const css = parse(readFileSync(new URL("../styles/workspaceDensity.css", import.meta.url), "utf8"));
    const declarations: Record<string, string> = {};
    css.walkRules(rule => {
      if (rule.selector === ".game-shell .facility-time-chip:is(.is-build-mode, .is-management-mode) .resource-chip-content > strong") {
        rule.walkDecls(declaration => { declarations[declaration.prop] = declaration.value; });
      }
    });
    expect(declarations).toMatchObject({ flex: "0 0 auto", font: "700 13px/16px var(--font-read)", overflow: "visible", "white-space": "normal" });
  });

  it("parses both density styles and retains font/target/safe-area and no-empty-band contracts", () => {
    const desktop = parse(readFileSync(new URL("../styles/workspaceDensity.css", import.meta.url), "utf8"));
    const phone = parse(readFileSync(new URL("../mobile/mobileDensity.css", import.meta.url), "utf8"));
    const value = (sheet: typeof phone, selector: string, property: string) => {
      let result: string | undefined;
      sheet.walkRules(rule => { if (rule.selectors.includes(selector)) rule.walkDecls(property, declaration => { result = declaration.value; }); });
      return result;
    };
    expect(value(desktop, ".game-shell .clinic-headline", "height")).toBe("0");
    expect(value(desktop, ".game-shell .clinic-headline.is-showing", "height")).toBe("auto");
    expect(value(desktop, ".game-shell", "font-size")).toBe("13px");
    expect(value(phone, ".mobile-shell", "font-size")).toBe("14px");
    expect(value(phone, ".mobile-shell .mobile-build-card .mobile-build-choice", "min-height")).toBe("52px");
    expect(value(phone, ".mobile-shell .mobile-build-card .mobile-build-choice", "gap")).toBe("0 6px");
    expect(value(phone, ".mobile-shell .mobile-build-card .mobile-build-choice", "padding")).toBe("2px 6px");
    expect(value(desktop, ".game-shell .facility-host canvas", "width")).toBe("auto");
    expect(value(desktop, ".game-shell .facility-host canvas", "height")).toBe("auto");
    expect(value(phone, ".mobile-shell .mobile-manage-segments button", "min-height")).toBe("44px");
    expect(value(phone, ".mobile-shell .mobile-navigation", "padding-bottom")).toContain("safe-area-inset-bottom");
    expect(value(phone, ".mobile-shell .mobile-session-strip", "min-height")).toBe("0");
    expect(value(phone, ".mobile-shell .mobile-clock-row", "grid-template-columns")).toBe("repeat(4, minmax(0, 1fr))");
    expect(value(phone, ".mobile-shell .mobile-playback-controls", "grid-template-columns")).toBe("repeat(2, minmax(0, 1fr))");
    expect(value(phone, ".mobile-shell .mobile-playback-controls button", "width")).toBe("100%");
    expect(value(phone, ".mobile-shell .mobile-clock-label", "white-space")).toBe("nowrap");
    // The legacy three-class catalog rule beats .game-shell .build-card.
    // Assert against that actual rule, not just an isolated new stylesheet.
    const legacy = parse(readFileSync(new URL("../styles/global.css", import.meta.url), "utf8"));
    expect(value(legacy, ".build-mode-panel .build-room-catalog .build-card", "grid-template-columns")).toBe("30px minmax(0, 1fr)");
    const card = ".game-shell .build-mode-panel .build-room-catalog .build-card";
    expect(value(desktop, card, "grid-template-columns")).toBe("36px minmax(0, 1fr)");
    expect(value(desktop, `${card} > .room-thumbnail`, "width")).toBe("36px");
    expect(value(desktop, `${card} > .room-thumbnail`, "grid-column")).toBe("1");
    expect(value(desktop, `${card} > span:not(.room-thumbnail)`, "grid-column")).toBe("2");
    expect(value(desktop, `${card} strong`, "font-size")).toBe("13px");
    expect(value(desktop, `${card} small`, "font-size")).toBe("13px");
  });
});
