export default {
  test: {
    // Full-release fixtures and minute-by-minute simulations compete for CPU.
    // CPU-count parallelism can time out correct synchronous tests; keep file
    // isolation and existing deadlines while bounding the concurrent workload.
    maxWorkers: 4,
    // Hosted CI runners are much slower than local machines; local default stays 5 s.
    testTimeout: process.env.CI ? 60_000 : 5_000,
  },
};
