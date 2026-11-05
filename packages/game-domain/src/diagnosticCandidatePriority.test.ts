import { expect, it } from "vitest";
import { preferAvailableHomeStaff } from "./diagnosticCandidatePriority";
import type { DiagnosticResourceChoice } from "./types";

it("matches the previous quadratic dominance rule exactly across staffing combinations and ties", () => {
  for (let seed = 0; seed < 30; seed++) {
    const candidates = Array.from({ length: 200 }, (_, i) => ({
      id: i, starts: (i * 17 + seed * 11) % 37, homeMismatch: (i * 13 + seed) % 5,
      resource: i % 13 === 0 ? null : { roomInstanceId: `room.${i % 3}`, stationId: i % 4 ? `station.${i % 2}` : null,
        provider: i % 5 ? { kind: "employee", employeeId: `employee.${i}` } : { kind: "founder" } } as DiagnosticResourceChoice,
    }));
    const exempt = (resource: DiagnosticResourceChoice) => resource.roomInstanceId === "room.2";
    const expected = candidates.filter(option => !option.resource || exempt(option.resource) || !candidates.some(other => other.resource &&
      other.resource.roomInstanceId === option.resource!.roomInstanceId && other.resource.stationId === option.resource!.stationId &&
      other.resource.provider?.kind === option.resource!.provider?.kind && other.starts <= option.starts && other.homeMismatch < option.homeMismatch));
    const actual = preferAvailableHomeStaff(candidates, exempt);
    expect(actual).toEqual(expected); actual.forEach((entry, index) => expect(entry).toBe(expected[index]));
  }
});
