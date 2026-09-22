import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["dist/**"],
    // Parser-isolation tests create their own deliberately constrained worker.
    // Running test files serially avoids nesting that worker under a saturated
    // Vitest process pool, which can otherwise exit nondeterministically on
    // resource-constrained Windows hosts.
    fileParallelism: false,
    // Threads remain stable when those tests start a nested Node Worker; the
    // default forks pool can unexpectedly exit on Windows.
    pool: "threads",
  },
});
