import { describe, expect, it } from "vitest";
import { createInitialGameState, TUTORIAL_ENCOUNTER_ID } from "@gamify-surgery/game-domain";
import { ambientSpeaker, clinicFeedSpeaker, problemOnlyActionCopy } from "./clinicFeedPresentation";

describe("clinic feed attribution and problem copy", () => {
  it.each([
    ["The water cooler has made another bubble.", "Water cooler"],
    ["Out of cyan. The printer remains optimistic.", "Printer"],
    ["The break-room fridge contains one yogurt with tenure.", "Break-room fridge"],
    ["The waiting-room plant has been promoted.", "Waiting-room plant"],
    ["The Front Desk phone rang once.", "Front Desk phone"],
    ["The label maker has labeled the label maker.", "Label maker"],
    ["The radiologists have dimmed the lights.", "Reading Room"],
    ["The Waiting Room has no spare chairs or dignity.", "Waiting Room"],
  ])("attributes %s to %s", (message, speaker) => expect(ambientSpeaker(message)).toBe(speaker));
  it("uses actual patient, employee and room identities for their rows", () => {
    const state = createInitialGameState();
    const patient = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(clinicFeedSpeaker(state, { id: "p", message: "Waiting.", targetType: "patient", targetId: patient.id })).toBe(patient.patientDisplayName);
    state.employees.push({ id: "e", displayName: "Morgan Lane" } as GameEmployee);
    expect(clinicFeedSpeaker(state, { id: "e", message: "Morale is low.", targetType: "employee", targetId: "e" })).toBe("Morgan Lane");
    expect(clinicFeedSpeaker(state, { id: "r", message: "Access is missing.", targetType: "room", targetId: state.rooms[0]!.id })).toBe("Front Desk");
  });
  it.each([
    ["The floor has acquired a backstory. Select the trash to send the founder to clean it.", "The floor has acquired a backstory."],
    ["The water cooler is empty. It is now a large blue vase. Refill it.", "The water cooler is empty. It is now a large blue vase."],
    ["The suite has no NP coverage. Hire one or restore their room assignment.", "The suite has no NP coverage."],
    ["The room is unreachable. Restore operational access.", "The room is unreachable."],
    ["Cash is low. Keep operating costs funded.", "Cash is low."],
  ])("leaves the instruction on the button for %s", (message, expected) => expect(problemOnlyActionCopy(message)).toBe(expected));
});

type GameEmployee = ReturnType<typeof createInitialGameState>["employees"][number];
