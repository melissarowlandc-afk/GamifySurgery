import { writeFileSync } from "node:fs";
import { exportLabData } from "../build/export-lab-data.mjs";
const data = exportLabData();
writeFileSync(new URL("../build/lab-data.json", import.meta.url), JSON.stringify(data));
console.log("rooms", data.rooms.length, "atlases", Object.keys(data.atlases).length);
