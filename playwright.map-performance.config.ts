import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Run only the perf proof, one browser at a time, without trace DOM snapshots
// competing with rendering. Functional proofs retain their ordinary config.
process.env.GAMIFY_MAP_PERFORMANCE_BUILD = "production";
const url = "http://127.0.0.1:5186";
export default defineConfig({ ...base, workers: 1, fullyParallel: false,
  testMatch: "**/map-pan-zoom-performance.spec.ts",
  use: { ...base.use, baseURL: url, trace: "off" },
  projects: base.projects?.filter(project => ["desktop-chrome", "phone-chrome"].includes(project.name!)),
  webServer: process.env.GAMIFY_MAP_PREVIEW_EXTERNAL === "1" ? undefined : {
    command: "node scripts/qa/map-performance-preview.mjs", url, reuseExistingServer: false, timeout: 120_000,
  },
});
