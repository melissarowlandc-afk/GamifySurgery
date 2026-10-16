import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import { MobilePatients } from "./MobilePatients";
import { MobileChart } from "./MobileChart";
import { MobilePrototypeTools } from "./MobilePrototypeTools";
import { MobileHelpTopic } from "./MobileHelpTopic";
import { HELP_TOPICS } from "../ui/HelpDialog";
import { phoneLocatedModel, phoneMapFocusPoint } from "./phoneMapFocus";
import MobileShell from "./MobileShell";
import { phoneFixture, phoneTestDom, cleanupPhoneTests, noop } from "./screenTestUtils";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));
afterEach(cleanupPhoneTests);
describe("manager phone polish", () => {
  it("shows satisfaction once on a patient card and keeps waiting metadata", () => {
    const markup = renderToStaticMarkup(<MobilePatients patients={[{ id: "patient", name: "Fixture", folder: "waiting", satisfactionPercent: 100,
      statusLabel: "Chart ready", subtitle: "Satisfaction: 100% · Waiting", selected: false, actionRequired: true }]}
      onOpen={noop} onOpenDiscussion={noop} />);
    expect(markup.match(/Satisfaction/g)).toHaveLength(1); expect(markup).toContain("Waiting");
  });
  it("labels the chart satisfaction rather than leaving a bare percentage", () => {
    const markup = renderToStaticMarkup(<MobileChart chart={{ id: "patient", patientName: "Fixture", patientDetails: "Fixture", statusLabel: "Ready",
      presentation: "Fixture story", answerChoices: [], patientSatisfactionLabel: "100%", terminalFeedbackNeedsAcknowledgment: false,
      summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: false }} onClose={noop} onSubmitAnswer={noop}
      onFlagQuestion={noop} onAcknowledgeTerminalFeedback={noop} onToggleSummary={noop} onFileChart={noop} />);
    expect(markup).toContain("Satisfaction 100%"); expect(markup).not.toContain(">100%</p>");
  });
  it("discloses Prototype tools directly and preserves tool callbacks, including local restart", async () => {
    const env = phoneTestDom(); const props = phoneFixture(); const money = vi.fn(); const fast = vi.fn();
    await env.render(<MobilePrototypeTools view={props.development} paused={false} tutorialsEnabled={true}
      onAddMoney={money} onFastForward={fast} onTogglePause={noop} onRestart={noop} onTutorialsEnabledChange={noop} />);
    expect(env.element.textContent).not.toContain("Prototype tools");
    await env.click(props.development.addMoneyLabel); await env.click(props.development.fastForwardLabel);
    expect(money).toHaveBeenCalledOnce(); expect(fast).toHaveBeenCalledOnce();
    await env.click("Restart Campaign"); expect(env.element.textContent).toContain("Restart this campaign?");
    expect(env.doc.body.childNodes).toHaveLength(1);
  });
  it("More opens the integrated tools sheet with one header and already-visible tools", async () => {
    const env = phoneTestDom(); const props = phoneFixture(); const fast = vi.fn();
    await env.render(<MobileShell {...props} onFastForward={fast} onTogglePause={noop} />);
    await env.click("More clinic options"); await env.click("Prototype tools");
    expect(env.element.textContent.match(/Prototype tools/g)).toHaveLength(1);
    expect(env.find(node => node.attributes.class?.includes("mobile-prototype-tools") ?? false).tagName).toBe("DIV");
    expect(env.button(props.development.fastForwardLabel)).toBeDefined(); expect(fast).not.toHaveBeenCalled();
  });
  it("Help explains taps and explicit confirmation without keyboard-only build instructions", () => {
    for (const id of ["charts", "build"] as const) {
      const markup = renderToStaticMarkup(<MobileHelpTopic topic={HELP_TOPICS.find(topic => topic.id === id)!} />);
      expect(markup).not.toMatch(/Escape|Enter enacts|R rotates|1–9|click/i); expect(markup).toMatch(/Tap|tap/);
    }
  });
  it("reuses existing map highlights and exact environmental locations without mutating the projection", () => {
    const facility = createPrototypePlayerView(createInitialGameState(), null, false, null).facility;
    facility.waterCooler = { location: { x: 4, y: 28 }, fillPercent: 10, needsRefill: true };
    facility.litterItems = [{ instanceId: "litter", roomInstanceId: facility.rooms[0]!.instanceId, location: { x: 6, y: 29 } }];
    const before = structuredClone(facility);
    expect(phoneLocatedModel(facility, { kind: "water", key: "water" }).waterCooler?.highlighted).toBe(true);
    expect(phoneLocatedModel(facility, { kind: "litter", id: "litter", key: "litter" }).litterItems?.[0]?.highlighted).toBe(true);
    expect(phoneMapFocusPoint(facility, { kind: "litter", id: "litter", key: "litter" })).toEqual({ x: 6, y: 29 });
    expect(phoneLocatedModel(facility, { kind: "entrance", key: "entrance" }).selectedRoomInstanceId).toBe(facility.rooms[0]!.instanceId);
    expect(facility).toEqual(before);
  });
  it("maps navigation-only alerts to phone sheets, cards and real map focus", async () => {
    const env = phoneTestDom(); const open = vi.fn(); const props = phoneFixture({ onOpenPatient: open,
      messages: [{ id: "patient", message: "Fixture", targetType: "patient", targetId: "patient-id", actionLabel: "Find patient" },
        { id: "water", message: "Fixture", targetType: "water_cooler", actionLabel: "Find water" }] });
    await env.render(<MobileShell {...props} />); await env.click("Alerts"); await env.click("Find patient");
    expect(open).toHaveBeenCalledExactlyOnceWith("patient-id");
    await env.click("Find water"); expect(env.button("Clinic").attributes["aria-current"]).toBe("page");
  });
  it("uses one top row and a left tab rail at 844x390 while keeping scrolling sheets and 44px targets", async () => {
    const env = phoneTestDom(); env.browser.innerWidth = 844; env.browser.innerHeight = 390;
    await env.render(<MobileShell {...phoneFixture({ onTogglePause: noop })} />); await env.click("More clinic options"); await env.click("Help");
    expect(env.find(node => node.attributes["aria-label"] === "Help").attributes.class).toContain("is-full");
    const css = readFileSync(new URL("./mobilePolish.css", import.meta.url), "utf8");
    expect(css).toContain('(orientation: landscape) and (min-width: 600px) and (max-height: 500px)');
    expect(css).toContain('grid-template-areas: "top top" "tabs content"'); expect(css).toContain('display: contents');
    expect(css).toContain('repeat(5, minmax(44px, 1fr))'); expect(css).toContain('max-height: none'); expect(css).toContain('overflow: auto');
    expect(css).toMatch(/\.is-collapsed\s*\{[^}]*max-height:\s*48px/);
    const base = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    expect(base).toContain('min-height: 44px !important');
    for (const selector of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(?:^|\})\s*([^@\s{}][^{}]*)\{/g)) expect(selector[1]).toMatch(/^\.mobile-shell/);
  });
});
