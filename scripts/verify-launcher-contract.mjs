import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const contractPath = resolve(
  "apps/player/public/gamify-surgery-launcher-health.json",
);
const launcherPath = resolve("scripts/Start-Prototype.ps1");
const expectedContract = {
  applicationId: "gamify-surgery-player",
  launcherProtocol: 1,
};

const contract = JSON.parse(await readFile(contractPath, "utf8"));
for (const [field, expectedValue] of Object.entries(expectedContract)) {
  if (contract[field] !== expectedValue) {
    throw new Error(
      `Launcher health contract field "${field}" must be ${JSON.stringify(expectedValue)}; received ${JSON.stringify(contract[field])}.`,
    );
  }
}

const launcher = await readFile(launcherPath, "utf8");
const requiredLauncherMarkers = [
  "gamify-surgery-launcher-health.json",
  "actualHealthContract.applicationId",
  "expectedHealthContract.applicationId",
  "actualHealthContract.launcherProtocol",
  "expectedHealthContract.launcherProtocol",
  "Test-PrototypePortInUse",
  "--strictPort",
];
for (const marker of requiredLauncherMarkers) {
  if (!launcher.includes(marker)) {
    throw new Error(
      `The desktop launcher is missing required health or conflict marker "${marker}".`,
    );
  }
}
if (
  launcher.includes(
    "Private synthetic prototype of a surgery-management learning game.",
  )
) {
  throw new Error(
    "The desktop launcher still fingerprints mutable public description copy.",
  );
}

console.log(
  `Verified launcher health contract ${contract.applicationId} protocol ${contract.launcherProtocol}.`,
);
