import { describe, expect, it } from "vitest";

import {
  CsvParseError,
  parseCsvBytes,
  rowsWithHeaders,
  serializeCsv,
} from "../src/workbook/csv.js";

const encoder = new TextEncoder();

function parse(text: string) {
  return parseCsvBytes(encoder.encode(text), "fixture.csv");
}

describe("strict workbook CSV parser", () => {
  it("parses quoted commas, doubled quotes, and a UTF-8 BOM", () => {
    const document = parse(
      '\uFEFFid,narrative\r\nfact.one,"A comma, and ""quoted"" text."\r\n',
    );

    expect(rowsWithHeaders(document, ["id", "narrative"] as const)).toEqual([
      {
        recordNumber: 2,
        startLine: 2,
        values: {
          id: "fact.one",
          narrative: 'A comma, and "quoted" text.',
        },
      },
    ]);
  });

  it("normalizes embedded CSV newlines to LF", () => {
    const document = parse('id,narrative\r\nfact.one,"line 1\r\nline 2"\r\n');

    expect(
      rowsWithHeaders(document, ["id", "narrative"] as const)[0]?.values
        .narrative,
    ).toBe("line 1\nline 2");
  });

  it("keeps empty trailing fields", () => {
    const document = parse("id,note\nfact.one,\n");

    expect(rowsWithHeaders(document, ["id", "note"] as const)[0]?.values).toEqual(
      {
        id: "fact.one",
        note: "",
      },
    );
  });

  it("ignores fully blank spreadsheet rows but rejects partial rows", () => {
    const document = parse("id,note\n\nfact.one,ready\n,\n");

    expect(rowsWithHeaders(document, ["id", "note"] as const)).toEqual([
      {
        recordNumber: 3,
        startLine: 3,
        values: { id: "fact.one", note: "ready" },
      },
    ]);

    expect(() =>
      rowsWithHeaders(parse("id,note\nfact.one\n"), ["id", "note"] as const),
    ).toThrow(/Expected 2 fields but found 1/);
  });

  it("rejects invalid UTF-8", () => {
    expect(() =>
      parseCsvBytes(new Uint8Array([0xff]), "invalid.csv"),
    ).toThrow(/not valid UTF-8/);
  });

  it("rejects unterminated quoted fields with a source location", () => {
    expect(() => parse('id,narrative\nfact.one,"unfinished')).toThrow(
      new CsvParseError(
        "fixture.csv",
        2,
        21,
        "The quoted field is not terminated.",
      ),
    );
  });

  it("rejects duplicate, missing, and unexpected headers", () => {
    expect(() =>
      rowsWithHeaders(parse("id,id\none,two\n"), ["id", "name"] as const),
    ).toThrow(/Duplicate header: id/);

    expect(() =>
      rowsWithHeaders(parse("id,other\none,two\n"), ["id", "name"] as const),
    ).toThrow(/missing name; unexpected other/);
  });

  it("rejects a row with the wrong number of fields", () => {
    expect(() =>
      rowsWithHeaders(parse("id,name\none\n"), ["id", "name"] as const),
    ).toThrow(/Expected 2 fields but found 1/);
  });

  it("does not evaluate spreadsheet-like formulas", () => {
    const document = parse('id,narrative\nfact.one,"=1+1"\n');

    expect(
      rowsWithHeaders(document, ["id", "narrative"] as const)[0]?.values
        .narrative,
    ).toBe("=1+1");
  });

  it("serializes values with deterministic LF endings and CSV escaping", () => {
    expect(
      serializeCsv(
        ["id", "narrative"],
        [["fact.one", 'line 1,\nline "2"']],
      ),
    ).toBe('id,narrative\nfact.one,"line 1,\nline ""2"""\n');
  });
});
