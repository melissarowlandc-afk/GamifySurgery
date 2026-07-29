import type {
  PixelAppearanceDescriptor,
  PixelRoleStyle,
} from "@gamify-surgery/game-domain";
import { characterAppearanceSignature } from "../art/characterArt";
import { PIXEL_PALETTE } from "../art/pixelPalette";
import type { FacilityViewModel } from "../facility";
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
  return (
    <article
      className="character-qa-card"
      data-character-id={person.id}
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
            label={`${person.name} front map sprite`}
            size="medium"
            representation="full"
            direction="front"
            roleStyle={person.roleStyle}
          />
          <figcaption>Map front</figcaption>
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
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} walking map sprite`}
            size="medium"
            representation="full"
            direction="side"
            pose="walk-a"
            roleStyle={person.roleStyle}
          />
          <figcaption>Walk frame</figcaption>
        </figure>
        <figure>
          <PixelAvatar
            avatar={person.appearance}
            label={`${person.name} portrait`}
            size="medium"
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
        (employee.roleDisplayName.toLowerCase().includes("imaging")
          ? ("imaging_technician" as const)
          : ("receptionist" as const)),
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
        descriptor used by the live facility map.
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
