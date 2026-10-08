import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EventMessageBoard } from "./EventMessageBoard";
import { ClinicMapPins } from "../facility/ClinicMapPins";
import { createNeedsYouView } from "../session/alertsEventsViewModel";
import { TUTORIAL_ENCOUNTER_ID, createInitialGameState, gameReducer, type GameState } from "@gamify-surgery/game-domain";
import type { NeedsYouItemView } from "./types";

const card = (id: string): NeedsYouItemView => ({ id, kind: "patient", title: `${id} may walk out`, why: "Satisfaction is close to the departure threshold.", sortKey: 1, actionLabel: "Open chart", action: { kind: "open_chart", encounterId: id } });

describe("two-zone clinic board", () => {
  it("shows at most three actionable cards above the time-ordered feed without fillers", () => {
    const html = renderToStaticMarkup(<EventMessageBoard items={[{ id: "joke", message: "The printer has opinions.", speaker: "Printer", timeLabel: "Day 1, 9:00 AM", rowKind: "humor" }]} needsYou={[card("A"), card("B"), card("C"), card("D")]} onNeedAction={vi.fn()} />);
    expect((html.match(/data-need-id=/g) ?? [])).toHaveLength(3);
    expect(html).toContain("+1 other actionable problems");
    expect(html.indexOf("Needs you")).toBeLessThan(html.indexOf("Around the clinic"));
    expect(html).toContain("Printer"); expect(html).toContain("9:00 AM");
    expect(html).not.toContain("Dismiss"); expect(html).not.toContain("Acknowledge");
  });
  it("keeps cards visible in the compact Build tray and hides its feed", () => {
    const html = renderToStaticMarkup(<EventMessageBoard items={[]} needsYou={[card("A")]} compact onNeedAction={vi.fn()} />);
    expect(html).toContain("is-build-tray"); expect(html).toContain('data-need-id="A"'); expect(html).toContain('hidden=""');
    expect(html).not.toContain("needs-you-deadline");
  });
  it("renders the day summary as a divider with one review and shows real deadlines and failed-action reasons", () => {
    const payroll: NeedsYouItemView = { ...card("payroll"), kind: "payroll", deadline: { minutesLeft: 5, windowMinutes: 15, label: "Posting at 8:15 AM" } };
    const html = renderToStaticMarkup(<EventMessageBoard needsYou={[payroll]} onNeedAction={vi.fn()} failures={{ payroll: "The consultation is on cooldown." }} items={[{ id: "day", rowKind: "day_summary", message: "11 patients seen · $1240 earned · satisfaction 82%", daySummary: { dayNumber: 1, patientsSeen: 11, moneyEarnedLabel: "$1240", satisfactionLabel: "82%", reviewLine: "Three magazines and zero clinicians." } }]} />);
    expect(html).toContain("is-day_summary"); expect(html).toContain("Review of the day"); expect(html).toContain('value="5"'); expect(html).toContain("consultation is on cooldown");
  });
});

describe("dire cards and their map locations", () => {
  function scene(state: GameState) {
    const needs = createNeedsYouView(state);
    const pins = needs.slice(0, 3).flatMap((item) => item.pin ? [{ id: item.id, title: item.title, actionLabel: item.actionLabel, target: item.pin }] : []);
    const onAction = vi.fn();
    const pinTree = ClinicMapPins({ pins, positions: pins.map((pin) => ({ id: pin.id, x: 120, y: 90 })), onAction });
    return { needs, pins, onAction, pinTree,
      board: renderToStaticMarkup(<EventMessageBoard items={[]} needsYou={needs} onNeedAction={vi.fn()} />),
      pinMarkup: renderToStaticMarkup(pinTree) };
  }
  function payrollState() {
    let state = createInitialGameState(); state.facilityLevel = 1; state.cash = 5000; state.cashCents = 500000;
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire.for.payroll", staffRoleDefinitionId: "staff.receptionist", employeeId: "employee.at.risk" });
    expect(state.operationReceipts["hire.for.payroll"]?.status).toBe("applied");
    state.cash = 0; state.cashCents = 0; state.facilityTick = 10; state.nextFinancialPostingTick = 15;
    return state;
  }
  it("shows a live departure card and the named patient's pin, which forwards its chart action", () => {
    const state = createInitialGameState();
    const patient = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    patient.waiting.patienceExempt = false; patient.patientMovement = null;
    patient.checkInStatus = "checked_in"; patient.idleWaitingSinceTick = 1;
    patient.patientSatisfaction = patient.walkoutThreshold + 5;
    const result = scene(state);
    expect(result.board).toContain(`${patient.patientDisplayName} may walk out`);
    expect(result.board).toContain("Open chart"); expect(result.board).not.toContain("<meter");
    expect(result.pins).toMatchObject([{ target: { kind: "patient", id: patient.id } }]);
    expect(result.pinMarkup).toContain(`aria-label="${patient.patientDisplayName} may walk out: Open chart"`);
    result.pinTree.props.children[0]!.props.onClick({ stopPropagation: vi.fn() });
    expect(result.onAction).toHaveBeenCalledExactlyOnceWith(result.needs[0]!.id);
    state.openChartEncounterId = patient.id;
    expect(scene(state).pinMarkup).not.toContain("<button");
  });
  it("shows zero cash as one actionable payroll card, with a real deadline and no invented finance pin", () => {
    const state = payrollState();
    const result = scene(state);
    expect(result.needs).toHaveLength(1);
    expect(result.board).toContain("Next payroll is underfunded");
    expect(result.board).toContain("Emergency consult"); expect(result.board).toContain('value="5"');
    expect(result.pins).toEqual([]); expect(result.pinMarkup).not.toContain("<button");
    state.employees = [];
    expect(scene(state).board).toContain("All quiet.");
  });
  it("names employees at actual quit risk in the same payroll card and keeps it a global finance action", () => {
    const state = payrollState(); state.employees[0]!.morale = 12;
    const result = scene(state);
    expect(result.needs).toHaveLength(1);
    expect(result.board).toContain(state.employees[0]!.displayName);
    expect(result.board).toContain("could quit"); expect(result.board).toContain("Emergency consult");
    expect(result.pins).toEqual([]); expect(result.pinMarkup).not.toContain("<button");
    state.cash = 100; state.cashCents = 10000;
    expect(scene(state).board).toContain("All quiet.");
  });
});
