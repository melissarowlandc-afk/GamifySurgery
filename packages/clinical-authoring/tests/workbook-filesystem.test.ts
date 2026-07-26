import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  initializeWorkbookDirectory,
  WorkbookFileError,
  writeNewWorkbookOutput,
} from "../src/workbook/filesystem.js";

const temporaryRoots: string[] = [];

async function temporaryRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "clinical-workbook-test-"));
  temporaryRoots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) =>
      rm(root, { force: true, recursive: true }),
    ),
  );
});

describe("non-destructive workbook file operations", () => {
  it("initializes the complete directory through a sibling staging directory", async () => {
    const root = await temporaryRoot();
    const target = join(root, "pilot");

    await initializeWorkbookDirectory(target, [
      { relativePath: "workspace.csv", contents: "id\nworkspace.pilot\n" },
      { relativePath: "tables/topics.csv", contents: "id\n" },
    ]);

    await expect(readFile(join(target, "workspace.csv"), "utf8")).resolves.toBe(
      "id\nworkspace.pilot\n",
    );
    await expect(
      readFile(join(target, "tables", "topics.csv"), "utf8"),
    ).resolves.toBe("id\n");
  });

  it("refuses to modify an existing initialization target", async () => {
    const root = await temporaryRoot();
    const target = join(root, "pilot");

    await initializeWorkbookDirectory(target, [
      { relativePath: "workspace.csv", contents: "original" },
    ]);

    await expect(
      initializeWorkbookDirectory(target, [
        { relativePath: "workspace.csv", contents: "replacement" },
      ]),
    ).rejects.toThrow(WorkbookFileError);
    await expect(readFile(join(target, "workspace.csv"), "utf8")).resolves.toBe(
      "original",
    );
  });

  it("rejects template paths that escape the workbook directory", async () => {
    const root = await temporaryRoot();

    await expect(
      initializeWorkbookDirectory(join(root, "pilot"), [
        { relativePath: "../outside.csv", contents: "unsafe" },
      ]),
    ).rejects.toThrow(/must remain inside/);
  });

  it("writes output once and never overwrites it", async () => {
    const root = await temporaryRoot();
    const output = join(root, "generated", "workspace.json");

    await writeNewWorkbookOutput(output, "first\n");
    await expect(writeNewWorkbookOutput(output, "second\n")).rejects.toThrow(
      /Refusing to overwrite/,
    );
    await expect(readFile(output, "utf8")).resolves.toBe("first\n");
  });

  it("does not overwrite a file created outside the helper", async () => {
    const root = await temporaryRoot();
    const output = join(root, "workspace.json");
    await writeFile(output, "owner data", "utf8");

    await expect(writeNewWorkbookOutput(output, "generated")).rejects.toThrow(
      /Refusing to overwrite/,
    );
    await expect(readFile(output, "utf8")).resolves.toBe("owner data");
  });
});
