#!/usr/bin/env node
// Writes the exact image_gen prompts for the 20-patient demographic-gap v4 still batch.
// Planning/staging only: never writes runtime art or the still catalog.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const STYLE_REFERENCE = {
  path: "tools/character-mapping/gs026-employee-expansion-v1/assets/gs026-employee-001-cardinals-v1.png",
  sha256: "d5d925adfe28ac0b0d72456f52fbfc4e7d2c97452ffa6cf375ce45743be827f6",
  role: "style-layout-pose-reference",
};

// [age, sexLabel, build, skin, hair, face/accessories, outfit]
// Age band follows patientVisualAgeBand: 30-44 adult, 45-64 middle_aged.
const ROWS = JSON.parse(readFileSync(join(here, 'design-rows.json'), 'utf8'));
if (ROWS.length !== 20) throw new Error('Exactly20 planned identities required');

const ageWords = (age, sex) => age < 30 ? ('a young adult ' + (sex === 'Male' ? 'man' : 'woman')) : age < 45 ? ('an adult ' + (sex === 'Male' ? 'man' : 'woman')) : age < 65 ? ('a middle-aged ' + (sex === 'Male' ? 'man' : 'woman')) : ('an older adult ' + (sex === 'Male' ? 'man' : 'woman'));
const article = (word) => (/^[aeiou]/.test(word) ? "an" : "a");
const band = age => age < 30 ? 'young_adult' : age < 45 ? 'adult' : age < 65 ? 'middle_aged' : 'older_adult';

function standingPrompt([age, sexLabel, build, skin, hair, accessory, outfit]) {
  const extras = accessory === "no glasses" ? "" : `, ${accessory}`;
  return `Create one game-ready character sprite sheet as a transparent PNG with exactly four full-body, standing cardinal poses in one horizontal row, evenly spaced with wide transparent gutters. Use the supplied GS026 character sheet only as a style and proportions reference: compact rounded proportions, a large expressive head, full body, crisp softly shaded pixel art, and a dark clean outline. Do not copy its identity, clothing, pose details, or colors.

Subject: ${ageWords(age, sexLabel)}, age ${age}, with ${skin}, ${hair}${extras}, and ${article(build)} ${build}. ${sexLabel === "Male" ? "He" : "She"} wears ${outfit}. All sleeves are full length to the wrists. ${sexLabel === "Male" ? "He" : "She"} has a calm neutral expression and relaxed arms at her sides. ${sexLabel === "Male" ? "He" : "She"} must clearly read as a ${age}-year-old ordinary clinic patient in everyday clothes, not a staff member.

The four poses must depict the exact same identity, face, hairstyle, outfit, head scale, body scale, and proportions in this strict left-to-right order: SOUTH/front-facing; EAST, a true side profile facing screen-right; WEST, a true side profile facing screen-left; NORTH/rear-facing. Every pose must have a complete visible head, torso, arms, legs, and shoes. Keep the sheet tightly framed around the figures while leaving wide transparent gutters between them.

Requirements: genuinely transparent RGBA background. No floor, cast shadow, glow, labels, lettering, grid, border, props, bags, badges, lanyards, scrubs, white coats, medical devices, scenery, furniture, UI, extra characters, or cropped limbs. Do not use a photographic or painterly style. Do not make a turntable, collage, or varied poses. This is a simple standing-cardinal sprite sheet for a top-down clinic game.
`;
}

function eightPosePrompt([age, sexLabel, build, skin, hair, accessory, outfit]) {
  const extras = accessory === "no glasses" ? "" : `, ${accessory}`;
  return `Use case: stylized-concept
Asset type: transparent eight-pose game-character source sheet for review only
Primary request: Create one cohesive rounded full-body pixel-art character sheet for the patient shown in Image 2. Image 1 controls only the established GS026 pixel-art style, proportional scale, eight-pose layout and transparent-sheet composition. Image 2 controls every identity and outfit detail across all poses: ${age}-year-old ${band(age).replaceAll("_", " ")} ${sexLabel === "Male" ? "man" : "woman"} with ${skin}, ${hair}${extras}, ${article(build)} ${build}, wearing ${outfit}, all sleeves full length to the wrists. Preserve face, hair, age appearance, outfit, sleeve length, palette and proportions in all eight views.
Input images: Image 1 is style/layout/pose reference only. Image 2 is identity/outfit reference for every pose.
Composition/framing: One clean transparent sheet with exactly two rows and four isolated full-body figures. Top left-to-right: standing South/front, standing East/right-facing profile, standing West/left-facing profile, standing North/back. Bottom left-to-right: seated South/front, seated East/right-facing profile, seated West/left-facing profile, seated North/back. Leave broad clear transparent gutters between columns and a generous transparent gap between the standing and seated rows; keep every head and shoe away from the outer canvas edge. Actual cardinals only; same head/body scale between standing and seated. Seated figures use invisible chairs, knees bent around ninety degrees, hands naturally on thighs, feet flat; no chair visible.
Style/medium: soft rounded high-quality pixel art matching Image 1, compact friendly proportions, clear dark pixel-stepped outlines and subtle textured pixel shading.
Constraints: genuine transparent RGBA background; no furniture, props, badge, logo, text, labels, watermark, glow, floor, shadow or background; no duplicate/missing/cropped pose.
`;
}

const identities = ROWS.map((row, index) => {
  const number = String(index + 1).padStart(3, "0");
  const [age, sexLabel, build, skin, hair, accessory, outfit] = row;
  const dir = join(here, "prompts", number);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "stage1-standing-cardinals.prompt.txt"), standingPrompt(row));
  writeFileSync(join(dir, "stage2-eight-pose.prompt.txt"), eightPosePrompt(row));
  return {
    number,
    stableId: `patient-demographics20-v4.${number}`,
    category: "patient",
    compatibleSexLabel: sexLabel,
    intendedAge: age,
    ageBand: band(age),
    visualBrief: { build, skin, hair, accessory, outfit },
    stage1: { prompt: `prompts/${number}/stage1-standing-cardinals.prompt.txt`, references: [STYLE_REFERENCE] },
    stage2: {
      prompt: `prompts/${number}/stage2-eight-pose.prompt.txt`,
      references: [STYLE_REFERENCE, { path: `sources/${number}/stage1-standing-cardinals.png`, role: "identity-outfit-reference" }],
    },
    status: "spec_only;not-generated;not-approved;not-runtime-integrated",
  };
});

writeFileSync(
  join(here, "roster.json"),
  `${JSON.stringify({ schemaVersion: "patient-demographics20-v4-roster/v1", cohort: "patient-demographics20-v4", identities }, null, 2)}\n`,
);
console.log(`wrote ${identities.length} identities`);
