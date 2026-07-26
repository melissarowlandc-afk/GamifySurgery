import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";

import { PrivateIntakeError } from "./private-intake.js";

export type IsolatedPrivateParserKind = "pdf" | "docx";

export interface IsolatedPrivateParserLimits {
  maximumPdfPages: number;
  maximumDocxBlocks: number;
  maximumOutputCharacters: number;
  timeoutMilliseconds: number;
  maximumOldGenerationMegabytes: number;
}

interface ParserWorkerSuccess {
  ok: true;
  result: unknown;
}

interface ParserWorkerFailure {
  ok: false;
  code: "PARSER_LIMIT_EXCEEDED" | "PARSER_FAILED";
}

type ParserWorkerMessage = ParserWorkerSuccess | ParserWorkerFailure;

const isParserWorkerMessage = (candidate: unknown): candidate is ParserWorkerMessage => {
  if (typeof candidate !== "object" || candidate === null) return false;
  const record = candidate as Record<string, unknown>;
  if (record.ok === true) return "result" in record;
  return (
    record.ok === false &&
    (record.code === "PARSER_LIMIT_EXCEEDED" ||
      record.code === "PARSER_FAILED")
  );
};

/**
 * Resolves the emitted worker beside built JavaScript, while allowing the
 * repository's pinned Node runtime to execute the erasable TypeScript worker
 * during source-mode Vite and test runs.
 */
export const resolvePrivateParserWorkerUrl = (): URL => {
  const emittedWorker = new URL("./private-parser-worker.js", import.meta.url);
  if (existsSync(fileURLToPath(emittedWorker))) return emittedWorker;
  return new URL("./private-parser-worker.ts", import.meta.url);
};

const sanitizedFailure = (
  code:
    | "PARSER_LIMIT_EXCEEDED"
    | "PARSER_TIMEOUT"
    | "PARSER_WORKER_FAILED",
): PrivateIntakeError => {
  const messages = {
    PARSER_LIMIT_EXCEEDED:
      "Private document parsing exceeded a configured page, block, or extracted-text limit.",
    PARSER_TIMEOUT:
      "Private document parsing exceeded the configured time limit.",
    PARSER_WORKER_FAILED:
      "Private document parsing failed inside the isolated parser process.",
  } as const;
  return new PrivateIntakeError(code, messages[code]);
};

/**
 * Parses untrusted PDF/DOCX bytes on a separate event loop. The transferred
 * copy prevents the parser from retaining or mutating the caller's Buffer.
 * Worker resourceLimits bound V8 heap/stack use; timeout and output limits
 * provide portable fail-closed bounds for CPU and message size.
 */
export const parsePrivateDocumentInWorker = (
  kind: IsolatedPrivateParserKind,
  sourceBytes: Uint8Array,
  limits: IsolatedPrivateParserLimits,
  workerUrl = resolvePrivateParserWorkerUrl(),
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const transferredBytes = Uint8Array.from(sourceBytes).buffer;
    const sourceMode = workerUrl.pathname.endsWith(".ts");
    let worker: Worker;
    try {
      worker = new Worker(workerUrl, {
        name: `clinical-private-${kind}-parser`,
        execArgv: sourceMode ? ["--experimental-strip-types"] : [],
        workerData: {
          kind,
          sourceBytes: transferredBytes,
          limits: {
            maximumPdfPages: limits.maximumPdfPages,
            maximumDocxBlocks: limits.maximumDocxBlocks,
            maximumOutputCharacters: limits.maximumOutputCharacters,
          },
        },
        transferList: [transferredBytes],
        resourceLimits: {
          maxOldGenerationSizeMb: limits.maximumOldGenerationMegabytes,
          maxYoungGenerationSizeMb: Math.max(
            16,
            Math.min(
              32,
              Math.floor(limits.maximumOldGenerationMegabytes / 4),
            ),
          ),
          stackSizeMb: 4,
        },
      });
    } catch {
      reject(sanitizedFailure("PARSER_WORKER_FAILED"));
      return;
    }

    let settled = false;
    const terminateQuietly = () => {
      void worker.terminate().catch(() => undefined);
    };
    const finish = (action: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.removeAllListeners();
      action();
    };
    const timer = setTimeout(() => {
      finish(() => {
        terminateQuietly();
        reject(sanitizedFailure("PARSER_TIMEOUT"));
      });
    }, limits.timeoutMilliseconds);
    timer.unref();

    worker.once("message", (candidate: unknown) => {
      finish(() => {
        terminateQuietly();
        if (!isParserWorkerMessage(candidate)) {
          reject(sanitizedFailure("PARSER_WORKER_FAILED"));
          return;
        }
        if (!candidate.ok) {
          reject(
            sanitizedFailure(
              candidate.code === "PARSER_LIMIT_EXCEEDED"
                ? "PARSER_LIMIT_EXCEEDED"
                : "PARSER_WORKER_FAILED",
            ),
          );
          return;
        }
        resolve(candidate.result);
      });
    });
    worker.once("messageerror", () => {
      finish(() => {
        terminateQuietly();
        reject(sanitizedFailure("PARSER_WORKER_FAILED"));
      });
    });
    worker.once("error", () => {
      finish(() => {
        terminateQuietly();
        reject(sanitizedFailure("PARSER_WORKER_FAILED"));
      });
    });
    worker.once("exit", () => {
      finish(() => reject(sanitizedFailure("PARSER_WORKER_FAILED")));
    });
  });
