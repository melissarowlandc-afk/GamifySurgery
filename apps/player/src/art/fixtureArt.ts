import {
  PixelCanvas,
  spriteFromMatrix,
  type PixelSpriteAsset,
} from "./pixelArt";

function generatedFixture(
  id: string,
  width: number,
  height: number,
  paint: (canvas: PixelCanvas) => void,
): PixelSpriteAsset {
  const canvas = new PixelCanvas(width, height);
  paint(canvas);
  return { id, ...canvas.frame() };
}

const DETAILED_FRONT_DESK = generatedFixture(
  "front-desk-detailed",
  48,
  22,
  (canvas) => {
    canvas.rect(3, 18, 42, 2, "shadow");
    canvas.outlineRect(1, 3, 46, 16, "charcoal");
    canvas.rect(2, 4, 44, 3, "highlight");
    canvas.rect(2, 7, 44, 11, "warmGray");
    canvas.rect(2, 16, 44, 2, "deepOlive");
    canvas.rect(5, 9, 11, 6, "paper");
    canvas.outlineRect(6, 10, 9, 4, "cream");
    canvas.rect(20, 8, 8, 8, "paper");
    canvas.outlineRect(21, 9, 6, 6, "cream");
    canvas.rect(32, 9, 11, 6, "paper");
    canvas.outlineRect(33, 10, 9, 4, "cream");
    canvas.rect(9, 11, 3, 1, "deepOlive");
    canvas.rect(23, 11, 2, 2, "deepOlive");
    canvas.rect(36, 11, 4, 1, "deepOlive");
    // Files, keyboard, drawer seams, and a small service bell make this a
    // working reception counter rather than a generic block.
    canvas.rect(17, 14, 4, 1, "ink");
    canvas.set(19, 13, "paper");
    canvas.rect(29, 14, 2, 2, "charcoal");
    canvas.set(30, 13, "highlight");
    canvas.line(4, 17, 44, 17, "charcoal");
    for (const x of [11, 24, 38]) canvas.rect(x, 18, 2, 1, "highlight");
    canvas.rect(5, 5, 8, 1, "white");
    canvas.rect(35, 5, 7, 1, "white");
    canvas.rect(5, 19, 5, 2, "ink");
    canvas.rect(38, 19, 5, 2, "ink");
  },
);

const DETAILED_WAITING_BENCH = generatedFixture(
  "waiting-bench-detailed",
  43,
  17,
  (canvas) => {
    canvas.rect(3, 14, 37, 2, "shadow");
    for (let section = 0; section < 3; section += 1) {
      const x = 2 + section * 14;
      canvas.outlineRect(x, 1, 13, 10, "olive");
      canvas.rect(x + 2, 2, 9, 2, "lightSage");
      canvas.rect(x + 2, 5, 9, 4, "moss");
      canvas.rect(x + 3, 5, 7, 1, "sage");
      canvas.rect(x + 1, 11, 12, 3, "deepOlive");
      canvas.rect(x + 3, 12, 8, 1, "olive");
    }
    canvas.rect(0, 7, 3, 6, "ink");
    canvas.rect(40, 7, 3, 6, "ink");
    canvas.rect(3, 14, 3, 2, "ink");
    canvas.rect(36, 14, 3, 2, "ink");
  },
);

/** A compact two-seat couch; deliberately leaves the surrounding walls clear. */
const DETAILED_WAITING_COUCH = generatedFixture(
  "waiting-couch-detailed",
  31,
  18,
  (canvas) => {
    canvas.rect(3, 15, 25, 2, "shadow");
    canvas.outlineRect(2, 2, 27, 10, "charcoal");
    canvas.rect(4, 3, 23, 2, "highlight");
    canvas.rect(4, 6, 11, 4, "moss");
    canvas.rect(16, 6, 11, 4, "moss");
    canvas.rect(5, 6, 9, 1, "sage");
    canvas.rect(17, 6, 9, 1, "sage");
    canvas.outlineRect(1, 10, 29, 5, "deepOlive");
    canvas.rect(3, 11, 25, 2, "lightSage");
    canvas.rect(3, 14, 4, 3, "ink");
    canvas.rect(24, 14, 4, 3, "ink");
    canvas.set(6, 17, "ink");
    canvas.set(24, 17, "ink");
    canvas.rect(15, 6, 1, 8, "deepOlive");
    canvas.set(8, 8, "highlight");
    canvas.set(23, 8, "highlight");
  },
);

const DETAILED_EXAM_TABLE = generatedFixture(
  "exam-table-detailed",
  45,
  20,
  (canvas) => {
    canvas.rect(3, 17, 39, 2, "shadow");
    canvas.outlineRect(1, 3, 43, 9, "lightSage");
    canvas.rect(3, 4, 10, 6, "highlight");
    canvas.rect(4, 5, 8, 2, "paper");
    canvas.rect(14, 4, 28, 2, "paper");
    canvas.rect(14, 6, 28, 4, "sage");
    canvas.rect(15, 6, 25, 1, "highlight");
    canvas.outlineRect(7, 12, 31, 6, "charcoal");
    canvas.rect(9, 13, 12, 4, "warmGray");
    canvas.rect(24, 13, 12, 4, "warmGray");
    canvas.rect(20, 14, 2, 2, "ink");
    canvas.rect(28, 14, 3, 1, "deepOlive");
    canvas.line(15, 8, 39, 8, "lightSage");
    canvas.rect(11, 14, 7, 1, "highlight");
    canvas.rect(31, 14, 3, 2, "paper");
    canvas.rect(8, 18, 5, 2, "ink");
    canvas.rect(32, 18, 5, 2, "ink");
  },
);

const DETAILED_TOILET = generatedFixture(
  "toilet-detailed",
  25,
  25,
  (canvas) => {
    canvas.rect(5, 22, 15, 2, "shadow");
    canvas.outlineRect(6, 1, 13, 8, "paper");
    canvas.rect(8, 2, 9, 2, "highlight");
    canvas.rect(15, 4, 2, 2, "warmGray");
    canvas.outlineRect(3, 8, 19, 13, "paper");
    canvas.ellipse(12, 13, 7, 5, "ink");
    canvas.ellipse(12, 13, 5, 3, "cream");
    canvas.ellipse(12, 13, 3, 2, "warmGray");
    canvas.rect(6, 18, 13, 3, "lightSage");
    canvas.rect(9, 21, 7, 2, "deepOlive");
    canvas.set(8, 5, "paper");
    canvas.set(16, 5, "paper");
    canvas.rect(10, 18, 4, 1, "highlight");
  },
);

const DETAILED_XRAY_SYSTEM = generatedFixture(
  "xray-system-detailed",
  45,
  38,
  (canvas) => {
    canvas.rect(6, 35, 34, 2, "shadow");
    canvas.outlineRect(3, 3, 10, 30, "charcoal");
    canvas.rect(5, 5, 6, 25, "moss");
    canvas.rect(6, 6, 2, 20, "sage");
    canvas.outlineRect(10, 4, 25, 6, "deepOlive");
    canvas.rect(12, 5, 20, 2, "lightSage");
    canvas.outlineRect(29, 8, 13, 12, "charcoal");
    canvas.ellipse(35, 14, 5, 4, "ink");
    canvas.ellipse(35, 14, 3, 2, "lightSage");
    canvas.rect(32, 20, 6, 5, "deepOlive");
    canvas.outlineRect(14, 25, 28, 8, "lightSage");
    canvas.rect(16, 26, 24, 2, "highlight");
    canvas.rect(17, 29, 22, 2, "sage");
    canvas.rect(17, 33, 5, 3, "ink");
    canvas.rect(34, 33, 5, 3, "ink");
    canvas.outlineRect(2, 31, 12, 5, "deepOlive");
    canvas.rect(4, 32, 8, 1, "highlight");
    canvas.rect(7, 12, 2, 12, "charcoal");
    canvas.set(8, 14, "paper");
    canvas.rect(19, 28, 6, 1, "paper");
    canvas.set(36, 14, "highlight");
  },
);

const DETAILED_IMAGING_CONSOLE = generatedFixture(
  "imaging-console-detailed",
  52,
  29,
  (canvas) => {
    canvas.rect(4, 26, 44, 2, "shadow");
    for (let screen = 0; screen < 2; screen += 1) {
      const x = 2 + screen * 25;
      canvas.outlineRect(x, 1, 23, 14, "charcoal");
      canvas.rect(x + 2, 3, 19, 9, "deepOlive");
      canvas.rect(x + 3, 4, 8, 2, "lightSage");
      canvas.line(x + 4, 10, x + 10, 6, "sage");
      canvas.line(x + 10, 6, x + 17, 9, "paper");
      canvas.set(x + 18, 4, "highlight");
      canvas.set(x + 18, 10, "sage");
      canvas.rect(x + 9, 15, 5, 3, "ink");
    }
    canvas.outlineRect(1, 18, 50, 8, "warmGray");
    canvas.rect(3, 19, 46, 2, "highlight");
    canvas.rect(6, 22, 17, 2, "charcoal");
    for (let key = 0; key < 7; key += 1) {
      canvas.set(7 + key * 2, 22, key % 2 === 0 ? "paper" : "sage");
    }
    canvas.outlineRect(35, 21, 11, 4, "paper");
    canvas.set(38, 22, "ink");
    canvas.set(42, 22, "deepOlive");
    for (let dial = 0; dial < 4; dial += 1) {
      canvas.set(37 + dial * 2, 24, "sage");
    }
    canvas.rect(5, 26, 5, 2, "ink");
    canvas.rect(42, 26, 5, 2, "ink");
  },
);

const DETAILED_PROCEDURE_TABLE = generatedFixture(
  "procedure-table-detailed",
  45,
  21,
  (canvas) => {
    canvas.rect(3, 18, 39, 2, "shadow");
    canvas.outlineRect(1, 2, 43, 10, "paper");
    canvas.rect(3, 3, 9, 7, "highlight");
    canvas.rect(13, 3, 29, 2, "lightSage");
    canvas.rect(13, 5, 29, 5, "sage");
    canvas.rect(14, 5, 26, 1, "paper");
    canvas.outlineRect(8, 12, 29, 6, "charcoal");
    canvas.rect(10, 13, 25, 4, "warmGray");
    canvas.rect(12, 14, 8, 2, "deepOlive");
    canvas.rect(24, 14, 9, 2, "deepOlive");
    canvas.rect(9, 18, 5, 2, "ink");
    canvas.rect(31, 18, 5, 2, "ink");
  },
);

const DETAILED_VISITOR_CHAIR = generatedFixture(
  "visitor-chair-detailed",
  19,
  19,
  (canvas) => {
    canvas.rect(3, 17, 13, 2, "shadow");
    canvas.outlineRect(3, 1, 13, 10, "charcoal");
    canvas.rect(5, 2, 9, 2, "highlight");
    canvas.rect(5, 5, 9, 5, "moss");
    canvas.rect(6, 5, 7, 1, "sage");
    canvas.outlineRect(1, 9, 17, 5, "deepOlive");
    canvas.rect(3, 10, 13, 2, "lightSage");
    canvas.rect(2, 7, 2, 8, "ink");
    canvas.rect(15, 7, 2, 8, "ink");
    canvas.rect(4, 14, 3, 4, "charcoal");
    canvas.rect(12, 14, 3, 4, "charcoal");
    canvas.set(5, 18, "ink");
    canvas.set(13, 18, "ink");
  },
);

const DETAILED_OFFICE_CHAIR = generatedFixture(
  "office-chair-detailed",
  21,
  23,
  (canvas) => {
    canvas.rect(3, 20, 15, 2, "shadow");
    canvas.outlineRect(4, 1, 13, 12, "charcoal");
    canvas.rect(6, 2, 9, 2, "lightSage");
    canvas.rect(6, 5, 9, 6, "deepOlive");
    canvas.rect(7, 5, 7, 1, "sage");
    canvas.outlineRect(2, 11, 17, 5, "charcoal");
    canvas.rect(4, 12, 13, 2, "moss");
    canvas.rect(1, 9, 2, 6, "ink");
    canvas.rect(18, 9, 2, 6, "ink");
    canvas.rect(9, 16, 3, 4, "charcoal");
    canvas.rect(4, 20, 13, 2, "ink");
    canvas.line(10, 19, 3, 22, "ink");
    canvas.line(10, 19, 17, 22, "ink");
  },
);

const DETAILED_SECRETARY_CHAIR = generatedFixture(
  "secretary-chair-detailed",
  17,
  18,
  (canvas) => {
    canvas.rect(2, 16, 13, 1, "shadow");
    canvas.outlineRect(4, 1, 9, 7, "charcoal");
    canvas.rect(6, 2, 5, 2, "lightSage");
    canvas.rect(6, 4, 5, 3, "deepOlive");
    canvas.rect(7, 4, 3, 1, "sage");
    canvas.outlineRect(3, 8, 11, 4, "charcoal");
    canvas.rect(5, 9, 7, 2, "moss");
    canvas.rect(7, 12, 3, 3, "charcoal");
    canvas.rect(6, 14, 5, 2, "ink");
    canvas.line(8, 15, 2, 17, "ink");
    canvas.line(8, 15, 14, 17, "ink");
    canvas.set(1, 17, "charcoal");
    canvas.set(15, 17, "charcoal");
    canvas.set(8, 17, "charcoal");
  },
);

const DETAILED_SINK_CABINET = generatedFixture(
  "sink-cabinet-detailed",
  38,
  23,
  (canvas) => {
    canvas.rect(3, 20, 32, 2, "shadow");
    canvas.outlineRect(1, 5, 36, 16, "charcoal");
    canvas.rect(2, 6, 34, 3, "highlight");
    canvas.rect(2, 9, 34, 11, "warmGray");
    canvas.outlineRect(4, 10, 13, 9, "paper");
    canvas.outlineRect(21, 10, 13, 9, "paper");
    canvas.rect(15, 13, 2, 2, "deepOlive");
    canvas.rect(21, 13, 2, 2, "deepOlive");
    canvas.outlineRect(11, 5, 16, 5, "paper");
    canvas.rect(13, 6, 12, 2, "highlight");
    canvas.rect(18, 1, 2, 5, "ink");
    canvas.line(19, 1, 24, 1, "ink");
    canvas.rect(23, 1, 2, 3, "ink");
    canvas.rect(5, 21, 4, 2, "ink");
    canvas.rect(29, 21, 4, 2, "ink");
  },
);

/** Small wall-mounted glove box used only as world-north wall decor. */
const DETAILED_GLOVE_DISPENSER = generatedFixture(
  "glove-dispenser-detailed",
  16,
  12,
  (canvas) => {
    canvas.outlineRect(1, 1, 14, 9, "paper");
    canvas.rect(3, 3, 10, 2, "highlight");
    canvas.rect(4, 6, 8, 2, "lightSage");
    canvas.rect(6, 9, 4, 2, "sage");
    canvas.rect(5, 11, 2, 1, "paper");
    canvas.rect(9, 11, 2, 1, "paper");
  },
);

const DETAILED_XRAY_BUCKY = generatedFixture(
  "xray-bucky-detailed",
  24,
  35,
  (canvas) => {
    canvas.rect(3, 32, 18, 2, "shadow");
    canvas.outlineRect(3, 1, 18, 23, "charcoal");
    canvas.rect(5, 3, 14, 18, "deepOlive");
    canvas.rect(7, 5, 10, 13, "lightSage");
    canvas.outlineRect(8, 6, 8, 11, "sage");
    canvas.rect(10, 8, 4, 7, "paper");
    canvas.rect(11, 9, 2, 5, "highlight");
    canvas.rect(10, 24, 4, 6, "charcoal");
    canvas.outlineRect(4, 29, 16, 4, "deepOlive");
    canvas.rect(6, 30, 12, 1, "highlight");
    canvas.rect(3, 33, 5, 2, "ink");
    canvas.rect(16, 33, 5, 2, "ink");
  },
);

const DETAILED_SUPPLY_CABINET = generatedFixture(
  "supply-cabinet-detailed",
  33,
  30,
  (canvas) => {
    canvas.rect(3, 27, 27, 2, "shadow");
    canvas.outlineRect(1, 1, 31, 27, "charcoal");
    canvas.rect(3, 3, 13, 11, "paper");
    canvas.rect(17, 3, 13, 11, "paper");
    canvas.rect(3, 15, 13, 11, "warmGray");
    canvas.rect(17, 15, 13, 11, "warmGray");
    canvas.rect(4, 4, 11, 2, "highlight");
    canvas.rect(18, 4, 11, 2, "highlight");
    canvas.rect(14, 8, 2, 3, "deepOlive");
    canvas.rect(17, 8, 2, 3, "deepOlive");
    canvas.rect(14, 19, 2, 3, "deepOlive");
    canvas.rect(17, 19, 2, 3, "deepOlive");
    canvas.rect(5, 17, 7, 2, "sage");
    canvas.rect(20, 17, 6, 2, "lightSage");
    canvas.rect(3, 28, 5, 2, "ink");
    canvas.rect(25, 28, 5, 2, "ink");
  },
);

const DETAILED_PROCEDURE_LIGHT = generatedFixture(
  "procedure-light-detailed",
  29,
  32,
  (canvas) => {
    canvas.ellipse(14, 7, 12, 6, "ink");
    canvas.ellipse(14, 7, 10, 5, "lightSage");
    canvas.ellipse(14, 7, 7, 3, "paper");
    canvas.ellipse(14, 7, 3, 2, "highlight");
    for (const x of [9, 14, 19]) {
      canvas.set(x, 6, "deepOlive");
      canvas.set(x, 8, "deepOlive");
    }
    canvas.rect(13, 13, 3, 12, "charcoal");
    canvas.line(14, 14, 22, 19, "ink");
    canvas.rect(21, 18, 3, 8, "charcoal");
    canvas.outlineRect(9, 25, 11, 4, "deepOlive");
    canvas.rect(11, 29, 3, 3, "ink");
    canvas.rect(16, 29, 3, 3, "ink");
  },
);

const DETAILED_INSTRUMENT_TRAY = generatedFixture(
  "instrument-tray-detailed",
  31,
  22,
  (canvas) => {
    canvas.rect(3, 19, 25, 2, "shadow");
    canvas.outlineRect(1, 1, 29, 9, "paper");
    canvas.rect(3, 3, 25, 4, "highlight");
    canvas.line(5, 5, 13, 5, "charcoal");
    canvas.line(16, 4, 24, 7, "deepOlive");
    canvas.rect(6, 7, 4, 1, "sage");
    canvas.rect(13, 10, 3, 8, "charcoal");
    canvas.rect(4, 17, 23, 2, "ink");
    canvas.line(14, 18, 5, 21, "ink");
    canvas.line(15, 18, 25, 21, "ink");
  },
);

const DETAILED_SERVER_RACK = generatedFixture(
  "server-rack-detailed",
  24,
  34,
  (canvas) => {
    canvas.rect(3, 31, 18, 2, "shadow");
    canvas.outlineRect(1, 1, 22, 31, "charcoal");
    canvas.rect(3, 3, 18, 27, "deepOlive");
    for (let row = 0; row < 5; row += 1) {
      const y = 4 + row * 5;
      canvas.outlineRect(4, y, 16, 4, "moss");
      canvas.rect(6, y + 1, 7, 1, "lightSage");
      canvas.set(16, y + 1, row % 2 === 0 ? "highlight" : "sage");
      canvas.set(18, y + 1, "paper");
    }
    canvas.rect(4, 30, 5, 3, "ink");
    canvas.rect(15, 30, 5, 3, "ink");
  },
);

const DETAILED_WATER_COOLER = generatedFixture(
  "water-cooler-detailed",
  21,
  31,
  (canvas) => {
    canvas.rect(3, 28, 15, 2, "shadow");
    canvas.outlineRect(5, 1, 11, 13, "charcoal");
    canvas.rect(7, 2, 7, 2, "highlight");
    canvas.rect(7, 4, 7, 8, "lightSage");
    canvas.rect(8, 5, 5, 5, "paper");
    canvas.outlineRect(2, 13, 17, 15, "warmGray");
    canvas.rect(4, 14, 13, 3, "highlight");
    canvas.outlineRect(5, 18, 11, 5, "deepOlive");
    canvas.rect(7, 19, 7, 2, "paper");
    canvas.rect(6, 15, 2, 3, "ink");
    canvas.rect(13, 15, 2, 3, "ink");
    canvas.rect(4, 28, 4, 3, "ink");
    canvas.rect(13, 28, 4, 3, "ink");
  },
);

const VITALS_MONITOR = generatedFixture(
  "vitals-monitor",
  29,
  27,
  (canvas) => {
    canvas.rect(3, 24, 23, 2, "shadow");
    canvas.outlineRect(2, 1, 25, 15, "charcoal");
    canvas.rect(4, 3, 21, 10, "deepOlive");
    canvas.line(5, 9, 10, 9, "sage");
    canvas.line(10, 9, 13, 5, "highlight");
    canvas.line(13, 5, 16, 11, "lightSage");
    canvas.line(16, 11, 20, 7, "highlight");
    canvas.line(20, 7, 24, 8, "sage");
    canvas.rect(5, 14, 3, 1, "paper");
    canvas.rect(10, 14, 3, 1, "sage");
    canvas.rect(15, 14, 3, 1, "lightSage");
    canvas.rect(13, 16, 3, 7, "charcoal");
    canvas.outlineRect(7, 22, 15, 3, "deepOlive");
    canvas.line(14, 24, 5, 26, "ink");
    canvas.line(14, 24, 24, 26, "ink");
  },
);

const ROLLING_CART = generatedFixture(
  "rolling-cart",
  28,
  23,
  (canvas) => {
    canvas.rect(3, 20, 22, 2, "shadow");
    canvas.outlineRect(2, 2, 24, 16, "charcoal");
    canvas.rect(4, 4, 20, 3, "highlight");
    canvas.rect(4, 8, 20, 4, "warmGray");
    canvas.rect(4, 13, 20, 3, "paper");
    canvas.rect(6, 9, 5, 2, "sage");
    canvas.rect(14, 9, 7, 2, "lightSage");
    canvas.rect(13, 14, 2, 2, "deepOlive");
    canvas.rect(5, 18, 3, 4, "charcoal");
    canvas.rect(20, 18, 3, 4, "charcoal");
    canvas.set(6, 22, "ink");
    canvas.set(21, 22, "ink");
  },
);

// Level 2 equipment remains constructed from the shared low-chroma pixel
// palette so it can be layered with the existing dollhouse fixtures.
const ULTRASOUND_CONSOLE = generatedFixture("ultrasound-console", 34, 30, (canvas) => {
  canvas.rect(4, 27, 26, 2, "shadow");
  canvas.outlineRect(8, 1, 18, 12, "charcoal");
  canvas.rect(10, 3, 14, 7, "deepOlive");
  canvas.line(11, 8, 17, 5, "lightSage");
  canvas.line(17, 5, 23, 9, "paper");
  canvas.rect(15, 13, 4, 5, "charcoal");
  canvas.outlineRect(5, 18, 24, 8, "warmGray");
  canvas.rect(8, 20, 11, 2, "paper");
  canvas.rect(21, 19, 5, 5, "lightSage");
  canvas.rect(7, 25, 3, 4, "charcoal");
  canvas.rect(24, 25, 3, 4, "charcoal");
  canvas.line(27, 21, 32, 25, "ink");
});

const CT_GANTRY = generatedFixture("ct-gantry", 48, 34, (canvas) => {
  canvas.rect(5, 31, 38, 2, "shadow");
  canvas.ellipse(18, 15, 15, 14, "charcoal");
  canvas.ellipse(18, 15, 12, 11, "paper");
  canvas.ellipse(18, 15, 7, 7, "deepOlive");
  canvas.ellipse(18, 15, 4, 4, "warmGray");
  canvas.rect(4, 24, 7, 7, "charcoal");
  canvas.rect(25, 24, 7, 7, "charcoal");
  canvas.outlineRect(25, 18, 21, 7, "lightSage");
  canvas.rect(28, 19, 16, 2, "paper");
  canvas.rect(39, 24, 4, 7, "ink");
});

const PHLEBOTOMY_CHAIR = generatedFixture("phlebotomy-chair", 28, 28, (canvas) => {
  canvas.rect(3, 25, 22, 2, "shadow");
  canvas.outlineRect(7, 2, 14, 11, "charcoal");
  canvas.rect(9, 4, 10, 7, "moss");
  canvas.outlineRect(4, 12, 20, 6, "deepOlive");
  canvas.rect(6, 13, 16, 3, "lightSage");
  canvas.rect(11, 18, 4, 6, "charcoal");
  canvas.line(13, 23, 4, 26, "ink");
  canvas.line(13, 23, 23, 26, "ink");
  canvas.rect(22, 8, 5, 3, "warmGray");
});

const TUBE_RACK = generatedFixture("tube-rack", 27, 16, (canvas) => {
  canvas.rect(2, 13, 23, 2, "shadow");
  canvas.outlineRect(3, 8, 21, 5, "warmGray");
  for (const x of [6, 11, 16, 21]) {
    canvas.rect(x, 1, 2, 8, "paper");
    canvas.set(x, 1, "highlight");
  }
  canvas.rect(5, 10, 17, 1, "deepOlive");
});

const MOP_CART = generatedFixture("mop-cart", 31, 29, (canvas) => {
  canvas.rect(3, 26, 25, 2, "shadow");
  canvas.outlineRect(5, 14, 20, 10, "charcoal");
  canvas.rect(7, 16, 16, 6, "warmGray");
  canvas.rect(9, 18, 6, 2, "sage");
  canvas.rect(18, 16, 3, 6, "lightSage");
  canvas.line(9, 14, 4, 2, "ink");
  canvas.line(14, 14, 11, 1, "ink");
  canvas.line(20, 14, 20, 1, "ink");
  canvas.rect(6, 24, 3, 4, "charcoal");
  canvas.rect(21, 24, 3, 4, "charcoal");
  canvas.rect(2, 1, 3, 17, "deepOlive");
});

const ENDOSCOPY_TOWER = generatedFixture("endoscopy-tower", 31, 39, (canvas) => {
  canvas.rect(3, 36, 25, 2, "shadow");
  canvas.outlineRect(4, 2, 22, 16, "charcoal");
  canvas.rect(6, 4, 18, 10, "deepOlive");
  canvas.line(8, 11, 13, 7, "lightSage");
  canvas.line(13, 7, 21, 11, "paper");
  canvas.rect(13, 18, 4, 4, "charcoal");
  canvas.outlineRect(5, 22, 20, 12, "warmGray");
  canvas.rect(8, 24, 14, 2, "paper");
  canvas.rect(8, 28, 14, 2, "deepOlive");
  canvas.rect(7, 34, 3, 4, "charcoal");
  canvas.rect(20, 34, 3, 4, "charcoal");
});

const TRAINING_TABLE = generatedFixture("training-table", 42, 23, (canvas) => {
  canvas.rect(3, 20, 36, 2, "shadow");
  canvas.outlineRect(2, 5, 38, 10, "charcoal");
  canvas.rect(4, 7, 34, 6, "warmGray");
  canvas.rect(6, 8, 30, 1, "highlight");
  canvas.rect(7, 15, 4, 6, "charcoal");
  canvas.rect(31, 15, 4, 6, "charcoal");
  canvas.rect(1, 11, 4, 7, "moss");
  canvas.rect(37, 11, 4, 7, "moss");
});

const COFFEE_MACHINE = generatedFixture("coffee-machine", 26, 28, (canvas) => {
  canvas.rect(3, 25, 20, 2, "shadow");
  canvas.outlineRect(4, 2, 18, 22, "charcoal");
  canvas.rect(6, 4, 14, 5, "deepOlive");
  canvas.rect(8, 5, 10, 2, "lightSage");
  canvas.outlineRect(8, 11, 10, 7, "warmGray");
  canvas.rect(11, 18, 5, 4, "paper");
  canvas.rect(6, 22, 3, 4, "charcoal");
  canvas.rect(17, 22, 3, 4, "charcoal");
});

const RING_LIGHT = generatedFixture("ring-light", 24, 34, (canvas) => {
  canvas.rect(3, 31, 18, 2, "shadow");
  canvas.ellipse(12, 7, 8, 7, "charcoal");
  canvas.ellipse(12, 7, 5, 4, "paper");
  canvas.rect(11, 14, 3, 14, "charcoal");
  canvas.outlineRect(8, 18, 8, 7, "deepOlive");
  canvas.rect(10, 19, 4, 4, "lightSage");
  canvas.line(12, 27, 4, 32, "ink");
  canvas.line(12, 27, 20, 32, "ink");
});

const BASE_FIXTURES = {
  frontDesk: spriteFromMatrix("front-desk", [
    "    IIIIIIIIIIIIIIIIII    ",
    "   IHHHHHHHHHHHHHHHHHHI   ",
    "  IDDDDDDDDDDDDDDDDDDDDI  ",
    " IDOOOOOOOOOOOOOOOOOOOOODI ",
    "IDOOOOOOOODDDDOOOOOOOOOOODI",
    "IDOOOOOOOODIIDOOGGOOOOOOODI",
    "IDOOOOOOOODDDDOOGGOOOOOOODI",
    "IDDDDDDDDDDDDDDDDDDDDDDDDI",
    "IICCCCCCCCCCCCCCCCCCCCCCCCII",
    "ICCDDDDDICIDDDDDICIDDDDDCCI",
    " IIIIIIIIIIIIIIIIIIIIIIIIII ",
    "   II        II        II   ",
  ]),
  deskTerminal: spriteFromMatrix("desk-terminal", [
    "   IIIIIIIIIII   ",
    "  ICCCCCCCCCCCI  ",
    " ICSSSSSSSSSSSCI ",
    "ICSSHHHHHHHHSSSCI",
    "ICSSHDDDDDDHSSSCI",
    "ICSSHDIDIDIDSSSCI",
    "ICSSHHHHHHHHSSSCI",
    " ICSSSSSSSSSSSCI ",
    "  ICCCCCCCCCCCI  ",
    "   IIIIIIIIIII   ",
    "       III       ",
    "     IIIIIII     ",
    "   IIIIIIIIIII   ",
  ]),
  officeChair: spriteFromMatrix("office-chair", [
    "    IIIIIII    ",
    "   ICCCCCCCI   ",
    "  ICCDDDDDCCI  ",
    " ICCDDDDDDDCCI ",
    " ICCDDDDDDDCCI ",
    "  ICCDDDDDCCI  ",
    "   ICCCCCCCI   ",
    "    IIIIIII    ",
    "      III      ",
    "   IIIIIIIII   ",
    " II   III   II ",
    "II     I     II",
  ]),
  visitorChair: spriteFromMatrix("visitor-chair", [
    "  IIIIIIIII  ",
    " IDDDDDDDDDI ",
    "IDDOOOOOOODDI",
    "IDDOOOOOOODDI",
    "IDDGGGGGGGDDI",
    " IIIIIIIIIII ",
    " II       II ",
    " II       II ",
    "III       III",
  ]),
  waitingBench: spriteFromMatrix("waiting-bench", [
    "  IIIIIIIIIIIIIIIIIIIIII  ",
    " IDDDDDDDDDDDDDDDDDDDDDDI ",
    "IDDOOOOODDOOOOOODDOOOOOODDI",
    "IDDOOOOODDOOOOOODDOOOOOODDI",
    "IDDGGGGGDDGGGGGGGDDGGGGGDDI",
    "IDDDDDDDDDDDDDDDDDDDDDDDDI",
    " IIIIIIIIIIIIIIIIIIIIIIIII ",
    "  II        II        II   ",
    " III        II        III  ",
  ]),
  coffeeTable: spriteFromMatrix("coffee-table", [
    "  IIIIIIIIIIIII  ",
    " IDDDDDDDDDDDDDI ",
    "IDOGGGGGGGGGGGODI",
    "IDOGPPPGGGGGGGODI",
    "IDOGPIPGRRRGGGODI",
    "IDOGPPPGIRIGGGODI",
    "IDOGGGGGGRRRGGGODI",
    "IDDDDDDDDDDDDDDDI",
    " IIIIIIIIIIIIIII ",
    "  II         II  ",
    " III         III ",
  ]),
  plant: spriteFromMatrix("plant", [
    "    OO OO    ",
    "  OOSSOOSSO  ",
    " OOSSSSSSSSO ",
    "   OSSSSSO   ",
    "     OO      ",
    "    IOOI     ",
    "   IDDDDI    ",
    "   IDDDDI    ",
    "    IIII     ",
  ]),
  waterCooler: spriteFromMatrix("water-cooler", [
    "    IIIIIIII    ",
    "   ILLLLLLLLI   ",
    "  ILSSSSSSSSLI  ",
    "  ILSSHHHHSSLI  ",
    "  ILSSHLLHSSLI  ",
    "  ILSSSSSSSSLI  ",
    "   ILLLLLLLLI   ",
    "    ICCCCCCI    ",
    "   ICCCCCCCCI   ",
    "  ICCCDCCDCCCI  ",
    "  ICCCIHICCCCI  ",
    "  ICCCCCCCCCCI  ",
    "   II      II   ",
    "  III      III  ",
  ]),
  filingCabinet: spriteFromMatrix("filing-cabinet", [
    "  IIIIIIIIIII  ",
    " ICCCCCCCCCCCI ",
    "ICCCCCCCCCCCCCI",
    "ICDDDDDDDDDDDCI",
    "ICDDDIIIIIDDDCI",
    "ICDDDDDDDDDDDCI",
    "ICCCCCCCCCCCCCI",
    "ICDDDDDDDDDDDCI",
    "ICDDDIIIIIDDDCI",
    "ICDDDDDDDDDDDCI",
    "ICCCCCCCCCCCCCI",
    " IIIIIIIIIIIII ",
    " II         II ",
  ]),
  magazineRack: spriteFromMatrix("magazine-rack", [
    " IIIIIII ",
    "IDPPGGDI",
    "IDRPGPDI",
    "IDPGRPDI",
    "IDGGPPDI",
    "IDDDDDDI",
    " II   II ",
  ]),
  examTable: spriteFromMatrix("exam-table", [
    "    IIIIIIIIIIIIIIIIIII    ",
    "   ILLLLLLLLLLLLLLLLLLLI   ",
    "  ILLHHHHHHLLLLLLLLLLLLLI  ",
    " ILLHHHHHHHSSSSSSSSSSSSLLI ",
    " ILLHHHHHHHSSSSSSSSSSSSLLI ",
    " ILLGGGGGGGSSSSSSSSSSSSLLI ",
    "  ILLLLLLLLLLLLLLLLLLLLLI  ",
    "   IIIIIIIIIIIIIIIIIIIII   ",
    "      II          II       ",
    "     IDDI        IDDI      ",
    "    IIIIII      IIIIII     ",
  ]),
  examStep: spriteFromMatrix("exam-step", [
    " IIIIIII ",
    "IDDDDDDI",
    "IDOOOOODI",
    "IIIIIIIII",
    " II   II ",
  ]),
  sinkCabinet: spriteFromMatrix("sink-cabinet", [
    "   II   II   ",
    "  IIIIIIIII  ",
    " IIIIIIIIIIIIIIIII ",
    "ICCCCCCCCCCCCCCCCCCI",
    "ICCCCHHHHHHCCCCCCCCI",
    "ICCCCHIIIHICCCCCCCCI",
    "ICCCCHHHHHHCCCCCCCCI",
    "ICCCCCCCCCCCCCCCCCCI",
    "ICDDDDDDICIDDDDDDDCI",
    "ICDDDDIDICIDIDDDDDCI",
    "ICDDDDDDICIDDDDDDDCI",
    "ICCCCCCCCCCCCCCCCCCI",
    "IIIIIIIIIIIIIIIIIIII",
  ]),
  wallChart: spriteFromMatrix("wall-chart", [
    " IIIIIIIII ",
    "IRRRRRRRRI",
    "IRICICIRRI",
    "IRRRIRRRRI",
    "IRICICIRRI",
    "IRRRIRRRRI",
    "IRRRRRRRRI",
    " IIIIIIIII ",
  ]),
  rollingStool: spriteFromMatrix("rolling-stool", [
    "  IIIIII  ",
    " IDDDDDDI ",
    " IDOOOOOI ",
    "  IIIIII  ",
    "    II    ",
    " IIIIIIII ",
    "II  II  II",
  ]),
  toilet: spriteFromMatrix("toilet", [
    "    IIIIIIIII    ",
    "   IRRRRRRRRRI   ",
    "   IRRHHHHHRRI   ",
    "   IRRHIIHHRRI   ",
    "    IIIIIIIII    ",
    "  IIIIIIIIIIIII  ",
    " IRRRRRRRRRRRRRI ",
    "IRRRIIIIIIIIIRRRI",
    "IRRRI       IRRRI",
    "IRRRI       IRRRI",
    " IRRRRRRRRRRRRRI ",
    "  IIIIIIIIIIIII  ",
    "     IRRRRI      ",
    "     IIIIII      ",
  ]),
  handSink: spriteFromMatrix("hand-sink", [
    "   II II   ",
    "   IIIII   ",
    " IIIIIIIII ",
    "IRRRRRRRRRI",
    "IRRHHHHHRRI",
    "IRRRRRRRRRI",
    " IIIIIIIII ",
    "    III    ",
    "   IIIII   ",
  ]),
  towelDispenser: spriteFromMatrix("towel-dispenser", [
    " IIIIIII ",
    "ICCCCCCCI",
    "ICGGGGGCI",
    "ICGGGGGCI",
    "ICCCCCCCI",
    " IIIIIII ",
    "   RRR   ",
  ]),
  xrayTube: spriteFromMatrix("xray-tube", [
    "       IIIIIIIII       ",
    "      IDDDDDDDDDI      ",
    "     IDDOOOOOOODDI     ",
    "     IDDOOHHOOODDI     ",
    "      IDDDDDDDDDI      ",
    "       IIIIIIIII       ",
    "          III          ",
    "          III          ",
    "    IIIIIIIIIIIIIII    ",
    "   IDDDDDDDDDDDDDDDI   ",
    "  IDDOOOOIIIIIOOOOODDI  ",
    " IDDOOOOICCCCCIOOOOODDI ",
    " IDDOOOICSSSSSSICIOOODDI ",
    " IDDOOOICSHHHSCICIOOODDI ",
    " IDDOOOICSSSSSSICIOOODDI ",
    " IDDOOOOICCCCCIOOOOODDI ",
    "  IDDDDDDDDDDDDDDDDDDI  ",
    "   IIIIIIIIIIIIIIIIIII   ",
    "       II       II      ",
    "      IDI       IDI     ",
    "    IIIII     IIIII     ",
  ]),
  xrayTable: spriteFromMatrix("xray-table", [
    "  IIIIIIIIIIIIIIIIIIII  ",
    " ILLLLLLLLLLLLLLLLLLLLI ",
    "ILLHHHLLLLLLLLLLLLLLLLLI",
    "ILLSSSSSSSSSSSSSSSSSSLI",
    "ILLSSSSSSSSSSSSSSSSSSLI",
    " ILLLLLLLLLLLLLLLLLLLLI ",
    "  IIIIIIIIIIIIIIIIIIII  ",
    "     II          II     ",
    "    IDDI        IDDI    ",
    "   IIIIII      IIIIII   ",
  ]),
  leadApron: spriteFromMatrix("lead-apron", [
    "  IIIII  ",
    " IIDDDII ",
    "IDDDDDDDI",
    "IDDDDDDDI",
    "IDDDDDDDI",
    "IDDDDDDDI",
    "IDDDDDDDI",
    " II   II ",
  ]),
  imagingConsole: spriteFromMatrix("imaging-console", [
    "   IIIIIIIIII    IIIIIIIIII   ",
    "  ICCCCCCCCCCI  ICCCCCCCCCCI  ",
    " ICSSSSSSSSSSCIICSSSSSSSSSSCI ",
    "ICSSHHHHHHHSSCIICSSSHHHHHHSSCI",
    "ICSSHDDDDDHSSCIICSSHDIDIDHSSCI",
    "ICSSHDIDIDHSSCIICSSHHHHHHHSSCI",
    "ICSSHHHHHHHSSCIICSSSSSSSSSSSCI",
    " ICSSSSSSSSSSCIICSSSSSSSSSSCI ",
    "  ICCCCCCCCCCI  ICCCCCCCCCCI  ",
    "   IIIIIIIIII    IIIIIIIIII   ",
    "          IIIIIIIIII          ",
    "  IIIIIIIIIIIIIIIIIIIIIIIIII  ",
    " IDDDDDDDDDDDDDDDDDDDDDDDDDI ",
    "IDDDIIIDIIIDIIIDIIIDIIIDDDDDDDI",
    " IDDDDDDDDDDDDDDDDDDDDDDDDDI ",
    "  IIIIIIIIIIIIIIIIIIIIIIIIII  ",
    "    II                  II    ",
    "   IIII                IIII   ",
  ]),
  lightBox: spriteFromMatrix("light-box", [
    " IIIIIIIIIII ",
    "IRRRRRRRRRRRI",
    "IRRCCCRCCCRRI",
    "IRRCRCRCRCRRI",
    "IRRCCCRCCCRRI",
    "IRRRRRRRRRRRI",
    " IIIIIIIIIII ",
  ]),
  procedureTable: spriteFromMatrix("procedure-table", [
    "    IIIIIIIIIIIIIIIIIII    ",
    "   ICCCCCCCCCCCCCCCCCCCI   ",
    "  ICCLLLLLLLLLLLLLLLLLCCI  ",
    " ICCLLLHHHLLLLLLLLLLLLLCCI ",
    " ICCLLLHHHLLLLLLLLLLLLLCCI ",
    " ICCLLLLLLLLLLLLLLLLLLLCCI ",
    "  ICCCCCCCCCCCCCCCCCCCI   ",
    "   IIIIIIIIIIIIIIIIIII    ",
    "        IIIIIIIII         ",
    "       IDDDDDDDDI         ",
    "      IDDDDDDDDDDI        ",
    "     IIII     IIII        ",
  ]),
  instrumentTray: spriteFromMatrix("instrument-tray", [
    "  IIIIIIIIIIIIII  ",
    " IRRRRRRRRRRRRRRI ",
    "IRRIIIIIIIIIIIIRRI",
    "IRRICIIICIIICIIRRI",
    "IRRIIICIICIIICIRRI",
    "IRRRIIIIIIIIIRRRRI",
    " IIIIIIIIIIIIIIII ",
    "       III        ",
    "      IDDDI       ",
    "   IIIIIIIIIII    ",
    "  II    II    II  ",
  ]),
  procedureLight: spriteFromMatrix("procedure-light", [
    "    IIIIIIIIIII    ",
    "   ILLLLLLLLLLLI   ",
    "  ILLLHHHHHHHLLLI  ",
    " ILLLHHHIIIHHHLLLI ",
    "ILLLHHHIIIIIHHHLLLI",
    " ILLLHHHIIIHHHLLLI ",
    "  ILLLHHHHHHHLLLI  ",
    "   ILLLLLLLLLLLI   ",
    "    IIIIIIIIIII    ",
    "         III       ",
    "         III       ",
    "        IDDI       ",
    "        IDDI       ",
    "       IIIII       ",
  ]),
  supplyCabinet: spriteFromMatrix("supply-cabinet", [
    "  IIIIIIIIIIIIIII  ",
    " ICCCCCCCCCCCCCCCI ",
    "ICCCCCCCCCCCCCCCCCI",
    "ICGGGGGICIGGGGGGGCI",
    "ICGPGPGICIGPGPGGGCI",
    "ICGGGGGICIGGGGGGGCI",
    "ICCCCCCCCCCCCCCCCCI",
    "ICPPPPPIPIPPPPPPPPI",
    "ICPIPPPIPIPPPIPPPPI",
    "ICPPPPPIPIPPPPPPPPI",
    "ICCCCCCCCCCCCCCCCCI",
    " IIIIIIIIIIIIIIIII ",
    " II             II ",
  ]),
  biohazardBin: spriteFromMatrix("biohazard-bin", [
    " IIIIIII ",
    "ICCCCCCCI",
    "ICDDDDDCI",
    "ICDIIDDCI",
    "ICDIDIDCI",
    "ICDDIDDCI",
    "ICCCCCCCI",
    " IIIIIII ",
  ]),
  wallWindow: spriteFromMatrix("wall-window", [
    " IIIIIIIIIIIIIIIIIII ",
    "IDDDDDDDDDDDDDDDDDDI",
    "IDSSSSSSSIDSSSSSSSSDI",
    "IDSHHHHSSIDSHHHHHSSDI",
    "IDSSSSSSSIDSSSSSSSSDI",
    "IDDDDDDDDDDDDDDDDDDI",
    " IIIIIIIIIIIIIIIIIII ",
    "  GGGGGGGGGGGGGGGGG  ",
  ]),
  framedPrint: spriteFromMatrix("framed-print", [
    " IIIIIIIII ",
    "IDDDDDDDDI",
    "IDRRGGRRDI",
    "IDRGIIGRDI",
    "IDRGRRGRDI",
    "IDRRRRRRDI",
    "IDDDDDDDDI",
    " IIIIIIIII ",
  ]),
  noticeBoard: spriteFromMatrix("notice-board", [
    " IIIIIIIIIIIIIII ",
    "IDDDDDDDDDDDDDDI",
    "IDPRRPGGPRRPPGDI",
    "IDPIIPGGPIIPPGDI",
    "IDPPPPGGPPPPPGDI",
    "IDGGPRRPGGPRRPGDI",
    "IDDDDDDDDDDDDDDI",
    " IIIIIIIIIIIIIII ",
  ]),
  medicalSign: spriteFromMatrix("medical-sign", [
    " IIIIIIIIIII ",
    "IRRRRRRRRRRI",
    "IRRRIIIRRRRI",
    "IRRRIIIRRRRI",
    "IRIIIIIIIIIRI",
    "IRRRIIIRRRRI",
    "IRRRIIIRRRRI",
    "IRRRRRRRRRRI",
    " IIIIIIIIIII ",
  ]),
  deskPhone: spriteFromMatrix("desk-phone", [
    " IIIIIII ",
    "IDDDDDDI",
    " IDDDDI ",
    "IIIIIIIII",
    "ICDIDIDCI",
    "ICIIIIIIICI",
    " IIIIIII ",
  ]),
  chartStack: spriteFromMatrix("chart-stack", [
    "  IIIIIIIII ",
    " IRRRRRRRRI ",
    "IRRRRIIIRRI",
    " IIIIIIIIII ",
    "IPPPPPPPPPI",
    "IIIIIIIIIII",
  ]),
  floorRug: spriteFromMatrix("floor-rug", [
    " IIIIIIIIIIIIIIIIIIIIII ",
    "IDDDDDDDDDDDDDDDDDDDDDI",
    "IDOGOGOGOGOGOGOGOGOGOODI",
    "IDGOOOOOOOOOOOOOOOOOGODI",
    "IDOGODDDDDDDDDDDDGOGOODI",
    "IDGOODOOOOOOOOOOODDOGODI",
    "IDOGODDDDDDDDDDDDGOGOODI",
    "IDGOOOOOOOOOOOOOOOOOGODI",
    "IDOGOGOGOGOGOGOGOGOGOODI",
    "IDDDDDDDDDDDDDDDDDDDDDI",
    " IIIIIIIIIIIIIIIIIIIIII ",
  ]),
  sideTable: spriteFromMatrix("side-table", [
    "  IIIIIIIII  ",
    " IDDDDDDDDDI ",
    "IDOGGGGGGGODI",
    "IDOGGIRGGGODI",
    "IDOGGRRRGGODI",
    " IDDDDDDDDDI ",
    "  IIIIIIIII  ",
    "   II   II   ",
    "  III   III  ",
  ]),
  diagnosticPanel: spriteFromMatrix("diagnostic-panel", [
    " IIIIIIIIIIIII ",
    "ICCCCCCCCCCCCCI",
    "ICGIIIGGIIIGGCI",
    "ICGIRIGGIRIGGCI",
    "ICGIIIGGIIIGGCI",
    "ICGGGGGGGGGGGCI",
    "ICDDIDDDIDDDDCCI",
    " IIIIIIIIIIIIII ",
  ]),
  examScale: spriteFromMatrix("exam-scale", [
    "  IIIIIIII  ",
    " ICCCCCCCI  ",
    "ICSSHHSSCCI",
    "ICSSIISSSCCI",
    " ICCCCCCCI  ",
    "    III     ",
    "    III     ",
    " IIIIIIIII  ",
    "IDDDDDDDDI ",
    "IDOOOOOODI ",
    " IIIIIIIII ",
    " II     II ",
  ]),
  wallMirror: spriteFromMatrix("wall-mirror", [
    " IIIIIIIIIII ",
    "IDDDDDDDDDDI",
    "IDSHHHHHHSDI",
    "IDSHSSSSSHSDI",
    "IDSSSSSSSSDI",
    "IDSSHHHSSSDI",
    "IDSSSSSSSSDI",
    "IDDDDDDDDDDI",
    " IIIIIIIIIII ",
  ]),
  grabBar: spriteFromMatrix("grab-bar", [
    " II          II ",
    " IIIIIIIIIIIIII ",
    " IDDDDDDDDDDDI ",
    " IIIIIIIIIIIIII ",
    " II          II ",
  ]),
  bathMat: spriteFromMatrix("bath-mat", [
    " IIIIIIIIIIIII ",
    "IDDDDDDDDDDDDI",
    "IDOGOGOGOGOGODI",
    "IDGOOOOOOOOGODI",
    "IDOGOGOGOGOGODI",
    "IDDDDDDDDDDDDI",
    " IIIIIIIIIIIII ",
  ]),
  xrayBucky: spriteFromMatrix("xray-bucky", [
    "   IIIIIIIII   ",
    "  IDDDDDDDDDI  ",
    " IDOOOOOOOOODI ",
    "IDOOCCCCCCCOODI",
    "IDOOCSSSSSCOODI",
    "IDOOCSHHHSCOODI",
    "IDOOCSSSSSCOODI",
    "IDOOCCCCCCCOODI",
    " IDOOOOOOOOODI ",
    "  IDDDDDDDDDI  ",
    "   IIIIIIIII   ",
    "      III      ",
    "      III      ",
    "    IIIIIII    ",
    "   II     II   ",
  ]),
  radiationMarker: spriteFromMatrix("radiation-marker", [
    "    III    ",
    "  IIIDIII  ",
    " IDDDIDDDI ",
    "IDDIIDIDDDI",
    "IDDDIIIDDDI",
    " IDDDIDDDI ",
    "  IIIDIII  ",
    "    III    ",
  ]),
  serverRack: spriteFromMatrix("server-rack", [
    " IIIIIIIIIII ",
    "ICCCCCCCCCCCI",
    "ICDIIIIIIIDCI",
    "ICDIDIDIDIDCI",
    "ICCCCCCCCCCCI",
    "ICDIIIIIIIDCI",
    "ICDIIHIIIDCI",
    "ICCCCCCCCCCCI",
    "ICDIIIIIIIDCI",
    "ICDIDIIIDIDCI",
    "ICCCCCCCCCCCI",
    "ICDIIIIIIIDCI",
    "ICDIIHIIIDCI",
    "ICCCCCCCCCCCI",
    " IIIIIIIIIII ",
    " II       II ",
  ]),
  officePrinter: spriteFromMatrix("office-printer", [
    "   RRRRRRR   ",
    "  IRRRRRRRI  ",
    " IIIIIIIIIII ",
    "ICCCCCCCCCCCI",
    "ICDDDDDDDDDCI",
    "ICDIIHIIIIDCI",
    "ICCCCCCCCCCCI",
    " IIIIIIIIIII ",
  ]),
  ivStand: spriteFromMatrix("iv-stand", [
    "    II II    ",
    "    IIIII    ",
    "   IRRIRRI   ",
    "   IRRIRRI   ",
    "    II II    ",
    "     III     ",
    "     III     ",
    "     III     ",
    "     III     ",
    "     III     ",
    "     III     ",
    "     III     ",
    "     III     ",
    "   IIIIIII   ",
    " II   I   II ",
  ]),
  scrubSink: spriteFromMatrix("scrub-sink", [
    "   II     II     II   ",
    "   IIIIIIIIIIIIIIII   ",
    "  IIIIIIIIIIIIIIIIII  ",
    " ICCHHHHHHHHHHHHHCCI ",
    "ICCHHIIIIIIIIIIHHCCI",
    "ICCHHIIIIIIIIIIHHCCI",
    " ICCCHHHHHHHHHHCCCI ",
    "  ICCCCCCCCCCCCCCCI  ",
    " ICDDDDDICIDDDDDDCI ",
    " ICDDDDDICIDDDDDDCI ",
    "  IIIIIIIIIIIIIIIII  ",
    "   II           II   ",
  ]),
  wallShelf: spriteFromMatrix("wall-shelf", [
    " IIIIIIIIIIIIIIIII ",
    "IDDDDDDDDDDDDDDDDI",
    "IDRRPPIIGGRRPPGGDI",
    "IDRRPPIRIGGRRPPGDI",
    "IDGGPPIRIGGPPPPGDI",
    "IDDDDDDDDDDDDDDDDI",
    " IIIIIIIIIIIIIIIII ",
    " II             II ",
  ]),
  wasteBin: spriteFromMatrix("waste-bin", [
    " IIIIIIIII ",
    "ICCCCCCCCCI",
    "ICDDDDDDDCI",
    "ICDIIIIIIDCI",
    "ICDIIDIIIDCI",
    "ICDIIIIIIDCI",
    "ICDDDDDDDCI",
    "ICCCCCCCCCI",
    " IIIIIIIII ",
  ]),
  privacyCurtain: spriteFromMatrix("privacy-curtain", [
    "IIIIIIIIIIIIIIIII",
    "I  I   I   I   I",
    "I SSSSSSSSSSSSS I",
    "I SLSLSLSLSLSLS I",
    "I SSSSSSSSSSSSS I",
    "I SLSLSLSLSLSLS I",
    "I SSSSSSSSSSSSS I",
    "I SLSLSLSLSLSLS I",
    "I SSSSSSSSSSSSS I",
    "I SLSLSLSLSLSLS I",
    "I SSSSSSSSSSSSS I",
    "I  I   I   I   I",
    "II II II II II II",
  ]),
  wallClock: spriteFromMatrix("wall-clock", [
    "   III   ",
    " IIIRIII ",
    "IIRRRRRII",
    "IRRIRRRRI",
    "IRRIIIRRI",
    "IRRRIRRRI",
    "IIRRRRRII",
    " IIIRIII ",
    "   III   ",
  ]),
  bushCluster: spriteFromMatrix("bush-cluster", [
    "       OOO       OOOO       ",
    "   OOOSSSSOO   OOSSSSOOO    ",
    " OOSSSLLSSSOOOOSSSLLSSSSOO  ",
    "OSSSLLLLSSSSSSSSLLLLLLSSSSO ",
    "OSSSLLSSSSOOSSSSSLLSSSSSSSO ",
    " OOSSSSSOO  OOSSSSSSSSSSOO  ",
    "   OOOOO      OOOOOOOOOO     ",
    " DDDDDDDDDDDDDDDDDDDDDDDDD  ",
    "  IIIIIIIIIIIIIIIIIIIIIII    ",
  ]),
  flowerBed: spriteFromMatrix("flower-bed", [
    "   R       R   R       R   ",
    "  RIR  P  RIR RIR  P  RIR  ",
    "   O  PIP  O   O  PIP  O   ",
    " OOSOOOOOSOOOOOSOOOOOSOOOOO ",
    "OSSSSSSSSSSSSSSSSSSSSSSSSSO",
    " DDDDDDDDDDDDDDDDDDDDDDDDD ",
    "  IIIIIIIIIIIIIIIIIIIIIIIII ",
  ]),
  shadeTree: spriteFromMatrix("shade-tree", [
    "         OOOOOO         ",
    "     OOOOSSSSSSOOOO     ",
    "   OOSSSSSLLLSSSSSSOO   ",
    " OOSSSLLLLLLLLLLLSSSSOO ",
    "OSSSLLLLSSSSSLLLLLLSSSSO",
    "OSSSLLSSSSOOSSSLLLLSSSSO",
    " OOSSSSSOO  OOSSSSSSSOO ",
    "   OOOOO  DD  OOOOOOO   ",
    "          DD            ",
    "         IDDI           ",
    "         IDDI           ",
    "        IID DII          ",
    "      IIIIIIIIIII       ",
    "    DDDDDDDDDDDDDDD     ",
  ]),
  stonePlanter: spriteFromMatrix("stone-planter", [
    "   OO OOO OO   ",
    " OOSSSSSSSSSOO ",
    "  OOSSSSSSSOO  ",
    "     OOOO      ",
    " IIIIIIIIIIIIII",
    "ICCCCCCCCCCCCCI",
    "ICDDDDDDDDDDDCI",
    " IIIIIIIIIIIIII",
  ]),
  roomPlant: spriteFromMatrix("room-plant", [
    "  O   O  ",
    " OOO OOO ",
    "  OOOOO  ",
    " OOSOSOO ",
    "   OOO   ",
    "    O    ",
    "   IDI   ",
    "  IDDDI  ",
    "   III   ",
  ]),
  litter: spriteFromMatrix("litter", [
    " II      ",
    "IRRI  III",
    " IRI IPPI",
    "  I  IPRI",
    "      III",
  ]),
} as const;

const FIXTURES = {
  ...BASE_FIXTURES,
  frontDesk: DETAILED_FRONT_DESK,
  waitingBench: DETAILED_WAITING_BENCH,
  waitingCouch: DETAILED_WAITING_COUCH,
  visitorChair: DETAILED_VISITOR_CHAIR,
  officeChair: DETAILED_OFFICE_CHAIR,
  secretaryChair: DETAILED_SECRETARY_CHAIR,
  examTable: DETAILED_EXAM_TABLE,
  sinkCabinet: DETAILED_SINK_CABINET,
  gloveDispenser: DETAILED_GLOVE_DISPENSER,
  toilet: DETAILED_TOILET,
  xrayTube: DETAILED_XRAY_SYSTEM,
  xrayBucky: DETAILED_XRAY_BUCKY,
  supplyCabinet: DETAILED_SUPPLY_CABINET,
  imagingConsole: DETAILED_IMAGING_CONSOLE,
  serverRack: DETAILED_SERVER_RACK,
  procedureTable: DETAILED_PROCEDURE_TABLE,
  procedureLight: DETAILED_PROCEDURE_LIGHT,
  instrumentTray: DETAILED_INSTRUMENT_TRAY,
  waterCooler: DETAILED_WATER_COOLER,
  vitalsMonitor: VITALS_MONITOR,
  rollingCart: ROLLING_CART,
  ultrasoundConsole: ULTRASOUND_CONSOLE,
  ctGantry: CT_GANTRY,
  phlebotomyChair: PHLEBOTOMY_CHAIR,
  tubeRack: TUBE_RACK,
  mopCart: MOP_CART,
  endoscopyTower: ENDOSCOPY_TOWER,
  trainingTable: TRAINING_TABLE,
  coffeeMachine: COFFEE_MACHINE,
  ringLight: RING_LIGHT,
} as const;

export type FixtureId = keyof typeof FIXTURES;

export const FIXTURE_SPRITES: Readonly<Record<FixtureId, PixelSpriteAsset>> =
  FIXTURES;

/**
 * Perspective sprites stay upright in the shallow dollhouse camera. When a
 * room package rotates, its grounded placement changes, but a finished chair,
 * table, or machine must not be mechanically spun upside down. Future
 * orientation-specific artwork can be registered here without changing scene
 * code.
 */
const ORIENTED_FIXTURE_VARIANTS: Partial<
  Record<FixtureId, Partial<Record<90 | 180 | 270, PixelSpriteAsset>>>
> = {};

/**
 * Returns an explicitly authored perspective variant when one exists;
 * otherwise retains the upright base sprite. Grounded positions still rotate
 * through roomVisualLayout, preventing hanging/upside-down dollhouse art.
 */
export function getFixtureSpriteForOrientation(
  id: FixtureId,
  orientation: 0 | 90 | 180 | 270 = 0,
): PixelSpriteAsset {
  const fixture = FIXTURE_SPRITES[id];
  return orientation === 0
    ? fixture
    : ORIENTED_FIXTURE_VARIANTS[id]?.[orientation] ?? fixture;
}

/** Explicit coverage keeps primary rooms from regressing to the generic fallback. */
export const PRIMARY_ROOM_FIXTURE_IDS = {
  "room.front_desk": [
    "frontDesk",
    "deskTerminal",
    "secretaryChair",
    "filingCabinet",
  ],
  "room.hallway": [],
  "room.waiting": ["waitingCouch", "visitorChair", "coffeeTable"],
  "room.examination": [
    "examTable",
    "sinkCabinet",
    "diagnosticPanel",
    "gloveDispenser",
  ],
  "room.bathroom": ["handSink", "toilet", "wallMirror"],
  "room.xray": ["xrayTube", "xrayTable", "xrayBucky"],
  "room.imaging_control": ["imagingConsole", "serverRack", "officeChair"],
} as const satisfies Readonly<Record<string, readonly FixtureId[]>>;

/** Explicit room-art coverage: Level 2 rooms must never use the generic fallback. */
export const LEVEL_TWO_ROOM_FIXTURE_IDS = {
  "room.ultrasound": ["examTable", "ultrasoundConsole", "rollingCart"],
  "room.ct": ["ctGantry", "supplyCabinet", "rollingCart"],
  "room.phlebotomy": ["phlebotomyChair", "tubeRack", "sinkCabinet"],
  "room.evs_closet": ["mopCart", "scrubSink", "supplyCabinet"],
  "room.endoscopy": ["endoscopyTower", "procedureTable", "sinkCabinet"],
  "room.periop_recovery": ["procedureTable", "vitalsMonitor", "ivStand"],
  "room.training": ["trainingTable", "visitorChair", "noticeBoard"],
  "room.coffee_kiosk": ["frontDesk", "coffeeMachine", "chartStack"],
  "room.glp1_telehealth_suite": ["imagingConsole", "ringLight", "deskPhone"],
} as const satisfies Readonly<Record<string, readonly FixtureId[]>>;

/** Minor Procedure plus Level 2 each have a non-fallback illustrated package. */
export const ADVANCED_ROOM_FIXTURE_IDS = {
  "room.minor_procedure": [
    "procedureTable",
    "procedureLight",
    "instrumentTray",
    "supplyCabinet",
  ],
  ...LEVEL_TWO_ROOM_FIXTURE_IDS,
} as const satisfies Readonly<Record<string, readonly FixtureId[]>>;
