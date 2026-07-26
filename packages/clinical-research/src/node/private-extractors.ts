import { createHash } from "node:crypto";
import { lstat, open } from "node:fs/promises";

import {
  DEFAULT_MAX_PRIVATE_SOURCE_BYTES,
  PrivateIntakeError,
  processPrivateIntake,
  type PrivateExtractionResult,
  type PrivateIntakeManifestEntry,
  type ProcessPrivateIntakeOptions,
  type ProcessPrivateIntakeReport,
} from "./private-intake.js";
import {
  parsePrivateDocumentInWorker,
  type IsolatedPrivateParserLimits,
} from "./private-parser-isolation.js";

export const DEFAULT_PRIVATE_CHUNK_CHARACTERS = 3_000;
export const MAX_PRIVATE_EXTRACTION_CHUNKS = 50_000;
export const MAX_PRIVATE_PDF_PAGES = 2_000;
export const MAX_PRIVATE_DOCX_BLOCKS = 20_000;
export const MAX_PRIVATE_EXTRACTED_CHARACTERS = 12_000_000;
export const DEFAULT_PRIVATE_PARSER_TIMEOUT_MILLISECONDS = 45_000;
export const MAX_PRIVATE_PARSER_TIMEOUT_MILLISECONDS = 120_000;
export const DEFAULT_PRIVATE_PARSER_OLD_GENERATION_MEGABYTES = 256;
export const MAX_PRIVATE_PARSER_OLD_GENERATION_MEGABYTES = 1_024;
export const PRIVATE_CHUNKER_VERSION = "locator-aware-bounded-chunker.v1";

const PDF_MEDIA_TYPE = "application/pdf";
const DOCX_MEDIA_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const TEXT_MEDIA_TYPES = new Set(["text/plain", "text/markdown"]);

export type PrivateSourceLocator =
  | {
      kind: "pdf_page";
      pageNumber: number;
      pageChunk: number;
      characterStart: number;
      characterEnd: number;
    }
  | {
      kind: "docx_block";
      blockNumber: number;
      blockType: "heading" | "paragraph" | "list_item" | "table_row";
      headingPath: string[];
      blockChunk: number;
      characterStart: number;
      characterEnd: number;
    }
  | {
      kind: "text_lines";
      lineStart: number;
      lineEnd: number;
      headingPath: string[];
      blockChunk: number;
      characterStart: number;
      characterEnd: number;
    };

export interface PrivateExtractedChunk {
  schemaVersion: 1;
  id: string;
  ordinal: number;
  locator: PrivateSourceLocator;
  text: string;
  characterCount: number;
}

export interface PrivateExtractedDocument {
  schemaVersion: 1;
  mediaType: string;
  sourceSha256: string;
  extractionStatus: "complete" | "ocr_required";
  ocrRequired: boolean;
  pageCount: number | null;
  sourceBlockCount: number;
  chunkMaximumCharacters: number;
  chunkCount: number;
  parserWarningCount: number;
  chunks: PrivateExtractedChunk[];
}

export interface PdfTextPage {
  pageNumber: number;
  text: string;
}

export interface PdfTextAdapterResult {
  pageCount: number;
  pages: PdfTextPage[];
}

export interface DocxTextBlock {
  blockType: "heading" | "paragraph" | "list_item" | "table_row";
  headingLevel: number | null;
  text: string;
}

export interface DocxTextAdapterResult {
  blocks: DocxTextBlock[];
  warningCount: number;
}

export interface DefaultPrivateExtractorDependencies {
  readPdf?: (bytes: Uint8Array) => Promise<PdfTextAdapterResult>;
  readDocx?: (bytes: Uint8Array) => Promise<DocxTextAdapterResult>;
}

export interface DefaultPrivateExtractorOptions {
  maximumChunkCharacters?: number;
  maximumSourceBytes?: number;
  maximumPdfPages?: number;
  maximumDocxBlocks?: number;
  maximumExtractedCharacters?: number;
  parserTimeoutMilliseconds?: number;
  parserMaximumOldGenerationMegabytes?: number;
  dependencies?: DefaultPrivateExtractorDependencies;
}

interface LocatedBlock {
  text: string;
  locator:
    | {
        kind: "pdf_page";
        pageNumber: number;
      }
    | {
        kind: "docx_block";
        blockNumber: number;
        blockType: DocxTextBlock["blockType"];
        headingPath: string[];
      }
    | {
        kind: "text_lines";
        lineStart: number;
        lineEnd: number;
        headingPath: string[];
      };
}

const sha256 = (value: string | Uint8Array): string =>
  createHash("sha256").update(value).digest("hex");

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, canonicalize(nested)]),
  );
};

const normalizeExtractedText = (value: string): string =>
  value
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replaceAll("\u0000", "")
    .trim();

const assertExtractorOptions = (
  options: DefaultPrivateExtractorOptions,
): {
  maximumChunkCharacters: number;
  maximumSourceBytes: number;
  parserLimits: IsolatedPrivateParserLimits;
} => {
  const maximumChunkCharacters =
    options.maximumChunkCharacters ?? DEFAULT_PRIVATE_CHUNK_CHARACTERS;
  if (
    !Number.isSafeInteger(maximumChunkCharacters) ||
    maximumChunkCharacters < 256 ||
    maximumChunkCharacters > 16_000
  ) {
    throw new Error(
      "maximumChunkCharacters must be an integer from 256 through 16000.",
    );
  }
  const maximumSourceBytes =
    options.maximumSourceBytes ?? DEFAULT_MAX_PRIVATE_SOURCE_BYTES;
  if (
    !Number.isSafeInteger(maximumSourceBytes) ||
    maximumSourceBytes < 1 ||
    maximumSourceBytes > DEFAULT_MAX_PRIVATE_SOURCE_BYTES
  ) {
    throw new Error(
      `maximumSourceBytes must be an integer from 1 through ${DEFAULT_MAX_PRIVATE_SOURCE_BYTES}.`,
    );
  }
  const maximumPdfPages = options.maximumPdfPages ?? MAX_PRIVATE_PDF_PAGES;
  if (
    !Number.isSafeInteger(maximumPdfPages) ||
    maximumPdfPages < 1 ||
    maximumPdfPages > MAX_PRIVATE_PDF_PAGES
  ) {
    throw new Error(
      `maximumPdfPages must be an integer from 1 through ${MAX_PRIVATE_PDF_PAGES}.`,
    );
  }
  const maximumDocxBlocks =
    options.maximumDocxBlocks ?? MAX_PRIVATE_DOCX_BLOCKS;
  if (
    !Number.isSafeInteger(maximumDocxBlocks) ||
    maximumDocxBlocks < 1 ||
    maximumDocxBlocks > MAX_PRIVATE_DOCX_BLOCKS
  ) {
    throw new Error(
      `maximumDocxBlocks must be an integer from 1 through ${MAX_PRIVATE_DOCX_BLOCKS}.`,
    );
  }
  const maximumOutputCharacters =
    options.maximumExtractedCharacters ?? MAX_PRIVATE_EXTRACTED_CHARACTERS;
  if (
    !Number.isSafeInteger(maximumOutputCharacters) ||
    maximumOutputCharacters < 1_000 ||
    maximumOutputCharacters > MAX_PRIVATE_EXTRACTED_CHARACTERS
  ) {
    throw new Error(
      `maximumExtractedCharacters must be an integer from 1000 through ${MAX_PRIVATE_EXTRACTED_CHARACTERS}.`,
    );
  }
  const timeoutMilliseconds =
    options.parserTimeoutMilliseconds ??
    DEFAULT_PRIVATE_PARSER_TIMEOUT_MILLISECONDS;
  if (
    !Number.isSafeInteger(timeoutMilliseconds) ||
    timeoutMilliseconds < 100 ||
    timeoutMilliseconds > MAX_PRIVATE_PARSER_TIMEOUT_MILLISECONDS
  ) {
    throw new Error(
      `parserTimeoutMilliseconds must be an integer from 100 through ${MAX_PRIVATE_PARSER_TIMEOUT_MILLISECONDS}.`,
    );
  }
  const maximumOldGenerationMegabytes =
    options.parserMaximumOldGenerationMegabytes ??
    DEFAULT_PRIVATE_PARSER_OLD_GENERATION_MEGABYTES;
  if (
    !Number.isSafeInteger(maximumOldGenerationMegabytes) ||
    maximumOldGenerationMegabytes < 64 ||
    maximumOldGenerationMegabytes >
      MAX_PRIVATE_PARSER_OLD_GENERATION_MEGABYTES
  ) {
    throw new Error(
      `parserMaximumOldGenerationMegabytes must be an integer from 64 through ${MAX_PRIVATE_PARSER_OLD_GENERATION_MEGABYTES}.`,
    );
  }
  return {
    maximumChunkCharacters,
    maximumSourceBytes,
    parserLimits: {
      maximumPdfPages,
      maximumDocxBlocks,
      maximumOutputCharacters,
      timeoutMilliseconds,
      maximumOldGenerationMegabytes,
    },
  };
};

function assertExtractionAuthorized(
  entry: Readonly<PrivateIntakeManifestEntry>,
): asserts entry is Readonly<PrivateIntakeManifestEntry> & {
  sha256: string;
  sourceId: string;
  rightsDecisionId: string;
  rightsDecisionSha256: string;
  rightsDecisionEffectiveAt: string;
} {
  const currentTime = Date.parse(entry.updatedAt);
  if (
    entry.status !== "extracting" ||
    !entry.sourceId ||
    !entry.rightsDecisionId ||
    !entry.rightsDecisionSha256 ||
    !/^[a-f0-9]{64}$/.test(entry.rightsDecisionSha256) ||
    !entry.rightsDecisionEffectiveAt ||
    Number.isNaN(Date.parse(entry.rightsDecisionEffectiveAt)) ||
    Date.parse(entry.rightsDecisionEffectiveAt) > currentTime ||
    (entry.rightsDecisionExpiresAt !== null &&
      Date.parse(entry.rightsDecisionExpiresAt) <= currentTime) ||
    !entry.sha256 ||
    !/^[a-f0-9]{64}$/.test(entry.sha256)
  ) {
    throw new PrivateIntakeError(
      "EXTRACTION_NOT_AUTHORIZED",
      "Default extraction requires an extracting entry with a current immutable rights authorization.",
    );
  }
}

const boundedPieces = (
  text: string,
  maximumCharacters: number,
): Array<{ text: string; start: number; end: number }> => {
  const pieces: Array<{ text: string; start: number; end: number }> = [];
  let cursor = 0;
  while (cursor < text.length) {
    let end = Math.min(text.length, cursor + maximumCharacters);
    if (end < text.length) {
      const minimumBreak = cursor + Math.floor(maximumCharacters * 0.6);
      const breakAt = Math.max(
        text.lastIndexOf("\n", end),
        text.lastIndexOf(" ", end),
      );
      if (breakAt >= minimumBreak) end = breakAt;
    }
    const raw = text.slice(cursor, end);
    const leading = raw.length - raw.trimStart().length;
    const trailing = raw.length - raw.trimEnd().length;
    const normalized = raw.trim();
    if (normalized) {
      pieces.push({
        text: normalized,
        start: cursor + leading,
        end: end - trailing,
      });
    }
    cursor = end;
    while (cursor < text.length && /\s/.test(text[cursor]!)) cursor += 1;
  }
  return pieces;
};

const makeChunks = (
  sourceSha256: string,
  blocks: LocatedBlock[],
  maximumCharacters: number,
): PrivateExtractedChunk[] => {
  const chunks: PrivateExtractedChunk[] = [];
  for (const block of blocks) {
    const pieces = boundedPieces(block.text, maximumCharacters);
    pieces.forEach((piece, blockChunkIndex) => {
      const locator: PrivateSourceLocator =
        block.locator.kind === "pdf_page"
          ? {
              ...block.locator,
              pageChunk: blockChunkIndex + 1,
              characterStart: piece.start,
              characterEnd: piece.end,
            }
          : {
              ...block.locator,
              blockChunk: blockChunkIndex + 1,
              characterStart: piece.start,
              characterEnd: piece.end,
            };
      const identity = sha256(
        JSON.stringify(
          canonicalize({
            sourceSha256,
            locator,
            text: piece.text,
          }),
        ),
      );
      chunks.push({
        schemaVersion: 1,
        id: `private-source-chunk.${identity}`,
        ordinal: chunks.length + 1,
        locator,
        text: piece.text,
        characterCount: piece.text.length,
      });
      if (chunks.length > MAX_PRIVATE_EXTRACTION_CHUNKS) {
        throw new PrivateIntakeError(
          "TOO_MANY_EXTRACTED_CHUNKS",
          `Private extraction exceeded ${MAX_PRIVATE_EXTRACTION_CHUNKS} bounded chunks.`,
        );
      }
    });
  }
  return chunks;
};

const textBlocks = (
  text: string,
  markdown: boolean,
): LocatedBlock[] => {
  const lines = text
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .split("\n");
  const blocks: LocatedBlock[] = [];
  const headingPath: string[] = [];
  let paragraphStart: number | null = null;
  let paragraphLines: string[] = [];

  const flush = (lineEnd: number) => {
    if (paragraphStart === null) return;
    const normalized = normalizeExtractedText(paragraphLines.join("\n"));
    if (normalized) {
      blocks.push({
        text: normalized,
        locator: {
          kind: "text_lines",
          lineStart: paragraphStart,
          lineEnd,
          headingPath: [...headingPath],
        },
      });
    }
    paragraphStart = null;
    paragraphLines = [];
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const heading = markdown ? /^(#{1,6})\s+(.+?)\s*$/.exec(line) : null;
    if (heading) {
      flush(lineNumber - 1);
      const level = Math.min(heading[1]!.length, headingPath.length + 1);
      headingPath.splice(level - 1);
      headingPath[level - 1] = normalizeExtractedText(heading[2]!);
      blocks.push({
        text: normalizeExtractedText(line),
        locator: {
          kind: "text_lines",
          lineStart: lineNumber,
          lineEnd: lineNumber,
          headingPath: [...headingPath],
        },
      });
      return;
    }
    if (!line.trim()) {
      flush(lineNumber - 1);
      return;
    }
    if (paragraphStart === null) paragraphStart = lineNumber;
    paragraphLines.push(line);
  });
  flush(lines.length);
  return blocks;
};

const parserLimitError = (): PrivateIntakeError =>
  new PrivateIntakeError(
    "PARSER_LIMIT_EXCEEDED",
    "Private document parsing exceeded a configured page, block, or extracted-text limit.",
  );

const parserResultError = (): PrivateIntakeError =>
  new PrivateIntakeError(
    "PARSER_RESULT_INVALID",
    "The isolated private document parser returned an invalid bounded result.",
  );

const isRecord = (candidate: unknown): candidate is Record<string, unknown> =>
  typeof candidate === "object" && candidate !== null;

const validatePdfParserResult = (
  candidate: unknown,
  limits: IsolatedPrivateParserLimits,
): PdfTextAdapterResult => {
  if (!isRecord(candidate) || !Array.isArray(candidate.pages)) {
    throw parserResultError();
  }
  const pageCount = candidate.pageCount;
  if (
    !Number.isSafeInteger(pageCount) ||
    (pageCount as number) < 0 ||
    (pageCount as number) > limits.maximumPdfPages ||
    candidate.pages.length > (pageCount as number)
  ) {
    throw parserLimitError();
  }
  const pages: PdfTextPage[] = [];
  const pageNumbers = new Set<number>();
  let outputCharacters = 0;
  for (const rawPage of candidate.pages) {
    if (!isRecord(rawPage)) throw parserResultError();
    const pageNumber = rawPage.pageNumber;
    const text = rawPage.text;
    if (
      !Number.isSafeInteger(pageNumber) ||
      (pageNumber as number) < 1 ||
      (pageNumber as number) > (pageCount as number) ||
      typeof text !== "string" ||
      pageNumbers.has(pageNumber as number)
    ) {
      throw parserResultError();
    }
    outputCharacters += text.length;
    if (outputCharacters > limits.maximumOutputCharacters) {
      throw parserLimitError();
    }
    pageNumbers.add(pageNumber as number);
    pages.push({ pageNumber: pageNumber as number, text });
  }
  return { pageCount: pageCount as number, pages };
};

const validateDocxParserResult = (
  candidate: unknown,
  limits: IsolatedPrivateParserLimits,
): DocxTextAdapterResult => {
  if (!isRecord(candidate) || !Array.isArray(candidate.blocks)) {
    throw parserResultError();
  }
  if (candidate.blocks.length > limits.maximumDocxBlocks) {
    throw parserLimitError();
  }
  const warningCount = candidate.warningCount;
  if (
    !Number.isSafeInteger(warningCount) ||
    (warningCount as number) < 0
  ) {
    throw parserResultError();
  }
  const blocks: DocxTextBlock[] = [];
  let outputCharacters = 0;
  for (const rawBlock of candidate.blocks) {
    if (!isRecord(rawBlock)) throw parserResultError();
    const { blockType, headingLevel, text } = rawBlock;
    if (
      !["heading", "paragraph", "list_item", "table_row"].includes(
        String(blockType),
      ) ||
      typeof text !== "string" ||
      (headingLevel !== null &&
        (!Number.isSafeInteger(headingLevel) ||
          (headingLevel as number) < 1 ||
          (headingLevel as number) > 6)) ||
      (blockType === "heading") !== (headingLevel !== null)
    ) {
      throw parserResultError();
    }
    outputCharacters += text.length;
    if (outputCharacters > limits.maximumOutputCharacters) {
      throw parserLimitError();
    }
    blocks.push({
      blockType: blockType as DocxTextBlock["blockType"],
      headingLevel: headingLevel as number | null,
      text,
    });
  }
  return {
    blocks,
    warningCount: warningCount as number,
  };
};

const assertLocatedBlocksBounded = (
  blocks: readonly LocatedBlock[],
  maximumOutputCharacters: number,
) => {
  let outputCharacters = 0;
  for (const block of blocks) {
    outputCharacters += block.text.length;
    if (outputCharacters > maximumOutputCharacters) {
      throw parserLimitError();
    }
  }
};

export const createDefaultPrivateExtractor = (
  options: DefaultPrivateExtractorOptions = {},
): ((
  filePath: string,
  entry: Readonly<PrivateIntakeManifestEntry>,
) => Promise<PrivateExtractionResult>) => {
  const { maximumChunkCharacters, maximumSourceBytes, parserLimits } =
    assertExtractorOptions(options);
  const injectedPdfParser = options.dependencies?.readPdf;
  const injectedDocxParser = options.dependencies?.readDocx;

  return async (filePath, entry) => {
    assertExtractionAuthorized(entry);
    const mediaType = entry.detectedMediaType;
    if (!mediaType) {
      throw new PrivateIntakeError(
        "UNSUPPORTED_MEDIA_TYPE",
        "Default extraction requires a detected source media type.",
      );
    }
    const linkDetails = await lstat(filePath);
    if (linkDetails.isSymbolicLink() || !linkDetails.isFile()) {
      throw new PrivateIntakeError(
        "UNSAFE_SOURCE_TYPE",
        "Default extraction requires an ordinary source file within the configured byte limit.",
      );
    }
    const handle = await open(filePath, "r");
    let sourceBytes: Buffer;
    try {
      const before = await handle.stat();
      if (
        !before.isFile() ||
        linkDetails.dev !== before.dev ||
        linkDetails.ino !== before.ino
      ) {
        throw new PrivateIntakeError(
          "SOURCE_CHANGED_DURING_EXTRACTION",
          "Private source identity changed before extraction began.",
        );
      }
      if (before.size > maximumSourceBytes) {
        throw new PrivateIntakeError(
          "SOURCE_TOO_LARGE",
          "Default extraction requires an ordinary source file within the configured byte limit.",
        );
      }
      const chunks: Buffer[] = [];
      let total = 0;
      const stream = handle.createReadStream({ autoClose: false });
      for await (const rawChunk of stream) {
        const chunk = Buffer.isBuffer(rawChunk)
          ? rawChunk
          : Buffer.from(rawChunk);
        total += chunk.byteLength;
        if (total > maximumSourceBytes) {
          throw new PrivateIntakeError(
            "SOURCE_TOO_LARGE",
            "Private source grew beyond the configured extraction byte limit.",
          );
        }
        chunks.push(chunk);
      }
      const after = await handle.stat();
      if (
        before.size !== after.size ||
        before.mtimeMs !== after.mtimeMs ||
        total !== after.size
      ) {
        throw new PrivateIntakeError(
          "SOURCE_CHANGED_DURING_EXTRACTION",
          "Private source changed while it was being read for extraction.",
        );
      }
      sourceBytes = Buffer.concat(chunks, total);
    } finally {
      await handle.close();
    }
    if (sha256(sourceBytes) !== entry.sha256) {
      throw new PrivateIntakeError(
        "SOURCE_HASH_CHANGED",
        "Private source bytes no longer match the immutable intake identity.",
      );
    }

    let blocks: LocatedBlock[];
    let parserId: string;
    let parserVersion: string;
    let warningCount = 0;
    let pageCount: number | null = null;
    let ocrRequired = false;

    try {
      if (mediaType === PDF_MEDIA_TYPE) {
        const rawPdf = injectedPdfParser
          ? await injectedPdfParser(sourceBytes)
          : await parsePrivateDocumentInWorker(
              "pdf",
              sourceBytes,
              parserLimits,
            );
        const pdf = validatePdfParserResult(rawPdf, parserLimits);
        pageCount = pdf.pageCount;
        blocks = pdf.pages.flatMap((page) => {
          const text = normalizeExtractedText(page.text);
          return text
            ? [
                {
                  text,
                  locator: {
                    kind: "pdf_page" as const,
                    pageNumber: page.pageNumber,
                  },
                },
              ]
            : [];
        });
        ocrRequired = blocks.length === 0 && pdf.pageCount > 0;
        parserId = "pdfjs-dist";
        parserVersion = "6.1.200";
      } else if (mediaType === DOCX_MEDIA_TYPE) {
        const rawDocx = injectedDocxParser
          ? await injectedDocxParser(sourceBytes)
          : await parsePrivateDocumentInWorker(
              "docx",
              sourceBytes,
              parserLimits,
            );
        const docx = validateDocxParserResult(rawDocx, parserLimits);
        const headingPath: string[] = [];
        blocks = docx.blocks.flatMap((block, index) => {
          const text = normalizeExtractedText(block.text);
          if (!text) return [];
          if (block.blockType === "heading" && block.headingLevel !== null) {
            const level = Math.min(block.headingLevel, headingPath.length + 1);
            headingPath.splice(level - 1);
            headingPath[level - 1] = text;
          }
          return [
            {
              text,
              locator: {
                kind: "docx_block" as const,
                blockNumber: index + 1,
                blockType: block.blockType,
                headingPath: [...headingPath],
              },
            },
          ];
        });
        warningCount = docx.warningCount;
        parserId = "mammoth";
        parserVersion = "1.12.0";
      } else if (TEXT_MEDIA_TYPES.has(mediaType)) {
        const text = new TextDecoder("utf-8", { fatal: true }).decode(
          sourceBytes,
        );
        blocks = textBlocks(text, mediaType === "text/markdown");
        parserId = "node-text-decoder";
        parserVersion = process.versions.node;
      } else {
        throw new PrivateIntakeError(
          "UNSUPPORTED_MEDIA_TYPE",
          "No default private extractor is registered for the detected media type.",
        );
      }
      assertLocatedBlocksBounded(
        blocks,
        parserLimits.maximumOutputCharacters,
      );
    } catch (error) {
      if (error instanceof PrivateIntakeError) throw error;
      throw new PrivateIntakeError(
        "PARSER_FAILED",
        "Private document parsing failed without exposing source or parser internals.",
      );
    }

    const chunks = makeChunks(
      entry.sha256,
      blocks,
      maximumChunkCharacters,
    );
    const payload: PrivateExtractedDocument = {
      schemaVersion: 1,
      mediaType,
      sourceSha256: entry.sha256,
      extractionStatus: ocrRequired ? "ocr_required" : "complete",
      ocrRequired,
      pageCount,
      sourceBlockCount: blocks.length,
      chunkMaximumCharacters: maximumChunkCharacters,
      chunkCount: chunks.length,
      parserWarningCount: warningCount,
      chunks,
    };
    return {
      parserId,
      parserVersion,
      chunkerVersion:
        `${PRIVATE_CHUNKER_VERSION}.max-${maximumChunkCharacters}`,
      outcome: ocrRequired ? "ocr_required" : "complete",
      payload,
    };
  };
};

export interface ProcessPrivateIntakeWithDefaultsOptions
  extends Omit<ProcessPrivateIntakeOptions, "extract"> {
  extractor?: DefaultPrivateExtractorOptions;
}

export const processPrivateIntakeWithDefaultExtractors = (
  options: ProcessPrivateIntakeWithDefaultsOptions,
): Promise<ProcessPrivateIntakeReport> => {
  const { extractor, ...intake } = options;
  return processPrivateIntake({
    ...intake,
    extract: createDefaultPrivateExtractor(extractor),
  });
};
