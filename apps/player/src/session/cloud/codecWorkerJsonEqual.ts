import type { CodecJson } from "./codecJson";

const plain = (value: object) => { const prototype = Object.getPrototypeOf(value); return prototype === null || prototype === Object.prototype; };

/** Compare already parsed JSON without allocating two canonical text trees.
 * Parsing/Unicode/number/duplicate-key checks remain at the codec boundary. */
export function equalParsedJson(left: CodecJson, right: CodecJson): boolean {
  if (left === right) return true;
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object") return false;
  if (Array.isArray(left)) return Array.isArray(right) && left.length === right.length &&
    left.every((value, index) => equalParsedJson(value, right[index]!));
  if (Array.isArray(right)) return false;
  // The engine also accepts generic structured-clone seeds. A Date/Map with no
  // own keys must take its JSON-serialization fallback, not compare as `{}`.
  if (!plain(left) || !plain(right)) return false;
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length && keys.every(key =>
    Object.hasOwn(right, key) && equalParsedJson(left[key]!, right[key]!));
}
