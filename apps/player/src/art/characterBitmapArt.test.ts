import { describe, expect, it } from "vitest";
import { createFounderAppearance, createUnifiedFounderAppearance } from "../content/founderAppearancePresets";
import {
  allCanonicalCharacterAtlases,
  characterAtlasCellStyle,
  characterBitmapLayers,
  characterBitmapRegistration,
  coherentCharacterVariant,
  isPatientV1Appearance,
  patientV1AtlasCell,
} from "./characterBitmapArt";
import { normalizePatientAppearanceForSex } from "@gamify-surgery/game-domain";
import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";

describe("clean unified character actor atlases", () => {
  it("retains v3 for ordinary actors and supplies the founder-only v4 package", () => {
    expect(allCanonicalCharacterAtlases()).toHaveLength(29);
    expect(allCanonicalCharacterAtlases().filter((atlas) => atlas.relativePath?.includes("/v3/actors-"))).toHaveLength(9);
    expect(allCanonicalCharacterAtlases().filter((atlas) => atlas.relativePath?.includes("/founders-v4/"))).toHaveLength(20);
  });

  it("projects all legacy 900 founder pairs onto one coherent actor without mutating their saved choice", () => {
    for (let head = 0; head < 30; head += 1) {
      for (let body = 0; body < 30; body += 1) {
        const saved = createFounderAppearance(head, body);
        const actor = characterBitmapLayers(saved, "front", "idle");
        expect(actor.actor.variant).toBe(head);
        expect(actor.head).toBe(actor.actor);
        expect(actor.body).toBe(actor.actor);
        expect(saved.bodyVariant).toBe(body);
      }
    }
  });

  it("uses four explicit founder directional gait pairs without flipping eastward art", () => {
    const appearance = createUnifiedFounderAppearance(21);
    for (const [direction, pose] of [
      ["front", "idle"], ["side", "idle"], ["back", "idle"],
      ["side", "walk-a"], ["side", "walk-b"], ["front", "seated"],
      ["front", "working"], ["side", "interaction"], ["front", "star-jump"],
    ] as const) {
      const actor = characterBitmapLayers(appearance, direction, pose, true);
      expect(actor.actor.atlas.id).toContain("founders-");
      expect(characterBitmapRegistration(actor).cell).toEqual({ width: 96, height: 144 });
    }
    expect(characterBitmapLayers(appearance, "side", "walk-a", true).actor.atlas.id).toContain("right-walk-a");
    expect(characterBitmapLayers(appearance, "side", "walk-b", true).actor.atlas.id).toContain("right-walk-b");
    expect(characterBitmapLayers(appearance, "front", "walk-a").actor.atlas.id).toContain("front-walk-a");
    expect(characterBitmapLayers(appearance, "back", "walk-b").actor.atlas.id).toContain("back-walk-b");
    expect(characterBitmapLayers(appearance, "side", "walk-a", true).actor.flipX).toBe(false);
    expect(characterBitmapLayers(appearance, "side", "walk-a", false).actor.flipX).toBe(false);
  });

  it("keeps every founder identity fixed through every directional gait frame", () => {
    const expectedAtlasSuffixes = [
      ["front", false, "character:founders-front-walk-a-v4-r8"],
      ["front", false, "character:founders-front-walk-b-v4-r8"],
      ["back", false, "character:founders-back-walk-a-v4-r8"],
      ["back", false, "character:founders-back-walk-b-v4-r8"],
      ["side", false, "character:founders-left-walk-a-v4-r8"],
      ["side", false, "character:founders-left-walk-b-v4-r8"],
      ["side", true, "character:founders-right-walk-a-v4-r8"],
      ["side", true, "character:founders-right-walk-b-v4-r8"],
    ] as const;
    for (let founder = 0; founder < 30; founder += 1) {
      const appearance = createUnifiedFounderAppearance(founder);
      for (const [direction, movingRight, expectedAtlas] of expectedAtlasSuffixes) {
        const pose = expectedAtlas.includes("walk-a") ? "walk-a" : "walk-b";
        const actor = characterBitmapLayers(appearance, direction, pose, movingRight).actor;
        expect(actor.variant).toBe(founder);
        expect(actor.atlas.id).toBe(expectedAtlas);
        expect(actor.flipX).toBe(false);
      }
    }
  });

  it("resolves every clipboard interaction to its complete matching r6 founder frame", () => {
    for (let founder = 0; founder < 30; founder += 1) {
      const layers = characterBitmapLayers(
        createUnifiedFounderAppearance(founder),
        "front",
        "interaction",
      );
      const actor = layers.actor;
      expect(actor.variant).toBe(founder);
      expect(actor.atlas.id).toBe("character:founders-clipboard-v4-r8");
      expect(characterBitmapRegistration(layers).floorY).toBe(136);
    }
  });

  it("uses the approved-pose foot baseline, leaving a transparent safety margin below each full actor", () => {
    const actor = characterBitmapLayers(createUnifiedFounderAppearance(0), "front", "idle");
    const registration = characterBitmapRegistration(actor);
    expect(registration.floorY).toBe(136);
    expect(registration.floorAnchorY).toBeCloseTo(136 / 144);
    expect(registration.floorY).toBeLessThan(registration.cell.height);
  });

  it("uses CSS cropping for the selected complete actor, not a random portrait", () => {
    const actor = characterBitmapLayers(createUnifiedFounderAppearance(3), "front", "idle").actor;
    const style = characterAtlasCellStyle(actor);
    expect(style.backgroundImage).toContain("founders-front-idle-v4.png");
    expect(style.backgroundPosition).toBe("75% 0%");
  });

  it("has a deterministic coherent visual projection for generated and legacy descriptors", () => {
    expect(coherentCharacterVariant(createFounderAppearance(12, 3))).toBe(12);
    expect(coherentCharacterVariant(createFounderAppearance(29, 0))).toBe(29);
  });

  it("resolves every persisted authored patient ID to its exact five-by-ten cell", () => {
    for (let index = 0; index < 50; index += 1) {
      const id = `patient.adult.${String(index + 1).padStart(3, "0")}`;
      const appearance = {
        ...normalizePatientAppearanceForSex(createFounderAppearance(0, 0), "Female"),
        roleStyle: "patient" as const,
        patientIdentityId: id as PixelAppearanceDescriptor["patientIdentityId"],
      } as PixelAppearanceDescriptor;
      const layers = characterBitmapLayers(appearance, "front", "idle");
      expect(isPatientV1Appearance(appearance)).toBe(true);
      expect(patientV1AtlasCell(appearance)).toBe(index);
      expect(layers.actor.atlas.id).toBe("character:patients-front-idle-v1-r6");
      expect(layers.actor.variant).toBe(index);
      expect(layers.actor.flipX).toBe(false);
    }
  });

  it("uses authored right-facing patient gaits and distinct A/B atlas families", () => {
    const patient = {
      ...normalizePatientAppearanceForSex(createFounderAppearance(0, 0), "Female"),
      roleStyle: "patient" as const,
      patientIdentityId: "patient.adult.017" as const,
    };
    const eastA = characterBitmapLayers(patient, "side", "walk-a", true);
    const eastB = characterBitmapLayers(patient, "side", "walk-b", true);
    expect(eastA.actor.atlas.id).toBe("character:patients-right-walk-a-v1-r6");
    expect(eastB.actor.atlas.id).toBe("character:patients-right-walk-b-v1-r6");
    expect(eastA.actor.atlas.id).not.toBe(eastB.actor.atlas.id);
    expect(eastA.actor.flipX).toBe(false);
    expect(characterBitmapLayers(patient, "side", "walk-a", false).actor.atlas.id)
      .toBe("character:patients-left-walk-a-v1-r6");
  });

  it("keeps all authored patients in one stable profile across each sampled lateral gait phase", () => {
    for (let index = 1; index <= 50; index += 1) {
      const patient = {
        ...normalizePatientAppearanceForSex(createFounderAppearance(0, 0), "Female"),
        roleStyle: "patient" as const,
        patientIdentityId: `patient.adult.${String(index).padStart(3, "0")}` as PixelAppearanceDescriptor["patientIdentityId"],
      } as PixelAppearanceDescriptor;
      const west = ["walk-a", "walk-neutral", "walk-b"] as const;
      const east = ["walk-a", "walk-neutral", "walk-b"] as const;
      expect(west.map((pose) => characterBitmapLayers(patient, "side", pose, false).actor.atlas.id)).toEqual([
        "character:patients-left-walk-a-v1-r6",
        "character:patients-left-walk-neutral-v1-r6",
        "character:patients-left-walk-b-v1-r6",
      ]);
      expect(east.map((pose) => characterBitmapLayers(patient, "side", pose, true).actor.atlas.id)).toEqual([
        "character:patients-right-walk-a-v1-r6",
        "character:patients-right-walk-neutral-v1-r6",
        "character:patients-right-walk-b-v1-r6",
      ]);
      expect([...west, ...east].map((pose, frame) =>
        characterBitmapLayers(patient, "side", pose, frame >= west.length).actor.flipX,
      )).toEqual([false, false, false, false, false, false]);
    }
  });

  it("uses a direction-locked gait-neutral atlas for every patient moving beat", () => {
    const founder = createUnifiedFounderAppearance(8);
    const patient = {
      ...normalizePatientAppearanceForSex(createFounderAppearance(0, 0), "Male"),
      roleStyle: "patient" as const,
      patientIdentityId: "patient.adult.018" as const,
    };
    const staff = { ...founder, roleStyle: "receptionist" as const };
    expect(characterBitmapLayers(founder, "side", "walk-neutral", false).actor.atlas.id)
      .toBe("character:founders-left-idle-v4-r8");
    expect(characterBitmapLayers(founder, "side", "walk-neutral", true).actor.atlas.id)
      .toBe("character:founders-right-idle-v4-r8");
    expect(characterBitmapLayers(patient, "side", "walk-neutral", false).actor.atlas.id)
      .toBe("character:patients-left-walk-neutral-v1-r6");
    expect(characterBitmapLayers(patient, "side", "walk-neutral", true).actor.atlas.id)
      .toBe("character:patients-right-walk-neutral-v1-r6");
    expect(characterBitmapLayers(staff, "side", "walk-neutral", false).actor.flipX).toBe(false);
    expect(characterBitmapLayers(staff, "side", "walk-neutral", true).actor.flipX).toBe(true);
  });

  it("keeps legacy staff on their approved left art and mirrors only eastbound travel", () => {
    const staff = {
      ...createUnifiedFounderAppearance(4),
      roleStyle: "receptionist" as const,
    };
    const westA = characterBitmapLayers(staff, "side", "walk-a", false).actor;
    const westB = characterBitmapLayers(staff, "side", "walk-b", false).actor;
    const eastA = characterBitmapLayers(staff, "side", "walk-a", true).actor;
    const eastB = characterBitmapLayers(staff, "side", "walk-b", true).actor;
    expect([westA.atlas.id, westB.atlas.id]).toEqual([
      "character:actors-left-walk-a-v3",
      "character:actors-left-walk-b-v3",
    ]);
    expect([eastA.atlas.id, eastB.atlas.id]).toEqual([
      "character:actors-left-walk-a-v3",
      "character:actors-left-walk-b-v3",
    ]);
    expect([westA.flipX, westB.flipX, eastA.flipX, eastB.flipX])
      .toEqual([false, false, true, true]);
    expect(characterBitmapLayers(staff, "side", "walk-neutral", false).actor.atlas.id)
      .toBe("character:actors-left-idle-v3");
    expect(characterBitmapLayers(staff, "side", "walk-neutral", true).actor.flipX)
      .toBe(true);
  });

  it("keeps patient thumbnails, portraits, and seated frames on the same identity cell", () => {
    const patient = {
      ...normalizePatientAppearanceForSex(createFounderAppearance(0, 0), "Male"),
      roleStyle: "patient" as const,
      patientIdentityId: "patient.adult.042" as const,
    };
    const thumbnail = characterBitmapLayers(patient, "front", "idle", false, "thumbnail");
    const portrait = characterBitmapLayers(patient, "front", "idle", false, "portrait");
    const seatedLeft = characterBitmapLayers(patient, "side", "seated", false);
    const seatedRight = characterBitmapLayers(patient, "side", "seated", true);
    expect([thumbnail, portrait, seatedLeft, seatedRight].map((layers) => layers.actor.variant))
      .toEqual([41, 41, 41, 41]);
    expect(thumbnail.actor.atlas.id).toBe("character:patients-thumbnail-v1-r6");
    expect(portrait.actor.atlas.id).toBe("character:patients-portrait-v1-r6");
    expect(seatedLeft.actor.atlas.id).toBe("character:patients-seated-left-v1-r6");
    expect(seatedRight.actor.atlas.id).toBe("character:patients-seated-right-v1-r6");
    expect(characterAtlasCellStyle(portrait.actor)).toMatchObject({
      backgroundSize: "500% 1000%",
      backgroundPosition: "25% 88.88888888888889%",
    });
  });

  it("leaves founders r6 and malformed legacy patients on their existing safe renderers", () => {
    const founder = createUnifiedFounderAppearance(7);
    const legacyPatient = {
      ...normalizePatientAppearanceForSex(createFounderAppearance(0, 0), "Female"),
      roleStyle: "patient" as const,
      patientIdentityId: "patient.adult.999" as never,
    };
    expect(characterBitmapLayers(founder, "front", "idle").actor.atlas.id)
      .toBe("character:founders-front-idle-v4-r8");
    expect(isPatientV1Appearance(legacyPatient)).toBe(false);
    expect(characterBitmapLayers(legacyPatient, "front", "idle").actor.atlas.id)
      .toBe("character:actors-front-idle-v3");
  });
});
