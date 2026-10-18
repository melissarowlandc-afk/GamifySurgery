import { compressCloudText, decompressCloudText, type CloudCompressedText, type CloudCompression } from "./codecCompression";
import { CloudCodecError, codecObject, logicalJsonText, parseCodecJson, utf8Bytes, type CodecObject } from "./codecJson";

/** Physical-storage candidate: each accepted page is sealed forever, including a partially filled final page. */
export interface CloudEvidencePage {
  readonly firstRecord: number;
  readonly recordCount: number;
  readonly content: CloudCompressedText;
}
export const CLOUD_EVIDENCE_PAGE_TARGET_BYTES = 64_000;

/** Only NEW rows are packed; appending must start after the last accepted sealed page. */
export async function compressCloudEvidencePages(recordTexts: readonly string[], firstRecord = 0, encoding: CloudCompression = "gzip"): Promise<readonly CloudEvidencePage[]> {
  if (!Number.isSafeInteger(firstRecord) || firstRecord < 0) throw new CloudCodecError("page_shape", "Invalid immutable page high-water.");
  const pages: CloudEvidencePage[] = [];
  let current: CodecObject[] = [], size = 80, start = firstRecord;
  const seal = async () => {
    if (!current.length) return;
    const text = logicalJsonText({ formatVersion: 1, firstRecord: start, records: current });
    const content = await compressCloudText(text, encoding);
    pages.push(Object.freeze({ firstRecord: start, recordCount: current.length, content }));
    start += current.length; current = []; size = 80;
  };
  for (const [index, text] of recordTexts.entries()) {
    const value = codecObject(parseCodecJson(text), "Immutable evidence row");
    if (value.id !== `e${(firstRecord + index + 1).toString(36)}`) throw new CloudCodecError("page_order", "Page rows must retain their existing immutable IDs and order.");
    const rowBytes = utf8Bytes(logicalJsonText(value)) + 1;
    if (current.length && size + rowBytes > CLOUD_EVIDENCE_PAGE_TARGET_BYTES) await seal();
    current.push(value); size += rowBytes;
  }
  await seal();
  return Object.freeze(pages);
}

export async function decompressCloudEvidencePages(pages: readonly CloudEvidencePage[], firstRecord = 0): Promise<CodecObject[]> {
  const total = pages.reduce((sum, page) => sum + page.content.uncompressedBytes, 0);
  if (!Number.isSafeInteger(total) || total > 6_000_000) throw new CloudCodecError("evidence_size", "Aggregate decoded pages exceed the processing bound.");
  const rows: CodecObject[] = [];
  for (const page of pages) {
    if (page.firstRecord !== firstRecord + rows.length || !Number.isSafeInteger(page.recordCount) || page.recordCount < 1) throw new CloudCodecError("page_order", "Immutable pages are missing, repeated or reordered.");
    const text = await decompressCloudText(page.content), decoded = codecObject(parseCodecJson(text), "Immutable evidence page");
    if (logicalJsonText(decoded) !== text || decoded.formatVersion !== 1 || decoded.firstRecord !== page.firstRecord ||
      !Array.isArray(decoded.records) || decoded.records.length !== page.recordCount) throw new CloudCodecError("page_shape", "Decoded page differs from its canonical metadata.");
    for (const value of decoded.records) {
      const row = codecObject(value, "Page evidence row");
      if (row.id !== `e${(firstRecord + rows.length + 1).toString(36)}`) throw new CloudCodecError("page_order", "Immutable row IDs do not match page order.");
      rows.push(row);
    }
  }
  return rows;
}
