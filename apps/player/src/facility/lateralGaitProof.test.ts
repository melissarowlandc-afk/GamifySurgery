import { describe, expect, it } from "vitest";
import { normalizePatientAppearanceForSex } from "@gamify-surgery/game-domain";
import { createUnifiedFounderAppearance } from "../content/founderAppearancePresets";
import { traceLateralGaitRoute } from "./lateralGaitProof";

describe("live lateral gait route proof", () => {
  const authoredPatient = {
    ...normalizePatientAppearanceForSex(createUnifiedFounderAppearance(0), "Female"),
    roleStyle: "patient" as const,
    patientIdentityId: "patient.adult.017" as const,
  };
  const legacyStaff = {
    ...createUnifiedFounderAppearance(4),
    roleStyle: "receptionist" as const,
  };

  it.each([
    ["authored patient", authoredPatient, "patients"],
    ["legacy staff", legacyStaff, "actors"],
    ["ambient authored passer", { ...authoredPatient, patientIdentityId: "patient.adult.035" as const }, "patients"],
  ] as const)("keeps %s pointed along a sampled live route", (_label, appearance, family) => {
    const frames = traceLateralGaitRoute(appearance);
    expect(frames.map((frame) => `${frame.travel}:${frame.pose}`)).toEqual([
      "west:walk-a", "west:walk-neutral", "west:walk-b",
      "east:walk-a", "east:walk-neutral", "east:walk-b",
    ]);
    expect(frames.filter((frame) => frame.travel === "west").every((frame) => !frame.movingRight && !frame.flipX)).toBe(true);
    expect(frames.filter((frame) => frame.travel === "east").every((frame) => frame.movingRight && (family === "patients" ? !frame.flipX : frame.flipX))).toBe(true);
    expect(frames.map((frame) => frame.atlasId)).toEqual(
      family === "patients"
        ? [
          "character:patients-left-walk-a-v1-r6", "character:patients-left-walk-neutral-v1-r6", "character:patients-left-walk-b-v1-r6",
          "character:patients-right-walk-a-v1-r6", "character:patients-right-walk-neutral-v1-r6", "character:patients-right-walk-b-v1-r6",
        ]
        : [
          "character:actors-left-walk-a-v3", "character:actors-left-idle-v3", "character:actors-left-walk-b-v3",
          "character:actors-left-walk-a-v3", "character:actors-left-idle-v3", "character:actors-left-walk-b-v3",
        ],
    );
  });
});
