import { expect, it } from "vitest";
import { equalParsedJson } from "./codecWorkerJsonEqual";
import { logicalJsonText, parseCodecJson, type CodecJson } from "./codecJson";

it("matches canonical comparison for parsed nested JSON, reordered keys and every changed leaf", () => {
  let seed = 7;
  const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 2 ** 32);
  const make = (depth: number): CodecJson => {
    if (!depth || random() < .35) return [null, true, false, "é😀\\\"", Math.floor(random() * 10000) / 10][Math.floor(random() * 5)]!;
    if (random() < .5) return Array.from({ length: Math.floor(random() * 5) }, () => make(depth - 1));
    return Object.fromEntries(Array.from({ length: Math.floor(random() * 5) }, (_, i) => [`key.${i}`, make(depth - 1)]));
  };
  const reorder = (value: CodecJson): CodecJson => value && typeof value === "object"
    ? Array.isArray(value) ? value.map(reorder) : Object.fromEntries(Object.entries(value).reverse().map(([k, v]) => [k, reorder(v)])) : value;
  for (let i = 0; i < 500; i++) {
    const left = make(5), right = reorder(parseCodecJson(JSON.stringify(left)));
    expect(equalParsedJson(left, right)).toBe(true);
    const changed = make(5);
    expect(equalParsedJson(left, changed)).toBe(logicalJsonText(left) === logicalJsonText(changed));
  }
  expect(equalParsedJson(JSON.parse('{"__proto__":1}'), {})).toBe(false);
  expect(equalParsedJson({ a: null }, { b: null })).toBe(false);
  expect(equalParsedJson([1, 2], { "0": 1, "1": 2 })).toBe(false);
});
