import { expect, it, vi } from "vitest";
import { readonlyProjectionMemo, withReadonlyProjectionMemo } from "../src/readonlyProjectionMemo";

it("reuses only complete identity-matched arguments within one read-only projection", () => {
  const namespace = Symbol(), read = vi.fn(() => false), state = {}, context = {};
  withReadonlyProjectionMemo(() => {
    expect(readonlyProjectionMemo(namespace, [state, context, "employee.one"], read)).toBe(false);
    expect(readonlyProjectionMemo(namespace, [state, context, "employee.one"], read)).toBe(false);
    readonlyProjectionMemo(namespace, [state, {}, "employee.one"], read);
    readonlyProjectionMemo(namespace, [state, context, "employee.two"], read);
  });
  expect(read).toHaveBeenCalledTimes(3);
  readonlyProjectionMemo(namespace, [state, context, "employee.one"], read);
  withReadonlyProjectionMemo(() => readonlyProjectionMemo(namespace, [state, context, "employee.one"], read));
  expect(read).toHaveBeenCalledTimes(5);
});

it("restores outer scopes after nested projections and exceptions without caching failed reads", () => {
  const namespace = Symbol(), read = vi.fn(() => 1);
  withReadonlyProjectionMemo(() => {
    readonlyProjectionMemo(namespace, [], read);
    expect(() => withReadonlyProjectionMemo(() => { readonlyProjectionMemo(namespace, [], read); throw Error("nested"); })).toThrow("nested");
    expect(readonlyProjectionMemo(namespace, [], read)).toBe(1);
    const fails = vi.fn(() => { throw Error("failed"); });
    expect(() => readonlyProjectionMemo(namespace, ["failed"], fails)).toThrow();
    expect(() => readonlyProjectionMemo(namespace, ["failed"], fails)).toThrow();
    expect(fails).toHaveBeenCalledTimes(2);
  });
  expect(read).toHaveBeenCalledTimes(2);
});
