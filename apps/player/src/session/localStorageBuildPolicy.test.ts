import { expect, it } from "vitest";
import { LOCAL_STORAGE_COMPRESSION_WRITES } from "./localStorageBuildPolicy";

it("enables compressed local writes after release 36+ established the reader rollback floor", () => {
  // Manager-approved release 38: every supported rollback reads this dialect.
  expect(LOCAL_STORAGE_COMPRESSION_WRITES).toBe(true);
});
