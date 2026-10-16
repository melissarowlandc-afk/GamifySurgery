/** Minimal DOM for React reconciliation tests; geometry stays with manager Playwright QA. */
export class TestElement extends EventTarget {
  nodeType = 1;
  namespaceURI = "http://www.w3.org/1999/xhtml";
  parentNode: TestElement | null = null;
  childNodes: TestElement[] = [];
  attributes: Record<string, string> = {};
  style: Record<string, unknown> = { setProperty: (key: string, value: string) => { this.style[key] = value; } };
  value = "";
  content = "";
  private text = "";
  constructor(public tagName: string, public ownerDocument: TestDocument) { super(); this.tagName = tagName.toUpperCase(); }
  get nodeName() { return this.tagName; }
  get firstChild(): TestElement | null { return this.childNodes[0] ?? null; }
  get lastChild(): TestElement | null { return this.childNodes.at(-1) ?? null; }
  get nextSibling(): TestElement | null { const siblings = this.parentNode?.childNodes ?? []; return siblings[siblings.indexOf(this) + 1] ?? null; }
  get textContent(): string { return this.text + this.childNodes.map((child) => child.textContent).join(""); }
  set textContent(value: string) { this.text = value; this.childNodes = []; }
  get nodeValue(): string | null { return this.nodeType === 3 ? this.text : null; }
  set nodeValue(value: string | null) { if (this.nodeType === 3) this.text = value ?? ""; }
  appendChild(child: TestElement) { child.parentNode?.removeChild(child); this.childNodes.push(child); child.parentNode = this; return child; }
  insertBefore(child: TestElement, before: TestElement) { child.parentNode?.removeChild(child); this.childNodes.splice(this.childNodes.indexOf(before), 0, child); child.parentNode = this; return child; }
  removeChild(child: TestElement) { this.childNodes.splice(this.childNodes.indexOf(child), 1); child.parentNode = null; return child; }
  setAttribute(key: string, value: string) { this.attributes[key] = String(value); }
  removeAttribute(key: string) { delete this.attributes[key]; }
  setAttributeNS(_ns: string, key: string, value: string) { this.setAttribute(key, value); }
  contains(child: TestElement): boolean { return this === child || this.childNodes.some((node) => node.contains(child)); }
  focus() { this.ownerDocument.activeElement = this; }
  querySelector(): null { return null; }
  querySelectorAll(): TestElement[] { return []; }
  scrollTop = 0;
  scrollHeight = 0;
  clientHeight = 0;
  scrollTo() {}
  getBoundingClientRect() { return { x: 0, y: 0, left: 0, top: 0, right: 390, bottom: 600, width: 390, height: 600 }; }
}
export class TestDocument extends EventTarget {
  nodeType = 9;
  body = new TestElement("body", this);
  documentElement = new TestElement("html", this);
  activeElement = this.body;
  defaultView: unknown;
  createElement(name: string) { return new TestElement(name, this); }
  createElementNS(_namespace: string, name: string) { return this.createElement(name); }
  createTextNode(text: string) { const node = new TestElement("#text", this); node.nodeType = 3; node.textContent = text; return node; }
  querySelector(): null { return null; }
}
export function findTestElement(root: TestElement, predicate: (element: TestElement) => boolean): TestElement | undefined {
  if (predicate(root)) return root;
  for (const child of root.childNodes) { const found = findTestElement(child, predicate); if (found) return found; }
  return undefined;
}
export function testElementProps(element: TestElement): Record<string, unknown> {
  return Object.entries(element).find(([key]) => key.startsWith("__reactProps$"))?.[1] as Record<string, unknown> ?? {};
}
