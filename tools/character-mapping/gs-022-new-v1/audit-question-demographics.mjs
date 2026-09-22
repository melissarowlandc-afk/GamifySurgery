import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { createServer } from "vite";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
const outputDirectory = path.join(
  repositoryRoot,
  "artifacts",
  "character-statics",
  "gs-022-new-v1",
  "patient-public20-v1",
  "demographics",
);
const snapshotPath = path.join(outputDirectory, "question-bank-demographics.json");
const readmePath = path.join(outputDirectory, "README.md");

const sourcePaths = [
  "packages/clinical-content/src/synthetic-content.ts",
  "packages/clinical-content/src/schema.ts",
  "docs/clinical-workbench/approvals/owner-delegated-bread-and-butter-2026-09-17.md",
];
const bandOrder = ["18-29", "30-44", "45-64", "65+"];
const sexOrder = ["Female", "Male", "Not specified"];
const expectedAllocation = {
  "18-29|Female": 1,
  "18-29|Male": 0,
  "30-44|Female": 3,
  "30-44|Male": 2,
  "45-64|Female": 5,
  "45-64|Male": 5,
  "45-64|Not specified": 0,
  "65+|Female": 2,
  "65+|Male": 2,
  "65+|Not specified": 0,
};
const representativeAgePlan = {
  "18-29|Female": [28],
  "30-44|Female": [35, 38, 42],
  "30-44|Male": [36, 41],
  "45-64|Female": [47, 51, 54, 59, 62],
  "45-64|Male": [47, 51, 54, 59, 61],
  "65+|Female": [67, 70],
  "65+|Male": [67, 70],
};

function ageBand(ageYears) {
  if (ageYears < 30) return "18-29";
  if (ageYears < 45) return "30-44";
  if (ageYears < 65) return "45-64";
  return "65+";
}

function keyFor(ageYears, sexLabel) {
  return `${ageBand(ageYears)}|${sexLabel}`;
}

function compareKeys(left, right) {
  const [leftBand, leftSex] = left.split("|");
  const [rightBand, rightSex] = right.split("|");
  return (
    bandOrder.indexOf(leftBand) - bandOrder.indexOf(rightBand) ||
    sexOrder.indexOf(leftSex) - sexOrder.indexOf(rightSex)
  );
}

function largestRemainderAllocation(weightedCounts, totalWeight, slots) {
  const rows = Object.entries(weightedCounts).map(([key, weight]) => {
    const exactQuota = (weight * slots) / totalWeight;
    return {
      key,
      weight,
      exactQuota,
      allocated: Math.floor(exactQuota),
      remainder: exactQuota - Math.floor(exactQuota),
    };
  });
  let remaining = slots - rows.reduce((sum, row) => sum + row.allocated, 0);
  for (const row of [...rows]
    .sort((left, right) => right.remainder - left.remainder || compareKeys(left.key, right.key))
    .slice(0, remaining)) {
    row.allocated += 1;
    remaining -= 1;
  }
  if (remaining !== 0) throw new Error("Largest-remainder allocation did not settle.");
  return rows.sort((left, right) => compareKeys(left.key, right.key));
}

function representativeAges(key, ages, allocated) {
  if (allocated === 0) return [];
  const planned = representativeAgePlan[key];
  if (!planned || planned.length !== allocated || !planned.every((age) => ages.includes(age))) {
    throw new Error(`Representative age plan no longer matches eligible profiles: ${key}`);
  }
  return planned;
}

async function sha256(relativePath) {
  const body = await readFile(path.join(repositoryRoot, relativePath));
  return createHash("sha256").update(body).digest("hex");
}

function textContainsExplicitDemographic(value) {
  return /\b\d{1,3}(?:\s|-)?year(?:\s|-)?old\s+(?:woman|man|adult|male|female)\b/i.test(value);
}

async function buildAudit() {
  const vite = await createServer({
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  try {
    const module = await vite.ssrLoadModule(
      "/packages/clinical-content/src/synthetic-content.ts",
    );
    const release = module.SYNTHETIC_CLINICAL_RELEASE;
    const weightedCounts = {};
    const agesByKey = {};
    const missingStructuredCases = [];
    const demographicRecords = [];
    let pediatricStructuredCaseWeight = 0;

    for (const clinicalCase of release.cases) {
      const profiles = clinicalCase.approvedInstantiationProfiles?.length
        ? clinicalCase.approvedInstantiationProfiles
        : [clinicalCase];
      const weight = 1 / profiles.length;
      const hasStructuredDemographic = profiles.some(
        (profile) => (profile.prototypeDemographics ?? clinicalCase.prototypeDemographics) !== undefined,
      );
      if (!hasStructuredDemographic) {
        missingStructuredCases.push(clinicalCase);
        continue;
      }
      for (const profile of profiles) {
        const demographics = profile.prototypeDemographics ?? clinicalCase.prototypeDemographics;
        if (!demographics) throw new Error(`Partially missing demographics: ${clinicalCase.id}`);
        const key = keyFor(demographics.ageYears, demographics.sexLabel);
        weightedCounts[key] = (weightedCounts[key] ?? 0) + weight;
        (agesByKey[key] ??= []).push(demographics.ageYears);
        demographicRecords.push({
          caseId: clinicalCase.id,
          profileId: profile.id ?? "case-demographics",
          ageYears: demographics.ageYears,
          sexLabel: demographics.sexLabel,
          caseWeight: weight,
        });
        if (demographics.ageYears < 18) pediatricStructuredCaseWeight += weight;
      }
    }

    const knownCaseWeight = Object.values(weightedCounts).reduce(
      (sum, value) => sum + value,
      0,
    );
    const allocation = largestRemainderAllocation(weightedCounts, knownCaseWeight, 20);
    const allocationByKey = Object.fromEntries(
      allocation.map((row) => [row.key, row.allocated]),
    );
    if (JSON.stringify(allocationByKey) !== JSON.stringify(expectedAllocation)) {
      throw new Error(`Unexpected 20-person allocation: ${JSON.stringify(allocationByKey)}`);
    }

    const presentationMatchCaseIds = missingStructuredCases
      .filter((clinicalCase) => textContainsExplicitDemographic(clinicalCase.presentation))
      .map((clinicalCase) => clinicalCase.id);
    const nodePromptMatchCaseIds = missingStructuredCases
      .filter((clinicalCase) =>
        clinicalCase.decisionNodes.some((node) =>
          textContainsExplicitDemographic([node.stem, node.currentUpdate ?? ""].join(" ")),
        ),
      )
      .map((clinicalCase) => clinicalCase.id);
    if (presentationMatchCaseIds.length || nodePromptMatchCaseIds.length) {
      throw new Error("A missing structured demographic was found in authored text.");
    }

    return {
      auditVersion: "gs022-question-demographics-v1",
      method: {
        authoritativeRelease: "SYNTHETIC_CLINICAL_RELEASE",
        unit: "450 authored cases; each case has total weight 1, divided equally among its eligible approved instantiation profiles",
        excluded: "PILOT_CLINICAL_RELEASE and runtime-completed display demographics",
        allocation: "Largest remainder over the known structured 348 case-equivalents, using 20 slots",
        representativeAges: "Reviewed representative ages drawn from eligible profile ages in each allocated cell; they do not select or alter clinical cases.",
      },
      sourceHashes: Object.fromEntries(
        await Promise.all(sourcePaths.map(async (relativePath) => [relativePath, await sha256(relativePath)])),
      ),
      releaseCounts: {
        concepts: release.concepts.length,
        cases: release.cases.length,
        decisionNodes: release.cases.reduce((sum, clinicalCase) => sum + clinicalCase.decisionNodes.length, 0),
        profileRows: release.cases.reduce(
          (sum, clinicalCase) => sum + (clinicalCase.approvedInstantiationProfiles?.length || 1),
          0,
        ),
      },
      structuredDemographicCoverage: {
        knownCaseWeight,
        missingCaseCount: missingStructuredCases.length,
        missingStructuredCaseIds: missingStructuredCases.map((clinicalCase) => clinicalCase.id),
        perCaseDemographicFingerprintSha256: createHash("sha256")
          .update(
            `${JSON.stringify(
              demographicRecords.sort((left, right) =>
                left.caseId.localeCompare(right.caseId) ||
                left.profileId.localeCompare(right.profileId),
              ),
            )}\n`,
          )
          .digest("hex"),
        explicitNotSpecifiedSexCaseWeight: Number(
          (
            weightedCounts["45-64|Not specified"] +
            weightedCounts["65+|Not specified"]
          ).toFixed(6),
        ),
        knownAgeRange: [
          Math.min(...demographicRecords.map((record) => record.ageYears)),
          Math.max(...demographicRecords.map((record) => record.ageYears)),
        ],
        pediatricStructuredCaseWeight,
      },
      missingTextScan: {
        pattern: "N-year-old woman|man|adult|male|female",
        nodePromptFieldsScanned: ["stem", "currentUpdate"],
        presentationMatchCaseIds,
        nodePromptMatchCaseIds,
      },
      weightedJointCounts: allocation.map((row) => ({
        ageBand: row.key.split("|")[0],
        sexLabel: row.key.split("|")[1],
        caseWeight: row.weight,
        percentOfKnownCaseWeight: (row.weight / knownCaseWeight) * 100,
        exactTwentySlotQuota: row.exactQuota,
        allocatedSlots: row.allocated,
        representativeAges: representativeAges(row.key, agesByKey[row.key], row.allocated),
      })),
      allocationSummary: {
        Female: 11,
        Male: 9,
        "Not specified": 0,
      },
    };
  } finally {
    await vite.close();
  }
}

function readme(audit) {
  return `# GS-022 question-bank demographic audit\n\n` +
    `This snapshot supports the visual planning of 20 patient/general-public identities. ` +
    `It does not select clinical cases, change simulation weights, or represent clinical approval.\n\n` +
    `The source is the current owner-approved/editorially accepted question bank, ` +
    `\`SYNTHETIC_CLINICAL_RELEASE\`: ${audit.releaseCounts.concepts} concepts, ` +
    `${audit.releaseCounts.cases} cases, and ${audit.releaseCounts.decisionNodes} decision nodes. ` +
    `The release remains an explicitly unapproved clinical prototype.\n\n` +
    `Each authored case has equal weight; multiple eligible instantiation profiles split that ` +
    `case's weight equally. ${audit.structuredDemographicCoverage.missingCaseCount} legacy cases lack ` +
    `structured age/sex and have no explicit demographic match in either presentation or node prompt text. ` +
    `They are excluded rather than assigned invented demographics.\n\n` +
    `Run from the repository root:\n\n` +
    '```powershell\n' +
    'node tools/character-mapping/gs-022-new-v1/audit-question-demographics.mjs --check\n' +
    '```\n\n' +
    `The script loads the release through Vite SSR and closes its Vite server before exit. ` +
    `Use \`--write\` only to refresh these two snapshot files after a deliberately reviewed content change.\n`;
}

const audit = await buildAudit();
if (process.argv.includes("--write")) {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(snapshotPath, `${JSON.stringify(audit, null, 2)}\n`);
  await writeFile(readmePath, readme(audit));
}
if (process.argv.includes("--check")) {
  const savedAudit = JSON.parse(await readFile(snapshotPath, "utf8"));
  if (!isDeepStrictEqual(savedAudit, audit)) {
    throw new Error(
      "Saved demographic snapshot differs from the rebuilt audit; run with --write after reviewing the source change.",
    );
  }
}
process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
