import {
  AUTHORED_ADULT_PATIENT_ROSTER,
  roleStyleForStaffDefinition,
} from "@gamify-surgery/game-domain";
import type {
  PixelAppearanceDescriptor,
  PixelRoleStyle,
} from "@gamify-surgery/game-domain";
import { characterAppearanceSignature } from "../art/characterArt";
import { PIXEL_PALETTE } from "../art/pixelPalette";
import type { FacilityViewModel } from "../facility";
import { traceLateralGaitRoute } from "../facility/lateralGaitProof";
import { PixelAvatar } from "./PixelAvatar";

interface CharacterQaGalleryProps {
  facility: FacilityViewModel;
}

interface QaPerson {
  id: string;
  name: string;
  role: string;
  roleStyle: PixelRoleStyle;
  appearance: PixelAppearanceDescriptor;
}

function rosterQaAppearance(
  id: PixelAppearanceDescriptor["patientIdentityId"],
): PixelAppearanceDescriptor {
  return {
    version: "pixel-avatar.v1",
    bodyShape: "average",
    hairStyle: "short",
    skinTone: 1,
    hairShade: 3,
    faceStyle: "round",
    outfitStyle: "plain",
    outfitShade: 1,
    accessory: "none",
    headVariant: 0,
    bodyVariant: 0,
    roleStyle: "patient",
    ...(id ? { patientIdentityId: id } : {}),
  };
}

const QA_PALETTE_SWATCHES = [
  ["Neutral ivory", PIXEL_PALETTE.cream],
  ["Weathered paper", PIXEL_PALETTE.paper],
  ["Light stone", PIXEL_PALETTE.warmGray],
  ["Pale gray-sage", PIXEL_PALETTE.lightSage],
  ["Gray-green", PIXEL_PALETTE.sage],
  ["Muted moss", PIXEL_PALETTE.moss],
  ["Deep gray-olive", PIXEL_PALETTE.deepOlive],
  ["Outline ink", PIXEL_PALETTE.ink],
] as const;

function QaCharacterRow({ person }: { person: QaPerson }) {
  const routeGaitFrames = traceLateralGaitRoute({
    ...person.appearance,
    roleStyle: person.roleStyle,
  });
  return (
    <article
      className="character-qa-card"
      data-character-id={person.id}
      data-patient-identity-id={person.appearance.patientIdentityId}
      data-appearance-signature={characterAppearanceSignature(
        person.appearance,
      )}
    >
      <header>
        <div>
          <strong>{person.name}</strong>
          <span>{person.role}</span>
        </div>
        <code>{characterAppearanceSignature(person.appearance)}</code>
      </header>
      <div className="character-qa-representations">
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} list thumbnail`}
            size="small"
            representation="portrait"
            roleStyle={person.roleStyle}
          />
          <figcaption>List thumbnail</figcaption>
        </figure>
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} front map sprite`}
            size="medium"
            representation="full"
            direction="front"
            roleStyle={person.roleStyle}
          />
          <figcaption>Map front / idle</figcaption>
        </figure>
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} side map sprite`}
            size="medium"
            representation="full"
            direction="side"
            roleStyle={person.roleStyle}
          />
          <figcaption>Map side</figcaption>
        </figure>
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} back map sprite`}
            size="medium"
            representation="full"
            direction="back"
            roleStyle={person.roleStyle}
          />
          <figcaption>Map back</figcaption>
        </figure>
        {routeGaitFrames.map((frame) => (
          <figure
            key={`${frame.travel}:${frame.pose}`}
            data-live-route-frame={`${person.id}:${frame.travel}:${frame.pose}`}
            data-atlas-id={frame.atlasId}
            data-flip-x={String(frame.flipX)}
          >
            <PixelAvatar
              avatar={person.appearance}
              label={`${person.name} ${frame.travel}bound ${frame.pose} live route walking map sprite`}
              size="medium"
              representation="full"
              direction="side"
              pose={frame.pose}
              movingRight={frame.movingRight}
              roleStyle={person.roleStyle}
            />
            <figcaption>Live route {frame.travel} {frame.pose === "walk-a" ? "A" : frame.pose === "walk-b" ? "B" : "neutral"}</figcaption>
          </figure>
        ))}
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} seated map sprite`}
            size="medium"
            representation="full"
            pose="seated"
            roleStyle={person.roleStyle}
          />
          <figcaption>Seated</figcaption>
        </figure>
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} working map sprite`}
            size="medium"
            representation="full"
            pose="working"
            roleStyle={person.roleStyle}
          />
          <figcaption>Working</figcaption>
        </figure>
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} interaction map sprite`}
            size="medium"
            representation="full"
            pose="interaction"
            roleStyle={person.roleStyle}
          />
          <figcaption>Interaction</figcaption>
        </figure>
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} portrait`}
            size="large"
            representation="portrait"
            roleStyle={person.roleStyle}
          />
          <figcaption>Portrait</figcaption>
        </figure>
        {person.roleStyle === "founder" ? (
          <figure>
            <PixelAvatar
              avatar={person.appearance}
              label={`${person.name} star jump`}
              size="medium"
              representation="full"
              pose="star-jump"
              roleStyle="founder"
            />
            <figcaption>Star jump</figcaption>
          </figure>
        ) : null}
      </div>
    </article>
  );
}

export function CharacterQaGallery({
  facility,
}: CharacterQaGalleryProps) {
  const people: QaPerson[] = [
    {
      id: "founder",
      name: facility.founder.displayName,
      role: "Founder",
      roleStyle: "founder",
      appearance: facility.founder.appearance,
    },
    ...facility.staff.map((employee) => ({
      id: employee.instanceId,
      name: employee.displayName,
      role: employee.roleDisplayName,
      roleStyle:
        employee.appearance?.roleStyle ??
        roleStyleForStaffDefinition(
          employee.staffRoleDefinitionId ?? "staff.receptionist",
        ),
      appearance:
        employee.appearance ?? facility.founder.appearance,
    })),
    ...(facility.patients ?? []).map((patient) => ({
      id: patient.instanceId,
      name: patient.displayName,
      role: `Patient — ${patient.status}`,
      roleStyle: "patient" as const,
      appearance: patient.appearance,
    })),
    ...AUTHORED_ADULT_PATIENT_ROSTER.map((entry) => ({
      id: `patient-roster:${entry.id}`,
      name: `Patient ${entry.id.slice(-3)}`,
      role: `Patient roster â€” ${entry.ageBand.replaceAll("_", " ")}`,
      roleStyle: "patient" as const,
      appearance: rosterQaAppearance(entry.id),
    })),
    {
      id: "staff-route-proof",
      name: "Staff route proof",
      role: "Legacy staff lateral route",
      roleStyle: "receptionist" as const,
      appearance: facility.founder.appearance,
    },
    {
      id: "ambient-passer-proof",
      name: "Ambient passer proof",
      role: "Authored patient lateral route",
      roleStyle: "patient" as const,
      appearance: rosterQaAppearance("patient.adult.035"),
    },
  ];

  return (
    <section
      className="character-qa-gallery"
      aria-label="Character visual QA gallery"
    >
      <header className="character-qa-heading">
        <div>
          <span>Developer-only renderer comparison</span>
          <h1>Character Visual QA</h1>
        </div>
        <strong>{people.length} current characters</strong>
      </header>
      <p>
        Every cell below is generated from the same persisted appearance
        descriptor used by the live facility map. Lateral route frames are
        sampled from the facility route interpolator before bitmap selection.
      </p>
      <div
        className="character-qa-palette"
        aria-label="Current low-chroma stone and olive palette swatches"
      >
        {QA_PALETTE_SWATCHES.map(([label, color]) => (
          <span key={label}>
            <i style={{ backgroundColor: color }} aria-hidden="true" />
            <b>{label}</b>
            <code>{color.toUpperCase()}</code>
          </span>
        ))}
      </div>
      <div className="character-qa-grid">
        {people.map((person) => (
          <QaCharacterRow key={person.id} person={person} />
        ))}
      </div>
    </section>
  );
}
