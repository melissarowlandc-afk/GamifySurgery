import { defineConfig, devices } from "@playwright/test";

const usesExternallyManagedServer =
  process.env.GAMIFY_E2E_EXTERNAL_SERVER === "1";
const baseURL = process.env.GAMIFY_E2E_BASE_URL ?? "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  ...(usesExternallyManagedServer
    ? {}
    : {
        webServer: {
          command:
            "node ../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173",
          cwd: "apps/player",
          url: "http://127.0.0.1:4173",
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
  projects: [
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "compact-desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: "laptop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "phone-chrome",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
});
