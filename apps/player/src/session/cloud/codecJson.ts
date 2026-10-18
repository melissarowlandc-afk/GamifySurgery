/** JSON/UTF-8 boundary shared by the offline Beta 2 codec and its SQL vectors. */
export type CodecJson = null | boolean | number | string | CodecJson[] | { [key: string]: CodecJson };
export type CodecObject = { [key: string]: CodecJson };

export class CloudCodecError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "CloudCodecError";
  }
}

export const CLOUD_JSON_LIMITS = Object.freeze({
  maxTextBytes: 6_000_000,
  maxDepth: 64,
  maxNodes: 300_000,
  maxCollectionEntries: 50_000,
  maxStringBytes: 262_144,
});

export function utf8Bytes(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}

function validText(text: string): void {
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code === 0) throw new CloudCodecError("invalid_unicode", "PostgreSQL JSONB cannot store a NUL character.");
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new CloudCodecError("invalid_unicode", "JSON text contains an unpaired surrogate.");
      }
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      throw new CloudCodecError("invalid_unicode", "JSON text contains an unpaired surrogate.");
    }
  }
}

/** Reject duplicate keys and unsafe numbers BEFORE JSON.parse can discard/round them. */
export function parseCodecJson(text: string): CodecJson {
  if (typeof text !== "string" || text.length > CLOUD_JSON_LIMITS.maxTextBytes ||
    utf8Bytes(text) > CLOUD_JSON_LIMITS.maxTextBytes) {
    throw new CloudCodecError("json_size", "JSON text exceeds the codec processing limit.");
  }
  validText(text);
  let offset = 0, nodes = 0;
  const whitespace = () => { while (/[\t\n\r ]/.test(text[offset] ?? "x")) offset += 1; };
  const fail = (): never => { throw new CloudCodecError("invalid_json", "Malformed JSON text."); };
  const string = (): string => {
    const start = offset++;
    while (offset < text.length) {
      const character = text[offset++];
      if (character === "\\") { offset += 1; continue; }
      if (character === '"') {
        let value: string;
        try { value = JSON.parse(text.slice(start, offset)) as string; } catch { return fail(); }
        validText(value);
        if (utf8Bytes(value) > CLOUD_JSON_LIMITS.maxStringBytes) {
          throw new CloudCodecError("json_structure", "JSON string exceeds the codec limit.");
        }
        return value;
      }
    }
    return fail();
  };
  const value = (depth: number): void => {
    whitespace();
    nodes += 1;
    if (depth > CLOUD_JSON_LIMITS.maxDepth || nodes > CLOUD_JSON_LIMITS.maxNodes) {
      throw new CloudCodecError("json_structure", "JSON structure exceeds the codec limit.");
    }
    const token = text[offset];
    if (token === '"') { string(); return; }
    if (token === "{" || token === "[") {
      const object = token === "{", end = object ? "}" : "]", keys = new Set<string>();
      let entries = 0;
      offset += 1;
      whitespace();
      if (text[offset] === end) { offset += 1; return; }
      while (offset < text.length) {
        if (++entries > CLOUD_JSON_LIMITS.maxCollectionEntries) {
          throw new CloudCodecError("json_structure", "JSON collection exceeds the codec limit.");
        }
        if (object) {
          whitespace();
          if (text[offset] !== '"') return fail();
          const key = string();
          if (keys.has(key)) throw new CloudCodecError("duplicate_key", "Duplicate JSON object key.");
          keys.add(key);
          whitespace();
          if (text[offset++] !== ":") return fail();
        }
        value(depth + 1);
        whitespace();
        const separator = text[offset++];
        if (separator === end) return;
        if (separator !== ",") return fail();
      }
      return fail();
    }
    for (const literal of ["true", "false", "null"]) {
      if (text.startsWith(literal, offset)) { offset += literal.length; return; }
    }
    const number = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(offset))?.[0];
    if (!number) return fail();
    const parsed = Number(number);
    // Compare decimal values, not spelling: SQL may expand an exponent or keep
    // trailing zeroes, but it must not smuggle in a value JSON.parse would round.
    const decimal = (token: string): string => {
      const [mantissa = "", exponent = "0"] = token.toLowerCase().split("e");
      const fractionLength = mantissa.includes(".") ? mantissa.length - mantissa.indexOf(".") - 1 : 0;
      let digits = mantissa.replace(".", "").replace(/^(-?)0+/, "$1");
      const trimmed = digits.replace(/0+$/, "");
      const power = Number(exponent) - fractionLength + digits.length - trimmed.length;
      digits = trimmed;
      return digits === "" || digits === "-" ? "0" : `${digits}e${power}`;
    };
    if (!Number.isFinite(parsed) || Number.isInteger(parsed) && !Number.isSafeInteger(parsed) || Object.is(parsed, -0) ||
      decimal(number) !== decimal(JSON.stringify(parsed))) {
      throw new CloudCodecError("unsafe_number", "JSON number cannot round-trip safely through JavaScript and JSONB.");
    }
    offset += number.length;
  };
  value(0);
  whitespace();
  if (offset !== text.length) return fail();
  try { return JSON.parse(text) as CodecJson; } catch { return fail(); }
}

export function codecObject(value: CodecJson, label: string): CodecObject {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new CloudCodecError("invalid_shape", `${label} must be a JSON object.`);
  }
  return value;
}

/** Logical comparison only. Never use this instead of the exact-byte request/stored hash. */
export function logicalJsonText(value: CodecJson): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(logicalJsonText).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${logicalJsonText(value[key]!)}`).join(",")}}`;
}

export function sameLogicalJson(left: CodecJson, right: CodecJson): boolean {
  return logicalJsonText(left) === logicalJsonText(right);
}

/** No values in diagnostics: they can contain complete frozen clinical text. */
export function changedTopLevelFields(left: CodecObject, right: CodecObject): string[] {
  return [...new Set([...Object.keys(left), ...Object.keys(right)])].sort().filter(key =>
    !(key in left) || !(key in right) || !sameLogicalJson(left[key]!, right[key]!));
}

export async function sha256Utf8(text: string): Promise<string> {
  validText(text);
  if (!globalThis.crypto?.subtle) {
    throw new CloudCodecError("crypto_unavailable", "SHA-256 is unavailable; the save was not verified.");
  }
  const hash = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}
