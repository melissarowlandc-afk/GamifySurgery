import { expect, it, vi } from "vitest";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { parseCodecJson, sha256Utf8, utf8Bytes } from "./codecJson";

it("counts UTF-8 exactly, including every UTF-16 code unit and malformed surrogate boundaries, without allocating encoded buffers", () => {
  const encoder = new TextEncoder();
  for (let base = 0; base < 65_536; base += 256) {
    const units = Array.from({ length: 256 }, (_, i) => String.fromCharCode(base + i));
    for (const text of [units.join(""), units.map(unit => `a${unit}\ud800${unit}\udfff`).join("")])
      expect(utf8Bytes(text)).toBe(encoder.encode(text).byteLength);
  }
  for (const text of ["", "\ud800\udfff", "\udfff\ud800", "\ud800\ud800\udfff", "\ud800a\udfff", "Cafe\u0301 🩺"])
    expect(utf8Bytes(text)).toBe(encoder.encode(text).byteLength);
  const encode = vi.spyOn(TextEncoder.prototype, "encode");
  try {
    expect(utf8Bytes("snapshot".repeat(100_000))).toBe(800_000); expect(encode).not.toHaveBeenCalled();
  } finally { encode.mockRestore(); }
});

it("hashes and compresses one owned encoding and verifies the emitted bytes as before", async () => {
  const text = JSON.stringify({ clinic: "Public synthetic clinic 🩺", values: Array.from({ length: 1000 }, (_, i) => i) });
  const digest = await sha256Utf8(text), encode = vi.spyOn(TextEncoder.prototype, "encode");
  try {
    const packed = await compressCloudText(text);
    expect(encode).toHaveBeenCalledTimes(1);
    expect(packed.uncompressedSha256).toBe(digest); expect(packed.uncompressedBytes).toBe(utf8Bytes(text));
    expect(await decompressCloudText(packed)).toBe(text);
  } finally { encode.mockRestore(); }
});

it("keeps the prior exact-decimal acceptance rule for canonical and alternate numeric spellings", () => {
  // Independent retained rule, including spellings JSON.parse rounds away.
  const decimal = (token: string): string => {
    const [mantissa = "", exponent = "0"] = token.toLowerCase().split("e");
    const fraction = mantissa.includes(".") ? mantissa.length - mantissa.indexOf(".") - 1 : 0;
    const digits = mantissa.replace(".", "").replace(/^(-?)0+/, "$1"), trimmed = digits.replace(/0+$/, "");
    return trimmed === "" || trimmed === "-" ? "0" : `${trimmed}e${Number(exponent) - fraction + digits.length - trimmed.length}`;
  };
  const tokens = ["-0", "-0.00", "0.10000000000000001", "9007199254740993", "1e400", "1e-400", "1.00000000000000001"];
  for (const sign of ["", "-"]) for (const integer of ["0", "1", "10", "9007199254740991"]) for (const fraction of ["", ".0", ".125", ".00000000000000001"])
    for (const exponent of ["", "e0", "e+2", "E-2", "e-300"]) tokens.push(sign + integer + fraction + exponent);
  for (const token of tokens) {
    const parsed = Number(token), valid = Number.isFinite(parsed) && (!Number.isInteger(parsed) || Number.isSafeInteger(parsed)) &&
      !Object.is(parsed, -0) && decimal(token) === decimal(JSON.stringify(parsed));
    if (valid) expect(parseCodecJson(`{"n":${token}}`)).toEqual({ n: parsed });
    else expect(() => parseCodecJson(`{"n":${token}}`)).toThrowError(expect.objectContaining({ code: "unsafe_number" }));
  }
  const encode = vi.spyOn(TextEncoder.prototype, "encode");
  try {
    const text = JSON.stringify({ history: Array.from({ length: 9000 }, (_, i) => ({ id: `public.${i}`, count: i, done: i % 2 === 0 })) });
    expect(parseCodecJson(text)).toEqual(JSON.parse(text)); expect(encode).not.toHaveBeenCalled();
  } finally { encode.mockRestore(); }
});
