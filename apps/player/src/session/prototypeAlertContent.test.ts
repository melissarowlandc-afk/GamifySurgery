import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_ALERT_CONTENT,
  PROTOTYPE_PLAYER_FEED_POLICY,
  isPrototypeAlertEligible,
  isPrototypeEventSuppressedFromPlayerFeed,
  renderPrototypeAlert,
  type PrototypeAlertDefinition,
  type PrototypeAlertEligibilityContext,
} from "@gamify-surgery/balance-config";

const APPROVED_AMBIENT_TEXT = [
  "A fax arrived. Historians have been notified.",
  "The printer is out of cyan. It prints in black. This remains somehow relevant.",
  "The good pen has been sighted near the Front Desk.",
  "Someone adjusted the thermostat. Negotiations have collapsed.",
  "The waiting-room plant has been promoted. Its duties remain unclear.",
  "The coffee is technically warm.",
  "A clipboard is missing. A committee has been formed.",
  "A mysterious charger has appeared. It fits nothing.",
  "The break-room fridge contains a yogurt with tenure.",
  "The water cooler made a bubble. Three people looked.",
  "One ceiling tile has developed seniority.",
  "The supply closet contains 47 extra-small gloves and one medium. Procurement calls this balanced.",
  "The waiting-room magazines are now primary historical sources.",
  "The hand-sanitizer dispenser sighed.",
  "Someone labeled their leftovers DO NOT EAT. Interest has increased.",
  "The stapler has relocated without leaving a forwarding address.",
  "Someone printed an email asking everyone not to print emails.",
  "The clinic Wi-Fi has been restarted. It is now slow with confidence.",
  "A paper gown has escaped its drawer.",
  "The break-room microwave finished heating something no one remembers starting.",
  "A patient completed every form without missing a box. Compliance is investigating.",
  "Someone found a clean mug. Spirits are high.",
  "The Front Desk phone rang once and stopped. The mystery remains open.",
  "The automatic soap dispenser activated by itself. It knows what it did.",
  "A box marked Miscellaneous has achieved its final form.",
] as const;

const PLACEHOLDER_PATTERN = /{{([a-z0-9_]+)}}/gi;

function placeholders(template: string): string[] {
  return Array.from(
    template.matchAll(PLACEHOLDER_PATTERN),
    (match) => match[1]!,
  );
}

function definition(definitionId: string): PrototypeAlertDefinition {
  const match = PROTOTYPE_ALERT_CONTENT.find(
    (candidate) => candidate.id === definitionId,
  );
  expect(match, `Missing alert definition ${definitionId}`).toBeDefined();
  return match!;
}

function eligibilityContext(
  overrides: Partial<PrototypeAlertEligibilityContext> = {},
): PrototypeAlertEligibilityContext {
  return {
    facilityLevel: 1,
    roomDefinitionIds: new Set(),
    objectIds: new Set(),
    hasCheckedInPatient: false,
    ...overrides,
  };
}

describe("PROTOTYPE_ALERT_CONTENT registry contract", () => {
  it("uses unique stable definition and variant IDs", () => {
    const definitionIds = PROTOTYPE_ALERT_CONTENT.map(
      (candidate) => candidate.id,
    );
    const variantIds = PROTOTYPE_ALERT_CONTENT.flatMap((candidate) =>
      candidate.variants.map((variant) => variant.id),
    );

    expect(new Set(definitionIds).size).toBe(definitionIds.length);
    expect(new Set(variantIds).size).toBe(variantIds.length);

    for (const candidate of PROTOTYPE_ALERT_CONTENT) {
      expect(candidate.id).toMatch(/^alert\.[a-z0-9.-]+$/);
      expect(candidate.variants.length).toBeGreaterThan(0);
      for (const variant of candidate.variants) {
        expect(variant.id).toMatch(/^alert\.[a-z0-9.-]+$/);
        expect(variant.id.startsWith(`${candidate.id}.`)).toBe(true);
      }
    }
  });

  it("contains exactly the 25 approved ambient lines", () => {
    const ambient = PROTOTYPE_ALERT_CONTENT.filter(
      (candidate) => candidate.category === "ambient_flavor",
    );

    expect(ambient).toHaveLength(25);
    expect(ambient.map((candidate) => candidate.bodyTemplate)).toEqual(
      APPROVED_AMBIENT_TEXT,
    );
    expect(
      ambient.every(
        (candidate) =>
          candidate.trigger === "ambient_timer" &&
          candidate.variants.length === 1 &&
          candidate.variants[0]?.bodyTemplate === candidate.bodyTemplate,
      ),
    ).toBe(true);
  });

  it("requires positive selection weights and attention markers only for action-required content", () => {
    for (const candidate of PROTOTYPE_ALERT_CONTENT) {
      expect(candidate.selectionWeight).toBeGreaterThan(0);
      expect(candidate.showAttentionMarker).toBe(
        candidate.category === "action_required",
      );
      for (const variant of candidate.variants) {
        expect(variant.selectionWeight).toBeGreaterThan(0);
      }
    }
  });

  it("declares safe fallbacks for every placeholder and renders every variant without unresolved tokens", () => {
    for (const candidate of PROTOTYPE_ALERT_CONTENT) {
      const templates = [
        candidate.titleTemplate,
        candidate.bodyTemplate,
        candidate.consolidationKeyTemplate,
        ...candidate.variants.flatMap((variant) => [
          variant.titleTemplate ?? candidate.titleTemplate,
          variant.bodyTemplate,
        ]),
      ];
      const requiredPlaceholders = new Set(
        templates.flatMap((template) => placeholders(template)),
      );

      for (const key of requiredPlaceholders) {
        expect(
          candidate.placeholderFallbacks[key],
          `${candidate.id} needs a fallback for {{${key}}}`,
        ).toBeTruthy();
      }

      for (const variant of candidate.variants) {
        const rendered = renderPrototypeAlert(candidate, {}, variant.id);
        expect(rendered.definitionId).toBe(candidate.id);
        expect(rendered.variantId).toBe(variant.id);
        expect(rendered.title.trim()).not.toBe("");
        expect(rendered.body.trim()).not.toBe("");
        expect(rendered.title).not.toMatch(PLACEHOLDER_PATTERN);
        expect(rendered.body).not.toMatch(PLACEHOLDER_PATTERN);
        expect(rendered.title).not.toContain("undefined");
        expect(rendered.body).not.toContain("undefined");
      }
    }
  });

  it("gates break-room, waiting-room, object, and checked-in-patient ambient lines by context", () => {
    const base = eligibilityContext();
    const contextCases = [
      {
        ids: [
          "alert.ambient.09",
          "alert.ambient.15",
          "alert.ambient.20",
          "alert.ambient.22",
        ],
        enabled: eligibilityContext({
          roomDefinitionIds: new Set(["room.break_room"]),
        }),
      },
      {
        ids: ["alert.ambient.05", "alert.ambient.13"],
        enabled: eligibilityContext({
          roomDefinitionIds: new Set(["room.waiting"]),
        }),
      },
      {
        ids: ["alert.ambient.10"],
        enabled: eligibilityContext({
          objectIds: new Set(["water_cooler"]),
        }),
      },
      {
        ids: ["alert.ambient.21"],
        enabled: eligibilityContext({ hasCheckedInPatient: true }),
      },
    ] as const;

    for (const contextCase of contextCases) {
      for (const definitionId of contextCase.ids) {
        const candidate = definition(definitionId);
        expect(isPrototypeAlertEligible(candidate, base)).toBe(false);
        expect(isPrototypeAlertEligible(candidate, contextCase.enabled)).toBe(
          true,
        );
      }
    }
  });

  it("limits walkout review pools to one- and two-star, cause-specific content", () => {
    const reviews = PROTOTYPE_ALERT_CONTENT.filter(
      (candidate) => candidate.category === "walkout_review",
    );
    const expectedCauses = [
      "excessive_waiting",
      "poor_cleanliness",
      "missing_amenities",
      "no_receptionist",
      "imaging_unavailable",
      "general",
    ];
    const representedCauses = reviews.flatMap(
      (candidate) => candidate.dissatisfactionCauses ?? [],
    );

    expect(reviews).toHaveLength(expectedCauses.length);
    expect([...representedCauses].sort()).toEqual([...expectedCauses].sort());
    expect(new Set(representedCauses).size).toBe(representedCauses.length);

    for (const candidate of reviews) {
      expect(candidate.showAttentionMarker).toBe(false);
      expect(candidate.dissatisfactionCauses?.length).toBeGreaterThan(0);
      expect(candidate.reviewRatings?.length).toBeGreaterThan(0);
      expect(
        candidate.reviewRatings?.every(
          (rating) => rating === 1 || rating === 2,
        ),
      ).toBe(true);
      expect(candidate.variants.length).toBeGreaterThan(0);
    }
  });

  it("keeps patient complaints data-driven while routine audit events stay out of the compact feed", () => {
    expect(
      definition("alert.patient.cleanliness-complaint"),
    ).toMatchObject({
      category: "guidance",
      targetKind: "litter",
      clickAction: "open_litter",
      persistent: true,
      cooldownMinutes: 45,
    });
    expect(
      definition("alert.patient.room-upgrade-requested"),
    ).toMatchObject({
      category: "guidance",
      targetKind: "room",
      clickAction: "open_room",
      persistent: true,
      cooldownMinutes: 60,
    });
    expect(
      PROTOTYPE_PLAYER_FEED_POLICY.suppressedEventTypes,
    ).toEqual(
      expect.arrayContaining([
        "operating_expense",
        "clinical_decision_recorded",
        "encounter_settled",
        "emergency_glp1_consultation",
        "development_money_added",
        "room_placed",
        "room_moved",
        "room_rotated",
        "door_placed",
        "door_removed",
        "room_upgraded",
        "litter_appeared",
        "litter_collected",
        "water_cooler_refilled",
      ]),
    );
    expect(
      PROTOTYPE_PLAYER_FEED_POLICY.suppressedDefinitionIds,
    ).toEqual(
      expect.arrayContaining([
        "alert.success.trash-cleaned",
        "alert.success.water-refilled",
      ]),
    );
    expect(
      isPrototypeEventSuppressedFromPlayerFeed(
        "success_message",
        "alert.success.trash-cleaned",
      ),
    ).toBe(true);
    expect(
      isPrototypeEventSuppressedFromPlayerFeed(
        "success_message",
        "alert.success.first-ordinary-patient-resolved",
      ),
    ).toBe(false);
  });
});
