import { expect, it } from "vitest";
import { LOCAL_STORAGE_COMPRESSION_WRITES } from "./localStorageBuildPolicy";

it("ships the dialect-aware reader before enabling compressed local writes", () => {
  expect(LOCAL_STORAGE_COMPRESSION_WRITES).toBe(false);
});
