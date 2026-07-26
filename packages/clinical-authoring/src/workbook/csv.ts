export type CsvRecord = {
  recordNumber: number;
  startLine: number;
  values: string[];
};

export type CsvDocument = {
  sourceName: string;
  records: CsvRecord[];
};

export class CsvParseError extends Error {
  readonly sourceName: string;
  readonly line: number;
  readonly column: number;

  constructor(
    sourceName: string,
    line: number,
    column: number,
    message: string,
  ) {
    super(`${sourceName}:${line}:${column}: ${message}`);
    this.name = "CsvParseError";
    this.sourceName = sourceName;
    this.line = line;
    this.column = column;
  }
}

export type CsvObjectRow<Header extends string> = {
  recordNumber: number;
  startLine: number;
  values: Record<Header, string>;
};

function decodeUtf8(bytes: Uint8Array, sourceName: string): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new CsvParseError(
      sourceName,
      1,
      1,
      "The file is not valid UTF-8.",
    );
  }
}

function consumeNewline(
  text: string,
  index: number,
): { nextIndex: number; raw: string } {
  if (text[index] === "\r" && text[index + 1] === "\n") {
    return { nextIndex: index + 2, raw: "\r\n" };
  }
  return { nextIndex: index + 1, raw: text[index] ?? "" };
}

/**
 * Parse a deliberately small, strict RFC 4180-style CSV dialect.
 *
 * Supported:
 * - UTF-8 with an optional BOM;
 * - commas;
 * - quoted fields;
 * - doubled quotes inside quoted fields;
 * - CRLF, LF, or CR record separators;
 * - embedded record separators inside quoted fields.
 *
 * Embedded newlines are normalized to LF so equivalent spreadsheet exports
 * compile identically on Windows and Unix. No formulas or escape sequences are
 * evaluated.
 */
export function parseCsvBytes(
  bytes: Uint8Array,
  sourceName = "<csv>",
): CsvDocument {
  let text = decodeUtf8(bytes, sourceName);
  if (text.startsWith("\uFEFF")) {
    text = text.slice(1);
  }
  if (text.includes("\0")) {
    throw new CsvParseError(sourceName, 1, 1, "NUL bytes are not permitted.");
  }

  const records: CsvRecord[] = [];
  let index = 0;
  let line = 1;
  let column = 1;
  let recordStartLine = 1;
  let recordNumber = 1;
  let values: string[] = [];
  let field = "";
  let fieldStarted = false;
  let quoted = false;
  let quoteClosed = false;

  function finishField(): void {
    values.push(field);
    field = "";
    fieldStarted = false;
    quoted = false;
    quoteClosed = false;
  }

  function finishRecord(): void {
    finishField();
    records.push({
      recordNumber,
      startLine: recordStartLine,
      values,
    });
    values = [];
    recordNumber += 1;
  }

  while (index < text.length) {
    const character = text[index]!;

    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 2;
          column += 2;
        } else {
          quoted = false;
          quoteClosed = true;
          index += 1;
          column += 1;
        }
        continue;
      }

      if (character === "\r" || character === "\n") {
        const newline = consumeNewline(text, index);
        field += "\n";
        index = newline.nextIndex;
        line += 1;
        column = 1;
        continue;
      }

      field += character;
      index += 1;
      column += 1;
      continue;
    }

    if (quoteClosed) {
      if (
        character !== "," &&
        character !== "\r" &&
        character !== "\n"
      ) {
        throw new CsvParseError(
          sourceName,
          line,
          column,
          "Only a comma or record separator may follow a closing quote.",
        );
      }
    }

    if (character === ",") {
      finishField();
      index += 1;
      column += 1;
      continue;
    }

    if (character === "\r" || character === "\n") {
      finishRecord();
      const newline = consumeNewline(text, index);
      index = newline.nextIndex;
      line += 1;
      column = 1;
      recordStartLine = line;
      continue;
    }

    if (character === '"') {
      if (fieldStarted) {
        throw new CsvParseError(
          sourceName,
          line,
          column,
          "A quote may appear only at the beginning of a quoted field.",
        );
      }
      quoted = true;
      fieldStarted = true;
      index += 1;
      column += 1;
      continue;
    }

    if (quoteClosed) {
      throw new CsvParseError(
        sourceName,
        line,
        column,
        "Unexpected content after a closing quote.",
      );
    }

    field += character;
    fieldStarted = true;
    index += 1;
    column += 1;
  }

  if (quoted) {
    throw new CsvParseError(
      sourceName,
      line,
      column,
      "The quoted field is not terminated.",
    );
  }

  const endedWithRecordSeparator =
    text.endsWith("\n") || text.endsWith("\r");
  if (
    !endedWithRecordSeparator ||
    fieldStarted ||
    quoteClosed ||
    values.length > 0
  ) {
    finishRecord();
  }

  return { sourceName, records };
}

export function rowsWithHeaders<const Header extends readonly string[]>(
  document: CsvDocument,
  expectedHeaders: Header,
): CsvObjectRow<Header[number]>[] {
  const [headerRecord, ...dataRecords] = document.records;
  if (!headerRecord) {
    throw new CsvParseError(
      document.sourceName,
      1,
      1,
      "The CSV file must contain a header row.",
    );
  }

  const duplicateHeaders = headerRecord.values.filter(
    (header, index, headers) => headers.indexOf(header) !== index,
  );
  if (duplicateHeaders.length > 0) {
    throw new CsvParseError(
      document.sourceName,
      headerRecord.startLine,
      1,
      `Duplicate header: ${duplicateHeaders[0]}`,
    );
  }

  const expected = new Set<string>(expectedHeaders);
  const actual = new Set(headerRecord.values);
  const missing = expectedHeaders.filter((header) => !actual.has(header));
  const unexpected = headerRecord.values.filter((header) => !expected.has(header));
  if (missing.length > 0 || unexpected.length > 0) {
    const details = [
      missing.length > 0 ? `missing ${missing.join(", ")}` : null,
      unexpected.length > 0 ? `unexpected ${unexpected.join(", ")}` : null,
    ]
      .filter((detail): detail is string => detail !== null)
      .join("; ");
    throw new CsvParseError(
      document.sourceName,
      headerRecord.startLine,
      1,
      `Header mismatch (${details}).`,
    );
  }

  return dataRecords
    .filter((record) => !record.values.every((value) => value === ""))
    .map((record) => {
      if (record.values.length !== headerRecord.values.length) {
        throw new CsvParseError(
          document.sourceName,
          record.startLine,
          1,
          `Expected ${headerRecord.values.length} fields but found ${record.values.length}.`,
        );
      }

      const row = Object.fromEntries(
        headerRecord.values.map((header, index) => [
          header,
          record.values[index]!,
        ]),
      ) as Record<Header[number], string>;

      return {
        recordNumber: record.recordNumber,
        startLine: record.startLine,
        values: row,
      };
    });
}

function encodeCsvValue(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\r") ||
    value.includes("\n")
  ) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function serializeCsv(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): string {
  for (const [index, row] of rows.entries()) {
    if (row.length !== headers.length) {
      throw new Error(
        `CSV row ${index + 1} has ${row.length} fields; expected ${headers.length}.`,
      );
    }
  }
  return [
    headers.map(encodeCsvValue).join(","),
    ...rows.map((row) => row.map(encodeCsvValue).join(",")),
  ].join("\n") + "\n";
}
