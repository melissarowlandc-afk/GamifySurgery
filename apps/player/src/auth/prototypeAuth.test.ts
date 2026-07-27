import { describe, expect, it } from "vitest";
import {
  createLocalPrototypeSession,
  parsePrototypeAccessSession,
} from "./prototypeAuth";

describe("prototype access sessions", () => {
  it("accepts an unexpired remembered local session", () => {
    const session = createLocalPrototypeSession(1_000);
    expect(
      parsePrototypeAccessSession(JSON.stringify(session), 2_000),
    ).toEqual(session);
  });

  it("rejects expired, invalid, and absent sessions", () => {
    const session = createLocalPrototypeSession(1_000);
    expect(
      parsePrototypeAccessSession(
        JSON.stringify(session),
        session.expiresAtRealMs,
      ),
    ).toBeNull();
    expect(parsePrototypeAccessSession("{broken", 2_000)).toBeNull();
    expect(parsePrototypeAccessSession(null, 2_000)).toBeNull();
  });
});
