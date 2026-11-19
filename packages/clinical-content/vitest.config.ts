export default {
  test: {
    // Protected-source pin tests hash many files and slow down under full-suite
    // CPU contention. Hosted CI runners are much slower than local machines;
    // keep the local 5 s default, and allow more time in CI without changing assertions.
    // Raised 60 s -> 180 s (M-2026-11-19-06): stats1-acceptance took 48 s / 68 s on CI as pin fixtures grew.
    testTimeout: process.env.CI ? 180_000 : 5_000,
  },
};
