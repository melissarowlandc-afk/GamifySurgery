import type { PixelAppearanceDescriptor, PixelRoleStyle } from "@gamify-surgery/game-domain";
import { getAllCharacterStillEntries } from "../art/characterStillRegistry";
import type { FacilityViewModel } from "../facility";
import { PixelAvatar } from "./PixelAvatar";

interface CharacterQaGalleryProps { facility: FacilityViewModel }

function roleStyle(category: string): PixelRoleStyle {
  return category.includes("founder") ? "founder" : category.includes("patient") ? "patient" : "receptionist";
}

function appearance(stillId: string, role: PixelRoleStyle): PixelAppearanceDescriptor {
  return {
    version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", hairShade: 0,
    faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none",
    roleStyle: role, stillId,
  };
}

export function CharacterQaGallery({ facility: _facility }: CharacterQaGalleryProps) {
  const entries = getAllCharacterStillEntries();
  return (
    <section className="character-qa-gallery" aria-label="Character visual QA gallery">
      <header className="character-qa-heading">
        <div><span>Developer-only static still review</span><h1>Character Visual QA</h1></div>
        <strong>{entries.length} registry characters</strong>
      </header>
      <p>Every registry identity is shown in all four standing and all four seated cardinals. Walking uses these same standing stills.</p>
      <div className="character-qa-grid">
        {entries.map((entry) => {
          const role = roleStyle(entry.category);
          const avatar = appearance(entry.id, role);
          const views = [
            ["Stand South", "front", "idle", false], ["Stand East", "side", "idle", true],
            ["Stand West", "side", "idle", false], ["Stand North", "back", "idle", false],
            ["Sit South", "front", "seated", false], ["Sit East", "side", "seated", true],
            ["Sit West", "side", "seated", false], ["Sit North", "back", "seated", false],
          ] as const;
          return (
            <article className="character-qa-card" data-character-id={entry.id} key={entry.id}>
              <header><div><strong>{entry.id}</strong><span>{entry.category}</span></div><code>{entry.cohort}</code></header>
              <div className="character-qa-representations">
                {views.map(([label, direction, pose, movingRight]) => (
                  <figure key={label} data-static-pose={label.toLowerCase().replace(" ", "-")}>
                    <PixelAvatar avatar={avatar} label={`${entry.id} ${label}`} size="medium" representation="full" direction={direction} pose={pose} movingRight={movingRight} roleStyle={role} />
                    <figcaption>{label}</figcaption>
                  </figure>
                ))}
                {entry.clipboard ? (
                  <figure data-static-pose="clipboard-south">
                    <PixelAvatar avatar={avatar} label={`${entry.id} clipboard South`} size="medium" representation="full" direction="front" pose="interaction" roleStyle={role} />
                    <figcaption>Clipboard South</figcaption>
                  </figure>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
