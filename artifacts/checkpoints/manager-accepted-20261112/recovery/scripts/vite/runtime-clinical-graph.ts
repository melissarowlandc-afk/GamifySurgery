/** Build-time encoding of plain runtime data. Preserve key order, undefined,
 * sparse arrays and shared references; never serialize functions or schemas. */
type Value = null | boolean | number | [number, number?];
type Row = [number, [number, Value][], number?];
export interface RuntimeClinicalGraph { strings: string[]; rows: Row[]; roots: Record<string, Value> }

export function encodeRuntimeClinicalGraph(exports: Record<string, unknown>): RuntimeClinicalGraph {
  const strings: string[] = [], rows: Row[] = [], interned = new Map<string, number>(), seen = new Map<object, number>();
  const text = (s: string) => { let i = interned.get(s); if (i === undefined) { i = strings.length; strings.push(s); interned.set(s, i); } return i; };
  const encode = (value: unknown): Value => {
    if (value === undefined) return [2];
    if (typeof value === "string") return [0, text(value)];
    if (value === null || typeof value === "boolean") return value;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) throw Error("Non-finite runtime clinical data");
      return Object.is(value, -0) ? [3] : value;
    }
    if (typeof value !== "object") throw Error("Runtime clinical exports must be plain data");
    const previous = seen.get(value); if (previous !== undefined) return [1, previous];
    const array = Array.isArray(value), prototype = Object.getPrototypeOf(value);
    if (!array && prototype !== Object.prototype && prototype !== null || Object.getOwnPropertySymbols(value).length)
      throw Error("Unsupported runtime clinical object");
    const id = rows.length, row: Row = [array ? 1 : prototype === null ? 2 : 0, []];
    if (array) row[2] = value.length;
    rows.push(row); seen.set(value, id);
    for (const key of Object.getOwnPropertyNames(value)) {
      if (array && key === "length") continue;
      const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
      if (!("value" in descriptor) || !descriptor.enumerable || !descriptor.writable || !descriptor.configurable)
        throw Error("Runtime clinical data must have ordinary data properties");
      row[1].push([text(key), encode(descriptor.value)]);
    }
    return [1, id];
  };
  return { strings, rows, roots: Object.fromEntries(Object.entries(exports).map(([name, value]) => [name, encode(value)])) };
}

/** Self-contained function: its source is also the tiny browser decoder. All
 * assembly/validation graphs become unreachable after this call returns. */
export function decodeRuntimeClinicalGraph(graph: RuntimeClinicalGraph): Record<string, unknown> {
  const values: unknown[] = graph.rows.map(row => row[0] === 1 ? new Array(row[2]) : row[0] === 2 ? Object.create(null) : {});
  const decode = (value: Value): unknown => !Array.isArray(value) ? value :
    value[0] === 0 ? graph.strings[value[1]!] : value[0] === 1 ? values[value[1]!] : value[0] === 3 ? -0 : undefined;
  graph.rows.forEach((row, id) => row[1].forEach(([key, value]) => {
    Object.defineProperty(values[id], graph.strings[key]!, { value: decode(value), enumerable: true, writable: true, configurable: true });
  }));
  return Object.fromEntries(Object.entries(graph.roots).map(([name, value]) => [name, decode(value)]));
}

export function runtimeClinicalModule(graph: RuntimeClinicalGraph, schemaPath: string): string {
  // JSON text is released by the initializer. No full authoring catalogue,
  // historical release projection or validation scratch survives in the page.
  return `const data = (${decodeRuntimeClinicalGraph.toString()})(JSON.parse(${JSON.stringify(JSON.stringify(graph))}));\n` +
    Object.keys(graph.roots).map(name => `export const ${name} = data[${JSON.stringify(name)}];`).join("\n") +
    `\nexport * from ${JSON.stringify(schemaPath)};\n`;
}
