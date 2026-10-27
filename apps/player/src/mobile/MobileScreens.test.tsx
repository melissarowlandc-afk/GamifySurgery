import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { EmployeeDiscussionTabView, MessageBoardItemView, NeedsYouItemView, ProgressionView } from "../ui/types";
import { MobilePatients, type MobilePatientTabView } from "./MobilePatients";
import { MobileAlerts, mobileClinicFeed } from "./MobileAlerts";
import { MobileGoals } from "./MobileGoals";
import { MobileAdvertising, MobileGlp1ConsultChip, MobileGlp1ConsultInfo } from "./MobileQuickControls";
import { allElements, cleanupPhoneTests, noop, phoneFixture, phoneTestDom } from "./screenTestUtils";

const person = (overrides: Partial<MobilePatientTabView> = {}): MobilePatientTabView => ({ id: "fixture-patient", name: "Fixture Person", folder: "waiting", subtitle: "Routine patient",
  ageLabel: "41", sexLabel: "Female", chiefComplaint: "Fixture visit", statusLabel: "Walking to Examination", actionRequired: true,
  selected: false, satisfactionPercent: 82, patienceLabel: "Waiting: 8 min", ...overrides });
afterEach(cleanupPhoneTests);

describe("phone Patients", () => {
  it("renders readable Waiting, Existing Patients and Resolved cards with the projected identity, status, estimate and attention", () => {
    const markup = renderToStaticMarkup(<MobilePatients patients={[person(), person({ id: "active", folder: "active", statusLabel: "Waiting for results · returns in 30 min" }),
      person({ id: "resolved", folder: "resolved", actionRequired: false, statusLabel: "Resolved" })]} onOpen={noop} onOpenDiscussion={noop} tutorialTargetEncounterId="fixture-patient" />);
    for (const label of ["Waiting", "Existing Patients", "Resolved", "41 · Female", "Fixture visit", "Walking to Examination", "returns in 30 min", "Satisfaction 82%", "Waiting: 8 min", "Action required", "is-tutorial-target"]) expect(markup).toContain(label);
    expect(markup).not.toContain("patient-tab-notch");
  });
  it("opens patient cards and employee discussions through their supplied IDs and keeps filed discussions read-only", async () => {
    const env = phoneTestDom(); const open = vi.fn(); const team = vi.fn();
    const discussion: EmployeeDiscussionTabView = { id: "fixture-discussion", subjectKind: "employee-discussion", employeeId: "fixture-employee", folder: "waiting", name: "Fixture Colleague",
      roleLabel: "Fixture role", statusLabel: "Action required", actionRequired: true, selected: false, blockedReason: "Fixture blocked reason" };
    await env.render(<MobilePatients patients={[person()]} discussions={[discussion, { ...discussion, id: "filed-discussion", folder: "resolved" }]} onOpen={open} onOpenDiscussion={team} />);
    await env.clickElement(env.find((node) => node.attributes["data-patient-id"] === "fixture-patient")); expect(open).toHaveBeenCalledWith("fixture-patient");
    await env.clickElement(env.find((node) => node.attributes["data-discussion-id"] === "fixture-discussion")); expect(team).toHaveBeenCalledWith("fixture-discussion");
    expect(env.element.textContent).toContain("Fixture blocked reason");
    await env.click("Resolved, 1 charts");
    expect(env.find((node) => node.attributes["data-discussion-id"] === "filed-discussion").attributes.disabled).toBe("");
  });
  it("uses availability guidance for the empty Waiting folder and retains newest-first resolved ordering", async () => {
    const env = phoneTestDom();
    await env.render(<MobilePatients patients={[person({ id: "older", folder: "resolved", sortKey: 1 }), person({ id: "newer", folder: "resolved", sortKey: 5 }),
      person({ id: "same-time", folder: "resolved", sortKey: 5 })]} onOpen={noop} onOpenDiscussion={noop} availabilityGuidance="Fixture projection: Resume to allow arrivals." />);
    expect(env.element.textContent).toContain("Fixture projection: Resume to allow arrivals.");
    await env.click("Resolved, 3 charts");
    expect(allElements(env.element, (node) => node.attributes["data-patient-id"] !== undefined).map((node) => node.attributes["data-patient-id"])).toEqual(["newer", "same-time", "older"]);
  });
  it("does not infer demographics or complaints when a legacy projection lacks them", () => {
    const markup = renderToStaticMarkup(<MobilePatients patients={[person({ ageLabel: undefined, sexLabel: undefined, chiefComplaint: undefined })]} onOpen={noop} onOpenDiscussion={noop} />);
    expect(markup).not.toContain("41"); expect(markup).not.toContain("Female"); expect(markup).not.toContain("Fixture visit");
  });
  it("expands frozen card metadata for walked-out patients without depending on an open chart", async () => {
    const env = phoneTestDom();
    await env.render(<MobilePatients patients={[person({ folder: "resolved", statusLabel: "Walked out", actionRequired: false })]}
      onOpen={noop} onOpenDiscussion={noop} />);
    expect(env.element.textContent).not.toContain("41 · Female");
    await env.click("Resolved, 1 charts");
    expect(env.element.textContent).toContain("41 · Female"); expect(env.element.textContent).toContain("Fixture visit");
  });
});

describe("phone Alerts", () => {
  const need: NeedsYouItemView = { id: "fixture-need", kind: "payroll", title: "Fixture payroll problem", why: "Fixture shortfall", sortKey: 2,
    actionLabel: "Run fixture consult", action: { kind: "emergency_consult" }, deadline: { minutesLeft: 10, windowMinutes: 60, label: "Fixture posting" } };
  const item: MessageBoardItemView = { id: "fixture-event", message: "Fixture clinic message", sortKey: 1, speaker: "Front Desk", actionLabel: "Show goals", action: { kind: "show_goals" } };
  it("places actionable needs before the clinic feed and retains a dark end-of-day summary and review", () => {
    const markup = renderToStaticMarkup(<MobileAlerts needs={[need]} items={[item, { id: "fixture-day", message: "Day 1 · 4 patients · $20 earned", rowKind: "day_summary", sortKey: 3,
      daySummary: { dayNumber: 1, patientsSeen: 4, moneyEarnedLabel: "$20", satisfactionLabel: "90%", reviewLine: "Fixture review", partial: true } }]}
      failures={{}} onNeedAction={noop} onFeedAction={noop} />);
    expect(markup.indexOf("Fixture payroll problem")).toBeLessThan(markup.indexOf("Around the clinic"));
    for (const label of ["10 min · Fixture posting", "is-day-summary", "Fixture review", "retained records"]) expect(markup).toContain(label);
  });
  it("dispatches the full current need/feed object and shows guarded failure reasons", async () => {
    const env = phoneTestDom(); const onNeed = vi.fn(); const onFeed = vi.fn();
    await env.render(<MobileAlerts needs={[need]} items={[item]} failures={{ "fixture-need": "Fixture guard refused" }} onNeedAction={onNeed} onFeedAction={onFeed} />);
    await env.click("Run fixture consult"); expect(onNeed).toHaveBeenCalledWith(need);
    await env.click("Show goals"); expect(onFeed).toHaveBeenCalledWith(item); expect(env.element.textContent).toContain("Fixture guard refused");
  });
  it("does not promote commentary or optional tips into Needs you and has calm empty states", () => {
    const markup = renderToStaticMarkup(<MobileAlerts needs={[]} items={[{ ...item, action: undefined, actionLabel: undefined, rowKind: "tip" }]} failures={{}} onNeedAction={noop} onFeedAction={noop} />);
    expect(markup).toContain("All quiet."); expect(markup).toContain("Tip ·"); expect(markup).not.toContain("mobile-need-card");
    expect(renderToStaticMarkup(<MobileAlerts needs={[]} items={[]} failures={{}} onNeedAction={noop} onFeedAction={noop} />)).toContain("Clinic events and helpful alerts will appear here.");
  });
  it("deduplicates and sorts recent feed rows exactly like the existing board, retaining the newest 30", () => {
    const feed = Array.from({ length: 35 }, (_, index) => ({ id: `row-${index}`, sortKey: index, message: `Message ${index}` }));
    const rows = mobileClinicFeed([...feed, { id: "row-34", sortKey: 40, message: "Newest copy" }]);
    expect(rows).toHaveLength(30); expect(rows[0]?.message).toBe("Newest copy"); expect(rows.at(-1)?.id).toBe("row-5");
    expect(mobileClinicFeed([{ id: "one", message: "One", sortKey: 1 }, { id: "two", message: "Two", sortKey: 1 }]).map((row) => row.id)).toEqual(["two", "one"]);
  });
});

describe("phone Goals and quick chips", () => {
  const goals: ProgressionView = { facilityLevelLabel: "Level 2", nextLevelLabel: "Level 3", prototypeComplete: false, canLevelUp: true,
    goals: [{ id: "progression.endoscopy_completion", label: "Fixture procedure goal", complete: false, progressLabel: "0/1" }],
    endoscopySetupRequirements: [
      { id: "fixture-room", label: "Fixture room", detail: "Fixture room quote", met: false, action: { label: "Build", target: "room", id: "room.endoscopy" } },
      { id: "fixture-staff", label: "Fixture staff", detail: "Fixture staff quote", met: false, action: { label: "Hire", target: "staff", id: "staff.endoscopy_nurse" } },
      { id: "fixture-provider", label: "Fixture provider", detail: "Fixture ready detail", met: true },
    ], secondaryGoals: [{ id: "secondary.level_three_first_qi_review", label: "Complete a fixture quality review", complete: false, progressLabel: "0/1" }] };
  it("shows compact progress, a collapsed setup checklist and optional tooltip; dispatches Build/Hire and Advance", async () => {
    const env = phoneTestDom(); const setup = vi.fn(); const advance = vi.fn();
    await env.render(<MobileGoals view={goals} onSetupAction={setup} onLevelUp={advance} />);
    for (const text of ["Current requirements", "0/1", "Setup checklist", "Fixture room quote", "Fixture ready detail", "Ready ✓", "Optional objective: Complete a fixture quality review. 0/1."]) expect(env.element.textContent).toContain(text);
    expect(allElements(env.element, (node) => node.attributes.role === "tooltip")).toHaveLength(1);
    const checklist = env.find(node => node.tagName === "DETAILS" && node.attributes.class === "mobile-goal-setup");
    expect(checklist.attributes.open).toBeUndefined();
    expect(allElements(checklist, node => node.tagName === "SUMMARY")[0]!.textContent).toBe("Setup checklist");
    await env.click("Build Fixture room"); await env.click("Hire Fixture staff");
    expect(setup.mock.calls).toEqual(goals.endoscopySetupRequirements!.slice(0, 2).map((requirement) => [requirement.action]));
    await env.click("Advance to Level 3"); expect(advance).toHaveBeenCalledOnce();
  });
  it("keeps Advance unavailable until the projection allows it and preserves Level complete copy", () => {
    const markup = renderToStaticMarkup(<MobileGoals view={{ ...goals, canLevelUp: false, prototypeComplete: true }} onSetupAction={noop} onLevelUp={noop} />);
    expect(markup).not.toContain("Advance to Level 3"); expect(markup).toContain("Level 4 goals complete. Keep playing; the clinic is still open.");
  });
  it("retains the ambulatory operation checklist and its scheduled-appointments guidance", () => {
    const markup = renderToStaticMarkup(<MobileGoals view={{ ...goals, goals: [{ ...goals.goals[0]!, id: "progression.ambulatory_operation_completion" }],
      ambulatoryOperationSetupRequirements: goals.endoscopySetupRequirements }} onSetupAction={noop} onLevelUp={noop} />);
    expect(markup).toContain("Ambulatory operation setup requirements"); expect(markup).toContain("With Scheduled appointments enabled");
  });
  it("uses the same advertising level steps and affordability flags", async () => {
    const env = phoneTestDom(); const change = vi.fn(); const view = { ...phoneFixture().advertising, currentLevel: 1, canDecrease: true, canIncrease: true };
    await env.render(<MobileAdvertising view={view} onLevelChange={change} />);
    expect(env.element.textContent).toContain(view.hourlyCostLabel); expect(env.element.textContent).toContain(view.arrivalFrequencyLabel);
    await env.click("Decrease advertising"); await env.click("Increase advertising"); expect(change.mock.calls).toEqual([[0], [2]]);
    await env.render(<MobileAdvertising view={{ ...view, canIncrease: false, canDecrease: false }} onLevelChange={change} />);
    expect(env.button("Increase advertising").attributes.disabled).toBe(""); expect(env.button("Decrease advertising").attributes.disabled).toBe("");
  });
  it("uses the same emergency consultation eligibility/cooldown and installed-coverage guard", async () => {
    const env = phoneTestDom(); const consult = vi.fn(); const view = { ...phoneFixture().emergencyGlp1, visible: true, enabled: true, automationCapacity: 0, cooldownProgressPercent: 100 };
    await env.render(<MobileGlp1ConsultChip view={view} onConsult={consult} />);
    await env.click(`GLP-1 consult · ${view.paymentLabel}`); expect(consult).toHaveBeenCalledOnce();
    await env.render(<MobileGlp1ConsultInfo view={{ ...view, cooldownProgressPercent: 45 }} />);
    expect(env.element.textContent).toContain(view.statusLabel);
    expect(env.find((node) => node.tagName === "PROGRESS").attributes.value).toBe("45");
    await env.render(<MobileGlp1ConsultChip view={{ ...view, enabled: false }} onConsult={consult} />);
    expect(env.find(node => node.attributes["data-phone-anchor"] === "emergency").attributes["aria-disabled"]).toBe("true");
    await env.clickElement(env.find(node => node.attributes["data-phone-anchor"] === "emergency")); expect(consult).toHaveBeenCalledOnce();
    await env.render(<MobileGlp1ConsultChip view={{ ...view, visible: false, automationCapacity: 1,
      statusLabel: "Staffed GLP-1 suites handle consultations automatically." }} onConsult={consult} />);
    expect(allElements(env.element, node => node.attributes["data-phone-anchor"] === "emergency")).toHaveLength(0);
    expect(env.element.textContent).not.toContain("Staffed GLP-1 suites handle consultations automatically.");
    expect(consult).toHaveBeenCalledOnce();
  });
  it("scopes all phone screen CSS, defines 48px answer targets, pins chart actions and maintains day-summary contrast", () => {
    const css = readFileSync(new URL("./mobileScreens.css", import.meta.url), "utf8");
    for (const [_, selector] of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{/g)) if (!selector!.trim().startsWith("@")) {
      for (const part of selector!.trim().split(",")) expect(part.trim()).toMatch(/^\.mobile-shell\s/);
    }
    expect(css).toMatch(/\.mobile-answer\s*\{[^}]*min-height:\s*48px/);
    expect(css).toMatch(/\.mobile-chart-actions\s*\{[^}]*flex:\s*0 0 auto/);
    expect(css).toMatch(/\.mobile-feed-row\.is-day-summary\s*\{[^}]*background:\s*var\(--ink\);\s*color:\s*#fff/);
  });
});
