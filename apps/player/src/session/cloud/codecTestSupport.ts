import { createHash } from "node:crypto";
import { deserializeGameState } from "@gamify-surgery/game-domain";
import type { CloudCampaignMetadata, CloudTextReceipt } from "./codec";

export function codecTestCampaign(serializedState: string): CloudCampaignMetadata {
  const state = deserializeGameState(serializedState);
  return {
    campaignId: state.campaignId, name: "Café 🩺 synthetic clinic", status: "resumable",
    createdAtRealMs: state.createdAtRealMs, updatedAtRealMs: state.createdAtRealMs + 123,
    tutorial: { guidance: { version: 2, mode: "guided", exposedTopicIds: ["management", "water"] },
      introDismissed: true, dailyRoutineTipAcknowledgments: ["synthetic.tip"], dailyRoutinePause: false },
  };
}

export function testTextReceipt(text: string): CloudTextReceipt {
  return { text, sha256: createHash("sha256").update(text, "utf8").digest("hex"), utf8Bytes: Buffer.byteLength(text, "utf8") };
}

/** Transport perturbation, NOT a PostgreSQL oracle. SQL vectors require a real DB rerun. */
export function reorderedStoredText(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(reorderedStoredText).join(", ")}]`;
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;
    const keys = Object.keys(object).sort((left, right) =>
      Buffer.byteLength(left) - Buffer.byteLength(right) || Buffer.compare(Buffer.from(left), Buffer.from(right)));
    return `{${keys.map(key => `${JSON.stringify(key)}: ${reorderedStoredText(object[key])}`).join(", ")}}`;
  }
  if (typeof value === "number") {
    const text = JSON.stringify(value);
    if (!/[eE]/.test(text)) return text;
    const [mantissa = "", exponent = "0"] = text.split("e");
    const negative = mantissa.startsWith("-"), unsigned = negative ? mantissa.slice(1) : mantissa;
    const digits = unsigned.replace(".", ""), decimal = (unsigned.indexOf(".") < 0 ? unsigned.length : unsigned.indexOf(".")) + Number(exponent);
    const expanded = decimal <= 0 ? `0.${"0".repeat(-decimal)}${digits}` : decimal >= digits.length
      ? digits + "0".repeat(decimal - digits.length) : `${digits.slice(0, decimal)}.${digits.slice(decimal)}`;
    return (negative ? "-" : "") + expanded;
  }
  return JSON.stringify(value);
}
