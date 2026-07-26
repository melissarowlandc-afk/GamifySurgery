import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { makeResearchWorkspace } from "../../tests/fixture.js";
import {
  appendSanitizedAuthoringReferences,
  AuthoringContextBridgeError,
  designateServerOwnedAuthoringWorkspacePath,
  loadSanitizedAuthoringContext,
} from "./authoring-context.js";

const canonicalExamplePath = fileURLToPath(
  new URL(
    "../../../clinical-authoring/examples/synthetic-workspace.json",
    import.meta.url,
  ),
);

const temporaryDirectories: string[] = [];

const temporaryWorkspacePath = async (candidate: unknown) => {
  const directory = await mkdtemp(join(tmpdir(), "clinical-context-test-"));
  temporaryDirectories.push(directory);
  const path = join(directory, "canonical-authoring-workspace.json");
  await writeFile(path, JSON.stringify(candidate), "utf8");
  return path;
};

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("sanitized authoring context bridge", () => {
  it("loads a validated canonical workspace into labels and IDs only", async () => {
    const raw = JSON.parse(await readFile(canonicalExamplePath, "utf8")) as {
      sources: Array<{ scopeNote: string }>;
      citations: Array<{ supportedClaim: string }>;
      topicRevisions: Array<{
        sections: Array<{ narrative: string }>;
      }>;
      structuredFacts: Array<{
        value: { value?: string | number };
        population: string;
      }>;
      concepts: Array<{ learningObjective: string }>;
    };
    const context = await loadSanitizedAuthoringContext(
      designateServerOwnedAuthoringWorkspacePath(canonicalExamplePath),
    );

    expect(context.sources.length).toBeGreaterThan(0);
    expect(context.citations.length).toBeGreaterThan(0);
    expect(context.topicRevisions.length).toBeGreaterThan(0);
    expect(context.structuredFacts.length).toBeGreaterThan(0);
    expect(context.testedConcepts.length).toBeGreaterThan(0);
    expect(Object.keys(context.sources[0]!).sort()).toEqual(["id", "label"]);
    expect(Object.keys(context.citations[0]!).sort()).toEqual([
      "id",
      "label",
      "sourceId",
      "sourceSnapshotId",
      "verificationState",
      "verifiedAt",
      "verifiedBy",
    ]);
    expect(Object.keys(context.structuredFacts[0]!).sort()).toEqual([
      "entityId",
      "id",
      "kind",
      "label",
    ]);
    expect(
      context.citations.every(
        (citation) => citation.verificationState === "human_verified",
      ),
    ).toBe(true);

    const serialized = JSON.stringify(context);
    expect(serialized).not.toContain(raw.sources[0]!.scopeNote);
    expect(serialized).not.toContain(raw.citations[0]!.supportedClaim);
    expect(serialized).not.toContain(
      raw.topicRevisions[0]!.sections[0]!.narrative,
    );
    expect(serialized).not.toContain(raw.structuredFacts[0]!.population);
    expect(serialized).not.toContain(raw.concepts[0]!.learningObjective);
  });

  it("omits unverified Citations and exposes conflict signals", async () => {
    const candidate = JSON.parse(
      await readFile(canonicalExamplePath, "utf8"),
    ) as {
      citations: Array<{
        id: string;
        verificationState: string;
        verificationReviewerId: string | null;
        verificationRecordedAt: string | null;
      }>;
    };
    const hiddenId = candidate.citations[0]!.id;
    const conflictId = candidate.citations[1]!.id;
    candidate.citations[0]!.verificationState = "unverified";
    candidate.citations[0]!.verificationReviewerId = null;
    candidate.citations[0]!.verificationRecordedAt = null;
    candidate.citations[1]!.verificationState = "conflict_identified";
    const path = await temporaryWorkspacePath(candidate);

    const context = await loadSanitizedAuthoringContext(
      designateServerOwnedAuthoringWorkspacePath(path),
    );
    expect(context.citations.some((citation) => citation.id === hiddenId)).toBe(
      false,
    );
    expect(
      context.citations.find((citation) => citation.id === conflictId),
    ).toMatchObject({
      verificationState: "conflict_identified",
      verifiedBy: candidate.citations[1]!.verificationReviewerId,
      verifiedAt: candidate.citations[1]!.verificationRecordedAt,
    });
  });

  it("requires an absolute, explicitly designated server-owned path", async () => {
    expect(() =>
      designateServerOwnedAuthoringWorkspacePath("../workspace.json"),
    ).toThrow(AuthoringContextBridgeError);

    await expect(
      loadSanitizedAuthoringContext({
        absolutePath: canonicalExamplePath,
      } as never),
    ).rejects.toMatchObject({ code: "PATH_NOT_SERVER_OWNED" });
  });

  it("reports invalid files without disclosing the configured path", async () => {
    const path = await temporaryWorkspacePath({ not: "a workspace" });

    let caught: unknown;
    try {
      await loadSanitizedAuthoringContext(
        designateServerOwnedAuthoringWorkspacePath(path),
      );
    } catch (error) {
      caught = error;
    }
    expect(caught).toMatchObject({ code: "INVALID_AUTHORING_WORKSPACE" });
    expect((caught as Error).message).not.toContain(path);
  });
});

describe("append-only authoring reference sync", () => {
  it("appends only Sources, verified Citations, and current revision targets", async () => {
    const context = await loadSanitizedAuthoringContext(
      designateServerOwnedAuthoringWorkspacePath(canonicalExamplePath),
    );
    const previous = makeResearchWorkspace();
    const original = structuredClone(previous);

    const next = appendSanitizedAuthoringReferences(
      previous,
      context,
      "2026-07-26T12:00:00.000Z",
    );

    expect(previous).toEqual(original);
    expect(next.updatedAt).toBe("2026-07-26T12:00:00.000Z");
    expect(next.externalReferences.clinicalApprovals).toEqual(
      previous.externalReferences.clinicalApprovals,
    );
    for (const source of context.sources) {
      expect(next.externalReferences.sources).toContainEqual({ id: source.id });
    }
    for (const citation of context.citations) {
      expect(next.externalReferences.citations).toContainEqual({
        id: citation.id,
        sourceId: citation.sourceId,
        sourceSnapshotId: citation.sourceSnapshotId,
        verificationState: "human_verified",
        verifiedBy: citation.verifiedBy,
        verifiedAt: citation.verifiedAt,
      });
      expect(next.citationVerificationSignals).toContainEqual(
        expect.objectContaining({
          citationId: citation.id,
          supersedesSignalId: null,
          verificationState: citation.verificationState,
          verifiedBy: citation.verifiedBy,
          verifiedAt: citation.verifiedAt,
          recordedAt: "2026-07-26T12:00:00.000Z",
        }),
      );
    }
    for (const target of [
      ...context.topicRevisions,
      ...context.structuredFacts,
      ...context.testedConcepts,
    ]) {
      expect(next.externalReferences.clinicalTargets).toContainEqual({
        kind: target.kind,
        id: target.id,
      });
    }
  });

  it("refuses unverified Citation input at the sync boundary", async () => {
    const context = structuredClone(
      await loadSanitizedAuthoringContext(
        designateServerOwnedAuthoringWorkspacePath(canonicalExamplePath),
      ),
    ) as unknown as {
      citations: Array<{
        verificationState: string;
        verifiedBy: string | null;
        verifiedAt: string | null;
      }>;
    };
    context.citations[0]!.verificationState = "unverified";
    context.citations[0]!.verifiedBy = null;
    context.citations[0]!.verifiedAt = null;

    expect(() =>
      appendSanitizedAuthoringReferences(
        makeResearchWorkspace(),
        context,
        "2026-07-26T12:00:00.000Z",
      ),
    ).toThrow();
  });

  it("never overwrites an existing Citation reference with changed provenance", async () => {
    const context = await loadSanitizedAuthoringContext(
      designateServerOwnedAuthoringWorkspacePath(canonicalExamplePath),
    );
    const previous = makeResearchWorkspace();
    previous.externalReferences.citations.push({
      id: context.citations[0]!.id,
      sourceId: "source.one",
      sourceSnapshotId: "snapshot.conflicting",
      verificationState: "human_verified",
      verifiedBy: "reviewer.clinical.one",
      verifiedAt: "2026-01-02T10:00:00.000Z",
    });

    expect(() =>
      appendSanitizedAuthoringReferences(
        previous,
        context,
        "2026-07-26T12:00:00.000Z",
      ),
    ).toThrow(
      expect.objectContaining({
        code: "CITATION_REFERENCE_CONFLICT",
      }),
    );
  });

  it("is idempotent when a sync contains no new references or signals", async () => {
    const context = await loadSanitizedAuthoringContext(
      designateServerOwnedAuthoringWorkspacePath(canonicalExamplePath),
    );
    const first = appendSanitizedAuthoringReferences(
      makeResearchWorkspace(),
      context,
      "2026-07-26T12:00:00.000Z",
    );

    expect(
      appendSanitizedAuthoringReferences(
        first,
        context,
        "2026-07-27T12:00:00.000Z",
      ),
    ).toEqual(first);
  });

  it("appends a conflict signal without rewriting the original Citation", async () => {
    const humanContext = await loadSanitizedAuthoringContext(
      designateServerOwnedAuthoringWorkspacePath(canonicalExamplePath),
    );
    const first = appendSanitizedAuthoringReferences(
      makeResearchWorkspace(),
      humanContext,
      "2026-07-26T12:00:00.000Z",
    );
    const citationId = humanContext.citations[0]!.id;
    const immutableCitation = structuredClone(
      first.externalReferences.citations.find(
        (citation) => citation.id === citationId,
      ),
    );

    const candidate = JSON.parse(
      await readFile(canonicalExamplePath, "utf8"),
    ) as {
      updatedAt: string;
      citations: Array<{
        id: string;
        verificationState: string;
        verificationReviewerId: string | null;
        verificationRecordedAt: string | null;
      }>;
    };
    candidate.updatedAt = "2026-07-27T10:00:00.000Z";
    const changedCitation = candidate.citations.find(
      (citation) => citation.id === citationId,
    )!;
    changedCitation.verificationState = "conflict_identified";
    changedCitation.verificationReviewerId = "reviewer.conflict.one";
    changedCitation.verificationRecordedAt =
      "2026-07-27T09:00:00.000Z";
    const conflictPath = await temporaryWorkspacePath(candidate);
    const conflictContext = await loadSanitizedAuthoringContext(
      designateServerOwnedAuthoringWorkspacePath(conflictPath),
    );

    const second = appendSanitizedAuthoringReferences(
      first,
      conflictContext,
      "2026-07-27T12:00:00.000Z",
    );
    expect(
      second.externalReferences.citations.find(
        (citation) => citation.id === citationId,
      ),
    ).toEqual(immutableCitation);
    const chain = second.citationVerificationSignals.filter(
      (signal) => signal.citationId === citationId,
    );
    expect(chain).toHaveLength(2);
    const humanSignal = chain.find(
      (signal) => signal.verificationState === "human_verified",
    )!;
    expect(
      chain.find(
        (signal) => signal.verificationState === "conflict_identified",
      ),
    ).toMatchObject({
      supersedesSignalId: humanSignal.id,
      verifiedBy: "reviewer.conflict.one",
      verifiedAt: "2026-07-27T09:00:00.000Z",
      recordedAt: "2026-07-27T12:00:00.000Z",
    });

    expect(
      appendSanitizedAuthoringReferences(
        second,
        conflictContext,
        "2026-07-28T12:00:00.000Z",
      ),
    ).toEqual(second);
  });
});
