import { expect, it } from "vitest";
import { DiagnosticCalendarIndex } from "./diagnosticCalendarIndex";

it("preserves prefix/insertion order across value edits, same-size key replacement, deletion and forks", () => {
  const map = new DiagnosticCalendarIndex([["station:a:1", [1]], ["coverage:b:a", [2]], ["station:a:2", [3]]]);
  const keys = map.keysWithPrefix("station:a:"); expect(keys).toEqual(["station:a:1", "station:a:2"]);
  map.set("station:a:1", [4]); expect(map.keysWithPrefix("station:a:")).toBe(keys);
  map.delete("station:a:1"); map.set("station:a:3", [5]);
  expect(map.keysWithPrefix("station:a:")).toEqual(["station:a:2", "station:a:3"]);
  const fork = new DiagnosticCalendarIndex(map); fork.clear(); expect(fork.keysWithPrefix("station:")).toEqual([]);
  expect(map.keysWithPrefix("station:a:")).toEqual(["station:a:2", "station:a:3"]);
});
