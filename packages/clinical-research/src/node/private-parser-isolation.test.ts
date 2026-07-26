import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  parsePrivateDocumentInWorker,
  resolvePrivateParserWorkerUrl,
  type IsolatedPrivateParserLimits,
} from "./private-parser-isolation.js";

const limits: IsolatedPrivateParserLimits = {
  maximumPdfPages: 10,
  maximumDocxBlocks: 100,
  maximumOutputCharacters: 10_000,
  timeoutMilliseconds: 100,
  maximumOldGenerationMegabytes: 64,
};

describe("isolated private parser lifecycle", () => {
  it("resolves an ordinary worker asset in source mode", () => {
    const workerUrl = resolvePrivateParserWorkerUrl();
    expect(workerUrl.protocol).toBe("file:");
    expect(workerUrl.pathname).toMatch(/private-parser-worker\.(?:ts|js)$/);
    expect(existsSync(fileURLToPath(workerUrl))).toBe(true);
  });

  it("parses DOCX through the real source-mode worker boundary", async () => {
    const fixture = new URL(
      "../../../../node_modules/mammoth/test/test-data/single-paragraph.docx",
      import.meta.url,
    );
    const result = (await parsePrivateDocumentInWorker(
      "docx",
      await readFile(fixture),
      {
        ...limits,
        timeoutMilliseconds: 10_000,
      },
    )) as {
      blocks: Array<{ blockType: string; text: string }>;
      warningCount: number;
    };

    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0]).toMatchObject({
      blockType: "paragraph",
    });
    expect(result.blocks[0]!.text.length).toBeGreaterThan(0);
    expect(result.warningCount).toBeGreaterThanOrEqual(0);
  });

  it("terminates a non-responsive parser at the configured deadline", async () => {
    const nonResponsiveWorker = new URL(
      `data:text/javascript,${encodeURIComponent(
        'import { parentPort } from "node:worker_threads"; setInterval(() => {}, 1000); void parentPort;',
      )}`,
    );

    await expect(
      parsePrivateDocumentInWorker(
        "pdf",
        new Uint8Array([1, 2, 3]),
        limits,
        nonResponsiveWorker,
      ),
    ).rejects.toMatchObject({
      code: "PARSER_TIMEOUT",
      message: "Private document parsing exceeded the configured time limit.",
    });
  });

  it("does not expose worker errors or source bytes", async () => {
    const failingWorker = new URL(
      `data:text/javascript,${encodeURIComponent(
        'throw new Error("sensitive parser detail and C:/private/source.pdf");',
      )}`,
    );

    await expect(
      parsePrivateDocumentInWorker(
        "docx",
        new TextEncoder().encode("private source text"),
        limits,
        failingWorker,
      ),
    ).rejects.toMatchObject({
      code: "PARSER_WORKER_FAILED",
      message:
        "Private document parsing failed inside the isolated parser process.",
    });
  });
});
