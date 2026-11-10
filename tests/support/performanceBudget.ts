/** Test-only timing policy. No production imports or Vitest assertion retries. */
type RunnerEnvironment = { CI?: string; GITHUB_ACTIONS?: string };
export type PerformanceBudget = { label: string; actualMs: number; limitMs: number };

const hostedRunner = (env: RunnerEnvironment) => Boolean(env.CI || env.GITHUB_ACTIONS);

/** Preserve each test's existing allowance; recognize GitHub Actions as well. */
export const ciTime = (ms: number, multiplier = 10, env: RunnerEnvironment = process.env) =>
  hostedRunner(env) ? ms * multiplier : ms;

export class PerformanceBudgetError extends Error {
  readonly worstRatio: number;
  constructor(readonly budgets: readonly PerformanceBudget[]) {
    super(budgets.map(row => `${row.label}: ${row.actualMs.toFixed(3)} ms (must be < ${row.limitMs} ms)`).join("\n"));
    this.name = "PerformanceBudgetError";
    this.worstRatio = Math.max(...budgets.map(row => Number.isFinite(row.actualMs) && row.actualMs >= 0 ? row.actualMs / row.limitMs : Infinity));
  }
}

/** Call after correctness assertions. All budgets belong to the same attempt. */
export function assertPerformanceBudgets(budgets: readonly PerformanceBudget[]): void {
  if (!budgets.length || budgets.some(row => !Number.isFinite(row.limitMs) || row.limitMs <= 0))
    throw new TypeError("Performance measurements require finite positive budgets");
  if (budgets.some(row => !Number.isFinite(row.actualMs) || row.actualMs < 0 || row.actualMs >= row.limitMs))
    throw new PerformanceBudgetError(budgets);
}

/**
 * One local attempt; at most three on shared CI. Retry only timing failures,
 * with a fresh workload and cleanup inside work(). A whole attempt must pass:
 * never select individual fast frames/budgets from different runs. Persistent
 * regressions fail with the best attempt and every attempt's worst ratio.
 */
export async function runPerformanceTest(work: () => void | Promise<void>, env: RunnerEnvironment = process.env): Promise<void> {
  const attempts = hostedRunner(env) ? 3 : 1;
  const failures: PerformanceBudgetError[] = [];
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try { await work(); return; }
    catch (error) {
      if (!(error instanceof PerformanceBudgetError)) throw error;
      failures.push(error);
      if (attempt < attempts) console.warn(`CI timing attempt ${attempt}/${attempts} exceeded budget; retrying the complete workload.\n${error.message}`);
    }
  }
  const best = failures.reduce((a, b) => a.worstRatio <= b.worstRatio ? a : b);
  if (attempts > 1) best.message += `\nAll ${attempts} CI attempts exceeded budget (worst ratios: ${failures.map(row => row.worstRatio.toFixed(3)).join(", ")}); best complete attempt shown.`;
  throw best;
}
