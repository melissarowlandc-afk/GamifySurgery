import { useRef, useState } from "react";
import type {
  FounderIdentity,
  PixelAppearanceDescriptor,
} from "@gamify-surgery/game-domain";
import type { LocalPrototypeProfile } from "../session/prototypeStorage";
import { PixelAvatar } from "./PixelAvatar";
import "./OpeningSequence.css";

interface OpeningSequenceProps {
  profile: LocalPrototypeProfile;
  campaignSeed?: string;
  onBeginClinic: (founder: FounderIdentity, campaignSeed?: string) => void;
  onResumeCampaign: () => void;
}

type OpeningStep = "founder" | "inheritance" | "happy" | "main";

const HEAD_PRESETS = [
  {
    hairStyle: "short",
    hairShade: 3,
    faceStyle: "round",
    accessory: "none",
  },
  {
    hairStyle: "parted",
    hairShade: 2,
    faceStyle: "square",
    accessory: "glasses",
  },
  {
    hairStyle: "curly",
    hairShade: 1,
    faceStyle: "long",
    accessory: "none",
  },
  {
    hairStyle: "bun",
    hairShade: 3,
    faceStyle: "round",
    accessory: "headband",
  },
] as const satisfies readonly Pick<
  PixelAppearanceDescriptor,
  "hairStyle" | "hairShade" | "faceStyle" | "accessory"
>[];

const BODY_PRESETS = [
  {
    bodyShape: "average",
    outfitStyle: "plain",
    outfitShade: 1,
  },
  {
    bodyShape: "compact",
    outfitStyle: "striped",
    outfitShade: 2,
  },
  {
    bodyShape: "broad",
    outfitStyle: "checked",
    outfitShade: 3,
  },
  {
    bodyShape: "tall",
    outfitStyle: "coat",
    outfitShade: 2,
  },
] as const satisfies readonly Pick<
  PixelAppearanceDescriptor,
  "bodyShape" | "outfitStyle" | "outfitShade"
>[];

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

function createAppearance(
  headIndex: number,
  bodyIndex: number,
): PixelAppearanceDescriptor {
  return {
    version: "pixel-avatar.v1",
    ...HEAD_PRESETS[headIndex]!,
    ...BODY_PRESETS[bodyIndex]!,
  };
}

export function OpeningSequence({
  profile,
  campaignSeed,
  onBeginClinic,
  onResumeCampaign,
}: OpeningSequenceProps) {
  const [step, setStep] = useState<OpeningStep>("founder");
  const [founderName, setFounderName] = useState("");
  const [headIndex, setHeadIndex] = useState(0);
  const [bodyIndex, setBodyIndex] = useState(0);
  const initializingRef = useRef(false);
  const [initializing, setInitializing] = useState(false);
  const appearance = createAppearance(headIndex, bodyIndex);
  const trimmedName = founderName.trim();
  const founder: FounderIdentity = {
    displayName: trimmedName,
    appearance,
  };

  const beginClinic = () => {
    if (initializingRef.current || trimmedName.length === 0) {
      return;
    }
    initializingRef.current = true;
    setInitializing(true);
    onBeginClinic(founder, campaignSeed);
  };

  if (step === "inheritance") {
    return (
      <main className="opening-screen inheritance-screen">
        <div className="inheritance-copy">
          <p>Your rich grandpa died.</p>
          <p>He left you $1,000,000.</p>
        </div>
        <div className="inheritance-actions">
          <button
            className="opening-choice"
            type="button"
            onClick={() => setStep("happy")}
            disabled={initializing}
          >
            Be Rich and Happy
          </button>
          <button
            className="opening-choice"
            type="button"
            onClick={beginClinic}
            disabled={initializing}
          >
            Build a Surgery Clinic
          </button>
        </div>
      </main>
    );
  }

  if (step === "happy") {
    return (
      <main className="opening-screen happy-ending-screen">
        <PixelAvatar
          avatar={appearance}
          label={`${trimmedName}, rich and happy`}
          size="large"
          className="happy-founder-avatar"
        />
        <p className="happy-ending-copy">You are rich and happy.</p>
        <button
          className="opening-choice"
          type="button"
          onClick={() => setStep("main")}
        >
          Return to Main Screen
        </button>
      </main>
    );
  }

  if (step === "main") {
    const activeCampaign = profile.campaigns.find(
      (campaign) => campaign.campaignId === profile.activeCampaignId,
    );
    return (
      <main className="opening-screen prototype-main-screen">
        <h1>Gamify Surgery</h1>
        <div className="prototype-main-actions">
          {activeCampaign ? (
            <button
              className="opening-choice"
              type="button"
              onClick={onResumeCampaign}
            >
              Resume {activeCampaign.name}
            </button>
          ) : null}
          <button
            className="opening-choice"
            type="button"
            onClick={() => {
              setFounderName("");
              setHeadIndex(0);
              setBodyIndex(0);
              initializingRef.current = false;
              setInitializing(false);
              setStep("founder");
            }}
          >
            New Campaign
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="opening-screen founder-creator-screen">
      <section className="founder-creator" aria-labelledby="founder-title">
        <h1 id="founder-title">Create Your Founder</h1>
        <PixelAvatar
          avatar={appearance}
          label={
            trimmedName.length > 0
              ? `${trimmedName}, founder preview`
              : "Founder preview"
          }
          size="large"
          className="founder-preview-avatar"
        />
        <label className="founder-name-field">
          <span>Founder name</span>
          <input
            autoFocus
            maxLength={60}
            value={founderName}
            onChange={(event) => setFounderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && trimmedName.length > 0) {
                setStep("inheritance");
              }
            }}
          />
        </label>
        <div className="founder-preset-row">
          <button
            type="button"
            className="founder-arrow"
            aria-label="Previous head"
            onClick={() =>
              setHeadIndex((current) =>
                wrapIndex(current - 1, HEAD_PRESETS.length),
              )
            }
          >
            ←
          </button>
          <span>Head {headIndex + 1}</span>
          <button
            type="button"
            className="founder-arrow"
            aria-label="Next head"
            onClick={() =>
              setHeadIndex((current) =>
                wrapIndex(current + 1, HEAD_PRESETS.length),
              )
            }
          >
            →
          </button>
        </div>
        <div className="founder-preset-row">
          <button
            type="button"
            className="founder-arrow"
            aria-label="Previous body"
            onClick={() =>
              setBodyIndex((current) =>
                wrapIndex(current - 1, BODY_PRESETS.length),
              )
            }
          >
            ←
          </button>
          <span>Body {bodyIndex + 1}</span>
          <button
            type="button"
            className="founder-arrow"
            aria-label="Next body"
            onClick={() =>
              setBodyIndex((current) =>
                wrapIndex(current + 1, BODY_PRESETS.length),
              )
            }
          >
            →
          </button>
        </div>
        <button
          className="opening-choice founder-continue"
          type="button"
          disabled={trimmedName.length === 0}
          onClick={() => setStep("inheritance")}
        >
          Continue
        </button>
      </section>
    </main>
  );
}
