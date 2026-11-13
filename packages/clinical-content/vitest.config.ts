export default {
  test: {
    // Protected-source pin tests hash many files and slow down under full-suite
    // CPU contention. Hosted CI runners are much slower than local machines;
    // keep the local 5 s default, and allow more time in CI without changing assertions.
    testTimeout: process.env.CI ? 60_000 : 5_000,
  },
};
