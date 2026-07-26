import { parentPort, workerData } from "node:worker_threads";

type ParserKind = "pdf" | "docx";

interface ParserLimits {
  maximumPdfPages: number;
  maximumDocxBlocks: number;
  maximumOutputCharacters: number;
}

interface ParserRequest {
  kind: ParserKind;
  sourceBytes: ArrayBuffer;
  limits: ParserLimits;
}

class ParserLimitError extends Error {}

const normalizeExtractedText = (value: string): string =>
  value
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replaceAll("\u0000", "")
    .trim();

const decodeHtmlText = (value: string): string =>
  value
    .replaceAll(/<br\s*\/?>/gi, "\n")
    .replaceAll(/<[^>]+>/g, "")
    .replaceAll(/&#(\d+);/g, (_match, digits: string) =>
      String.fromCodePoint(Number(digits)),
    )
    .replaceAll(/&#x([a-f0-9]+);/gi, (_match, digits: string) =>
      String.fromCodePoint(Number.parseInt(digits, 16)),
    )
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

const parseRequest = (candidate: unknown): ParserRequest => {
  if (typeof candidate !== "object" || candidate === null) {
    throw new Error("Invalid parser request.");
  }
  const record = candidate as Record<string, unknown>;
  if (
    (record.kind !== "pdf" && record.kind !== "docx") ||
    !(record.sourceBytes instanceof ArrayBuffer) ||
    typeof record.limits !== "object" ||
    record.limits === null
  ) {
    throw new Error("Invalid parser request.");
  }
  const limits = record.limits as Record<string, unknown>;
  const maximumPdfPages = limits.maximumPdfPages;
  const maximumDocxBlocks = limits.maximumDocxBlocks;
  const maximumOutputCharacters = limits.maximumOutputCharacters;
  if (
    !Number.isSafeInteger(maximumPdfPages) ||
    !Number.isSafeInteger(maximumDocxBlocks) ||
    !Number.isSafeInteger(maximumOutputCharacters) ||
    (maximumPdfPages as number) < 1 ||
    (maximumDocxBlocks as number) < 1 ||
    (maximumOutputCharacters as number) < 1
  ) {
    throw new Error("Invalid parser limits.");
  }
  return {
    kind: record.kind,
    sourceBytes: record.sourceBytes,
    limits: {
      maximumPdfPages: maximumPdfPages as number,
      maximumDocxBlocks: maximumDocxBlocks as number,
      maximumOutputCharacters: maximumOutputCharacters as number,
    },
  };
};

const parsePdf = async (
  sourceBytes: Uint8Array,
  limits: ParserLimits,
): Promise<unknown> => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = pdfjs.getDocument({
    data: sourceBytes,
    disableFontFace: true,
    useSystemFonts: false,
    verbosity: 0,
  });
  const document = await task.promise;
  try {
    if (document.numPages > limits.maximumPdfPages) {
      throw new ParserLimitError();
    }
    const pages: Array<{ pageNumber: number; text: string }> = [];
    let outputCharacters = 0;
    for (
      let pageNumber = 1;
      pageNumber <= document.numPages;
      pageNumber += 1
    ) {
      const page = await document.getPage(pageNumber);
      try {
        const content = await page.getTextContent();
        const pieces: string[] = [];
        for (const item of content.items) {
          if (!("str" in item)) continue;
          const piece = `${item.str}${item.hasEOL ? "\n" : " "}`;
          outputCharacters += piece.length;
          if (outputCharacters > limits.maximumOutputCharacters) {
            throw new ParserLimitError();
          }
          pieces.push(piece);
        }
        pages.push({
          pageNumber,
          text: normalizeExtractedText(pieces.join("")),
        });
      } finally {
        page.cleanup();
      }
    }
    return { pageCount: document.numPages, pages };
  } finally {
    await task.destroy();
  }
};

const parseDocx = async (
  sourceBytes: Uint8Array,
  limits: ParserLimits,
): Promise<unknown> => {
  const module = await import("mammoth");
  const mammoth = module.default;
  const result = await mammoth.convertToHtml(
    { buffer: Buffer.from(sourceBytes) },
    {
      externalFileAccess: false,
      ignoreEmptyParagraphs: true,
      convertImage: mammoth.images.imgElement(async () => ({ src: "" })),
    },
  );
  // HTML is an intermediate representation. This bound is deliberately a
  // small multiple of the permitted plain-text result and fails closed before
  // regex traversal or parent-thread transfer.
  if (result.value.length > limits.maximumOutputCharacters * 4) {
    throw new ParserLimitError();
  }

  const blocks: Array<{
    blockType: "heading" | "paragraph" | "list_item" | "table_row";
    headingLevel: number | null;
    text: string;
  }> = [];
  const pattern = /<(h[1-6]|p|li|tr)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let outputCharacters = 0;
  for (const match of result.value.matchAll(pattern)) {
    if (blocks.length >= limits.maximumDocxBlocks) {
      throw new ParserLimitError();
    }
    const tag = match[1]!.toLocaleLowerCase();
    const text = normalizeExtractedText(decodeHtmlText(match[2]!));
    if (!text) continue;
    outputCharacters += text.length;
    if (outputCharacters > limits.maximumOutputCharacters) {
      throw new ParserLimitError();
    }
    blocks.push({
      blockType: tag.startsWith("h")
        ? "heading"
        : tag === "li"
          ? "list_item"
          : tag === "tr"
            ? "table_row"
            : "paragraph",
      headingLevel: tag.startsWith("h") ? Number(tag.slice(1)) : null,
      text,
    });
  }
  return {
    blocks,
    warningCount: result.messages.length,
  };
};

const main = async () => {
  const request = parseRequest(workerData);
  const sourceBytes = new Uint8Array(request.sourceBytes);
  const result =
    request.kind === "pdf"
      ? await parsePdf(sourceBytes, request.limits)
      : await parseDocx(sourceBytes, request.limits);
  parentPort?.postMessage({ ok: true, result });
};

void main().catch((error: unknown) => {
  parentPort?.postMessage({
    ok: false,
    code:
      error instanceof ParserLimitError
        ? "PARSER_LIMIT_EXCEEDED"
        : "PARSER_FAILED",
  });
});
