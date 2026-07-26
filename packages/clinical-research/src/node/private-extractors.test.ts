import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createDefaultPrivateExtractor,
  type PrivateExtractedDocument,
} from "./private-extractors.js";
import type { PrivateIntakeManifestEntry } from "./private-intake.js";

const roots: string[] = [];
const sha = (character: string) => character.repeat(64);
const sourceIdentity = (content: string | Uint8Array) => {
  const bytes = Buffer.from(content);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  return {
    byteIdentityId: `source-bytes.sha256.${sha256}`,
    sha256,
    sizeBytes: bytes.byteLength,
  };
};

const entry = (
  mediaType: string,
  overrides: Partial<PrivateIntakeManifestEntry> = {},
): PrivateIntakeManifestEntry => ({
  schemaVersion: 1,
  id: "private-intake.test",
  byteIdentityId: `source-bytes.sha256.${sha("a")}`,
  originalFilename: "source.txt",
  sizeBytes: 10,
  sha256: sha("a"),
  detectedMediaType: mediaType,
  status: "extracting",
  duplicateOfId: null,
  sourceId: "source.test",
  sourceSnapshotId: null,
  rightsDecisionId: "rights.test",
  rightsDecisionSha256: sha("b"),
  rightsDecisionEffectiveAt: "2026-01-01T00:00:00.000Z",
  rightsDecisionExpiresAt: null,
  acknowledgementId: "ack.test",
  storageRelativePath: "staging/source.txt",
  discoveredAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  errorCode: null,
  errorMessage: null,
  extractionArtifactId: null,
  extractionArtifactSha256: null,
  parserId: null,
  parserVersion: null,
  chunkerVersion: null,
  ...overrides,
  extractionOutcome: overrides.extractionOutcome ?? null,
});

const makeFile = async (name: string, content: string | Uint8Array) => {
  const root = await mkdtemp(join(tmpdir(), "clinical-extractor-"));
  roots.push(root);
  const path = join(root, name);
  await writeFile(path, content);
  return path;
};

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { force: true, recursive: true })),
  );
  vi.restoreAllMocks();
});

describe("default rights-gated private extractors", () => {
  it("extracts bounded UTF-8 text chunks with line locators", async () => {
    const source = [
      "First paragraph.",
      "Still first paragraph.",
      "",
      `Long paragraph ${"word ".repeat(90)}`,
    ].join("\n");
    const path = await makeFile("source.txt", source);
    const extract = createDefaultPrivateExtractor({
      maximumChunkCharacters: 256,
    });

    const sourceEntry = entry("text/plain", sourceIdentity(source));
    const result = await extract(path, sourceEntry);
    const payload = result.payload as PrivateExtractedDocument;

    expect(result).toMatchObject({
      parserId: "node-text-decoder",
      chunkerVersion: "locator-aware-bounded-chunker.v1.max-256",
    });
    expect(payload.extractionStatus).toBe("complete");
    expect(payload.chunks.length).toBeGreaterThan(2);
    expect(
      payload.chunks.every((chunk) => chunk.text.length <= 256),
    ).toBe(true);
    expect(payload.chunks[0]?.locator).toMatchObject({
      kind: "text_lines",
      lineStart: 1,
      lineEnd: 2,
    });
    const repeated = await extract(path, sourceEntry);
    expect(
      (repeated.payload as PrivateExtractedDocument).chunks.map(
        (chunk) => chunk.id,
      ),
    ).toEqual(payload.chunks.map((chunk) => chunk.id));
  });

  it("retains Markdown heading paths without treating headings as provenance-free text", async () => {
    const source =
      "# Workup\n\nInitial evaluation.\n\n## Imaging\n\nObtain imaging selectively.";
    const path = await makeFile("source.md", source);
    const extract = createDefaultPrivateExtractor();

    const result = await extract(
      path,
      entry("text/markdown", sourceIdentity(source)),
    );
    const payload = result.payload as PrivateExtractedDocument;
    const imaging = payload.chunks.find((chunk) =>
      chunk.text.includes("Obtain imaging"),
    );

    expect(imaging?.locator).toMatchObject({
      kind: "text_lines",
      headingPath: ["Workup", "Imaging"],
    });
  });

  it("preserves PDF page locators and flags an image-only PDF for OCR without performing OCR", async () => {
    const source = "%PDF-synthetic";
    const path = await makeFile("source.pdf", source);
    const readPdf = vi
      .fn()
      .mockResolvedValueOnce({
        pageCount: 2,
        pages: [
          { pageNumber: 1, text: "Page one text." },
          { pageNumber: 2, text: "Page two text." },
        ],
      })
      .mockResolvedValueOnce({
        pageCount: 3,
        pages: [
          { pageNumber: 1, text: "" },
          { pageNumber: 2, text: " " },
          { pageNumber: 3, text: "" },
        ],
      });
    const extract = createDefaultPrivateExtractor({
      dependencies: { readPdf },
    });

    const sourceEntry = entry("application/pdf", sourceIdentity(source));
    const textResult = await extract(path, sourceEntry);
    const textPayload = textResult.payload as PrivateExtractedDocument;
    expect(textResult).toMatchObject({
      parserId: "pdfjs-dist",
      parserVersion: "6.1.200",
    });
    expect(textPayload.chunks.map((chunk) => chunk.locator)).toEqual([
      expect.objectContaining({ kind: "pdf_page", pageNumber: 1 }),
      expect.objectContaining({ kind: "pdf_page", pageNumber: 2 }),
    ]);

    const imageResult = await extract(path, sourceEntry);
    expect(imageResult.outcome).toBe("ocr_required");
    expect(imageResult.payload).toMatchObject({
      extractionStatus: "ocr_required",
      ocrRequired: true,
      pageCount: 3,
      chunkCount: 0,
      chunks: [],
    });
  });

  it("uses Mammoth block structure for deterministic DOCX heading and paragraph locators", async () => {
    const source = "PK\u0003\u0004synthetic";
    const path = await makeFile("source.docx", source);
    const readDocx = vi.fn().mockResolvedValue({
      warningCount: 1,
      blocks: [
        {
          blockType: "heading",
          headingLevel: 1,
          text: "Management",
        },
        {
          blockType: "paragraph",
          headingLevel: null,
          text: "Treat the clinically reviewed condition.",
        },
      ],
    });
    const log = vi.spyOn(console, "log");
    const extract = createDefaultPrivateExtractor({
      dependencies: { readDocx },
    });

    const result = await extract(
      path,
      entry(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        sourceIdentity(source),
      ),
    );
    const payload = result.payload as PrivateExtractedDocument;

    expect(result).toMatchObject({
      parserId: "mammoth",
      parserVersion: "1.12.0",
    });
    expect(payload.parserWarningCount).toBe(1);
    expect(payload.chunks[1]?.locator).toMatchObject({
      kind: "docx_block",
      blockType: "paragraph",
      headingPath: ["Management"],
    });
    expect(log).not.toHaveBeenCalled();
  });

  it("enforces parser page, block, and output caps even for dependency-injected adapters", async () => {
    const pdfSource = "%PDF-bounded";
    const pdfPath = await makeFile("bounded.pdf", pdfSource);
    const pdfEntry = entry("application/pdf", sourceIdentity(pdfSource));
    const overPageLimit = createDefaultPrivateExtractor({
      maximumPdfPages: 1,
      dependencies: {
        readPdf: vi.fn().mockResolvedValue({
          pageCount: 2,
          pages: [],
        }),
      },
    });
    await expect(overPageLimit(pdfPath, pdfEntry)).rejects.toMatchObject({
      code: "PARSER_LIMIT_EXCEEDED",
    });

    const docxSource = "PK\u0003\u0004bounded";
    const docxPath = await makeFile("bounded.docx", docxSource);
    const docxEntry = entry(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      sourceIdentity(docxSource),
    );
    const overBlockLimit = createDefaultPrivateExtractor({
      maximumDocxBlocks: 1,
      dependencies: {
        readDocx: vi.fn().mockResolvedValue({
          warningCount: 0,
          blocks: [
            {
              blockType: "paragraph",
              headingLevel: null,
              text: "First.",
            },
            {
              blockType: "paragraph",
              headingLevel: null,
              text: "Second.",
            },
          ],
        }),
      },
    });
    await expect(overBlockLimit(docxPath, docxEntry)).rejects.toMatchObject({
      code: "PARSER_LIMIT_EXCEEDED",
    });

    const overOutputLimit = createDefaultPrivateExtractor({
      maximumExtractedCharacters: 1_000,
      dependencies: {
        readDocx: vi.fn().mockResolvedValue({
          warningCount: 0,
          blocks: [
            {
              blockType: "paragraph",
              headingLevel: null,
              text: "x".repeat(1_001),
            },
          ],
        }),
      },
    });
    await expect(overOutputLimit(docxPath, docxEntry)).rejects.toMatchObject({
      code: "PARSER_LIMIT_EXCEEDED",
    });
  });

  it("sanitizes dependency and isolated-parser failures", async () => {
    const source = "%PDF-private-path-C:\\secret\\chapter.pdf";
    const path = await makeFile("private.pdf", source);
    const sourceEntry = entry("application/pdf", sourceIdentity(source));
    const injectedFailure = createDefaultPrivateExtractor({
      dependencies: {
        readPdf: vi.fn().mockRejectedValue(
          new Error(`Parser leaked ${path} and source text ${source}`),
        ),
      },
    });

    await expect(injectedFailure(path, sourceEntry)).rejects.toMatchObject({
      code: "PARSER_FAILED",
      message:
        "Private document parsing failed without exposing source or parser internals.",
    });

    const isolatedFailure = createDefaultPrivateExtractor({
      parserTimeoutMilliseconds: 10_000,
    });
    await expect(isolatedFailure(path, sourceEntry)).rejects.toMatchObject({
      code: "PARSER_WORKER_FAILED",
      message:
        "Private document parsing failed inside the isolated parser process.",
    });
  });

  it("refuses direct extraction without the pipeline's current rights gate", async () => {
    const source = "Private source text.";
    const path = await makeFile("source.txt", source);
    const identity = sourceIdentity(source);
    const extract = createDefaultPrivateExtractor();

    await expect(
      extract(path, entry("text/plain", { ...identity, status: "queued" })),
    ).rejects.toMatchObject({ code: "EXTRACTION_NOT_AUTHORIZED" });
    await expect(
      extract(
        path,
        entry("text/plain", {
          ...identity,
          rightsDecisionExpiresAt: "2026-01-01T12:00:00.000Z",
        }),
      ),
    ).rejects.toMatchObject({ code: "EXTRACTION_NOT_AUTHORIZED" });
  });
});
