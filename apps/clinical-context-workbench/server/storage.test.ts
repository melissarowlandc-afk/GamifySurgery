import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";
import { ResearchWorkspaceTransitionError } from "@gamify-surgery/clinical-research";

import { applyWorkbenchCommand } from "./commands.js";
import {
  WorkspaceConflictError,
  WorkspaceCorruptionError,
  WorkspaceStore,
  WorkspaceValidationError,
} from "./storage.js";

const temporaryRoots: string[] = [];

async function createStore(): Promise<WorkspaceStore> {
  const root = await mkdtemp(join(tmpdir(), "clinical-context-store-"));
  temporaryRoots.push(root);
  return new WorkspaceStore(root);
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) =>
      rm(root, { recursive: true, force: true }),
    ),
  );
});

describe("WorkspaceStore", () => {
  it("initializes one validated content-addressed revision under its root", async () => {
    const store = await createStore();
    const stored = await store.read();

    expect(stored.workspace.id).toBe(
      "research.workspace.local.clinical-context",
    );
    expect(stored.etag).toMatch(/^"[a-f0-9]{64}"$/);
    expect(stored.revision).toMatch(/^[a-f0-9]{64}$/);
    expect((await readFile(store.currentPointer, "utf8")).trim()).toBe(
      stored.revision,
    );
    expect(await readdir(store.root)).toEqual(
      expect.arrayContaining(["CURRENT", "revisions"]),
    );
    expect(await readdir(store.revisionsRoot)).toEqual([
      `${stored.revision}.json`,
    ]);
  });

  it("keeps prior revisions immutable and rejects stale writers", async () => {
    const store = await createStore();
    const initial = await store.read();
    const initialContent = await readFile(
      join(store.revisionsRoot, `${initial.revision}.json`),
      "utf8",
    );
    const next = applyWorkbenchCommand(initial.workspace, {
      type: "create_gap",
      title: "Second append-only gap",
      clinicalQuestion: "What evidence should be collected?",
      whyNeeded: "The example needs an independently tracked question.",
      acceptanceCriteria: ["One human-screened candidate is recorded."],
      targetKind: "other",
      targetId: "target.local.second",
      scoutMode: "manual_only",
      preferredSourceTypes: ["journal_article"],
      provider: "manual_other",
      query: "",
      refreshIntervalDays: null,
    });

    const saved = await store.save(next, initial.etag);

    expect(saved.etag).not.toBe(initial.etag);
    expect(saved.workspace.evidenceGaps).toHaveLength(
      initial.workspace.evidenceGaps.length + 1,
    );
    expect(
      await readFile(
        join(store.revisionsRoot, `${initial.revision}.json`),
        "utf8",
      ),
    ).toBe(initialContent);
    const secondNext = applyWorkbenchCommand(saved.workspace, {
      type: "create_gap",
      title: "Third append-only gap",
      clinicalQuestion: "Does a second pointer replacement remain safe?",
      whyNeeded: "Windows replacement behavior needs an exercised path.",
      acceptanceCriteria: ["The second save becomes CURRENT."],
      targetKind: "other",
      targetId: "target.local.third",
      scoutMode: "manual_only",
      preferredSourceTypes: ["journal_article"],
      provider: "manual_other",
      query: "",
      refreshIntervalDays: null,
    });
    const secondSaved = await store.save(secondNext, saved.etag);
    expect((await store.read()).etag).toBe(secondSaved.etag);
    expect((await readFile(store.currentPointer, "utf8")).trim()).toBe(
      secondSaved.revision,
    );
    expect(await readdir(store.root)).not.toContain("CURRENT.backup");
    await expect(store.save(next, initial.etag)).rejects.toBeInstanceOf(
      WorkspaceConflictError,
    );
  });

  it("rejects mutation or removal of an existing canonical record", async () => {
    const store = await createStore();
    const initial = await store.read();
    const tampered = structuredClone(initial.workspace);
    tampered.evidenceGapRevisions[0]!.title = "Rewritten in place";
    tampered.updatedAt = new Date(
      Date.parse(initial.workspace.updatedAt) + 1,
    ).toISOString();

    await expect(store.save(tampered, initial.etag)).rejects.toBeInstanceOf(
      ResearchWorkspaceTransitionError,
    );
  });

  it("validates canonical workspaces before creating a revision", async () => {
    const store = await createStore();
    const initial = await store.read();

    await expect(
      Promise.resolve().then(() =>
        store.save(
          { schemaVersion: 1, path: "../../private" },
          initial.etag,
        ),
      ),
    ).rejects.toBeInstanceOf(WorkspaceValidationError);
    expect((await store.read()).etag).toBe(initial.etag);
  });

  it("rejects a storage root redirected through a directory link", async () => {
    const boundary = await mkdtemp(
      join(tmpdir(), "clinical-context-linked-store-"),
    );
    temporaryRoots.push(boundary);
    const actual = join(boundary, "actual");
    const linked = join(boundary, "linked");
    await mkdir(actual);
    try {
      await symlink(actual, linked, "junction");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EPERM") return;
      throw error;
    }

    await expect(new WorkspaceStore(linked).read()).rejects.toBeInstanceOf(
      WorkspaceCorruptionError,
    );
  });
});
