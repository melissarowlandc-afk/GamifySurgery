import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { createWorkbenchViteConfig } from "../vite.config.js";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(appRoot, "../..");
const config = createWorkbenchViteConfig("test");

describe("local-only Vite boundary", () => {
  it("binds one strict loopback port with CORS disabled", () => {
    expect(config.server).toMatchObject({
      host: "127.0.0.1",
      port: 4174,
      strictPort: true,
      cors: false,
      fs: {
        strict: true,
      },
    });
  });

  it("allows only client assets and dependencies, not the repository or private roots", () => {
    const allowed = config.server?.fs?.allow ?? [];
    expect(allowed).toContain(resolve(appRoot, "client"));
    expect(allowed).toContain(resolve(repositoryRoot, "node_modules"));
    expect(allowed).not.toContain(repositoryRoot);
    expect(
      config.server?.fs?.deny,
    ).toEqual(
      expect.arrayContaining([
        "**/.clinical-workbench/**",
        "**/.private-clinical-data/**",
        "**/clinical-data/private/**",
      ]),
    );
  });

  it("has no build, preview, or deployment script", async () => {
    const manifest = JSON.parse(
      await readFile(resolve(appRoot, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    expect(manifest.scripts).not.toHaveProperty("build");
    expect(manifest.scripts).not.toHaveProperty("preview");
    expect(manifest.scripts).not.toHaveProperty("deploy");
  });
});
