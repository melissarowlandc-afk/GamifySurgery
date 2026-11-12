import { defineConfig } from "@playwright/test";
import production from "./playwright.map-performance.config";

export default defineConfig({ ...production, testMatch: "**/map-pan-zoom-phone-memory.spec.ts",
  projects: production.projects?.filter(project => project.name === "phone-chrome") });
