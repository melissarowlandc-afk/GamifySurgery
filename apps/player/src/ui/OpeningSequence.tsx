import { useMemo, useRef, useState } from "react";
import type {
  FounderIdentity,
  PixelAppearanceDescriptor,
} from "@gamify-surgery/game-domain";
import {
  clinicNameExists,
  normalizeClinicName,
  type LocalPrototypeProfile,
} from "../session/prototypeStorage";
import { PixelAvatar } from "./PixelAvatar";
import "./OpeningSequence.css";

interface OpeningSequenceProps {
  profile: LocalPrototypeProfile;
  campaignSeed?: string;
  initialStep?: "main" | "founder";
  onBeginClinic: (
    founder: FounderIdentity,
    clinicName: string,
    campaignSeed?: string,
  ) => void;
  onResumeCampaign: (campaignId: string) => void;
  onRestoreCampaign: (campaignId: string) => void;
}

type OpeningStep =
  | "main"
  | "founder"
  | "inheritance"
  | "clinic-name"
  | "happy";

type HeadPreset = {
  id: string;
} & Pick<
  PixelAppearanceDescriptor,
  "hairStyle" | "hairShade" | "faceStyle" | "accessory"
>;

type BodyPreset = {
  id: string;
} & Pick<
  PixelAppearanceDescriptor,
  "bodyShape" | "outfitStyle" | "outfitShade"
>;

const HEAD_PRESETS = [
  { id: "head.01", hairStyle: "short", hairShade: 3, faceStyle: "round", accessory: "none" },
  { id: "head.02", hairStyle: "parted", hairShade: 2, faceStyle: "square", accessory: "glasses" },
  { id: "head.03", hairStyle: "curly", hairShade: 1, faceStyle: "long", accessory: "none" },
  { id: "head.04", hairStyle: "bun", hairShade: 3, faceStyle: "round", accessory: "headband" },
  { id: "head.05", hairStyle: "none", hairShade: 0, faceStyle: "square", accessory: "glasses" },
  { id: "head.06", hairStyle: "short", hairShade: 1, faceStyle: "long", accessory: "badge" },
  { id: "head.07", hairStyle: "parted", hairShade: 3, faceStyle: "round", accessory: "none" },
  { id: "head.08", hairStyle: "curly", hairShade: 2, faceStyle: "square", accessory: "headband" },
  { id: "head.09", hairStyle: "bun", hairShade: 1, faceStyle: "long", accessory: "glasses" },
  { id: "head.10", hairStyle: "none", hairShade: 0, faceStyle: "round", accessory: "badge" },
] as const satisfies readonly HeadPreset[];

const BODY_PRESETS = [
  { id: "body.01", bodyShape: "average", outfitStyle: "plain", outfitShade: 1 },
  { id: "body.02", bodyShape: "compact", outfitStyle: "striped", outfitShade: 2 },
  { id: "body.03", bodyShape: "broad", outfitStyle: "checked", outfitShade: 3 },
  { id: "body.04", bodyShape: "tall", outfitStyle: "coat", outfitShade: 2 },
  { id: "body.05", bodyShape: "compact", outfitStyle: "plain", outfitShade: 3 },
  { id: "body.06", bodyShape: "average", outfitStyle: "coat", outfitShade: 1 },
  { id: "body.07", bodyShape: "broad", outfitStyle: "striped", outfitShade: 1 },
  { id: "body.08", bodyShape: "tall", outfitStyle: "checked", outfitShade: 2 },
  { id: "body.09", bodyShape: "average", outfitStyle: "checked", outfitShade: 3 },
  { id: "body.10", bodyShape: "compact", outfitStyle: "coat", outfitShade: 2 },
] as const satisfies readonly BodyPreset[];

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

function createAppearance(
  headIndex: number,
  bodyIndex: number,
): PixelAppearanceDescriptor {
  return {
    version: "pixel-avatar.v1",
    hairStyle: HEAD_PRESETS[headIndex]!.hairStyle,
    hairShade: HEAD_PRESETS[headIndex]!.hairShade,
    faceStyle: HEAD_PRESETS[headIndex]!.faceStyle,
    accessory: HEAD_PRESETS[headIndex]!.accessory,
    bodyShape: BODY_PRESETS[bodyIndex]!.bodyShape,
    outfitStyle: BODY_PRESETS[bodyIndex]!.outfitStyle,
    outfitShade: BODY_PRESETS[bodyIndex]!.outfitShade,
  };
}

export function OpeningSequence({
  profile,
  campaignSeed,
  initialStep = "main",
  onBeginClinic,
  onResumeCampaign,
  onRestoreCampaign,
}: OpeningSequenceProps) {
  const [step, setStep] = useState<OpeningStep>(initialStep);
  const [founderName, setFounderName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [headIndex, setHeadIndex] = useState(0);
  const [bodyIndex, setBodyIndex] = useState(0);
  const initializingRef = useRef(false);
  const [initializing, setInitializing] = useState(false);
  const appearance = createAppearance(headIndex, bodyIndex);
  const trimmedFounderName = founderName.trim();
  const normalizedClinicName = normalizeClinicName(clinicName);
  const duplicateClinicName =
    normalizedClinicName.length > 0 &&
    clinicNameExists(profile, normalizedClinicName);
  const founder: FounderIdentity = {
    displayName: trimmedFounderName,
    headId: HEAD_PRESETS[headIndex]!.id,
    bodyId: BODY_PRESETS[bodyIndex]!.id,
    appearance,
  };
  const resumableCampaigns = useMemo(
    () =>
      profile.campaigns
        .filter((campaign) => campaign.status === "resumable")
        .sort((left, right) => right.updatedAtRealMs - left.updatedAtRealMs),
    [profile.campaigns],
  );
  const archivedCampaigns = useMemo(
    () =>
      profile.campaigns
        .filter((campaign) => campaign.status === "archived")
        .sort((left, right) => right.updatedAtRealMs - left.updatedAtRealMs),
    [profile.campaigns],
  );

  const beginClinic = () => {
    if (
      initializingRef.current ||
      trimmedFounderName.length === 0 ||
      normalizedClinicName.length === 0 ||
      duplicateClinicName
    ) {
      return;
    }
    initializingRef.current = true;
    setInitializing(true);
    onBeginClinic(founder, normalizedClinicName, campaignSeed);
  };

  const beginFreshFounder = () => {
    setFounderName("");
    setClinicName("");
    setHeadIndex(0);
    setBodyIndex(0);
    initializingRef.current = false;
    setInitializing(false);
    setStep("founder");
  };

  if (step === "main") {
    return (
      <main className="opening-screen prototype-main-screen">
        <span className="opening-wordmark">Gamify Surgery</span>
        <h1>Clinic Campaigns</h1>
        <div className="prototype-main-actions">
          {resumableCampaigns.length === 1 ? (
            <button
              className="opening-choice"
              type="button"
              onClick={() =>
                onResumeCampaign(resumableCampaigns[0]!.campaignId)
              }
            >
              Resume {resumableCampaigns[0]!.name}
            </button>
          ) : resumableCampaigns.length > 1 ? (
            <section className="opening-campaign-list" aria-label="Clinics">
              <h2>Resume Clinic</h2>
              {resumableCampaigns.map((campaign) => (
                <button
                  className="opening-choice"
                  type="button"
                  key={campaign.campaignId}
                  onClick={() => onResumeCampaign(campaign.campaignId)}
                >
                  {campaign.name}
                </button>
              ))}
            </section>
          ) : null}
          <button
            className="opening-choice opening-choice-primary"
            type="button"
            onClick={beginFreshFounder}
          >
            New Campaign
          </button>
        </div>
        {archivedCampaigns.length > 0 ? (
          <details className="archived-campaigns">
            <summary>Archived Clinics ({archivedCampaigns.length})</summary>
            <div className="opening-campaign-list">
              {archivedCampaigns.map((campaign) => (
                <button
                  className="opening-choice"
                  type="button"
                  key={campaign.campaignId}
                  onClick={() => onRestoreCampaign(campaign.campaignId)}
                >
                  Restore {campaign.name}
                </button>
              ))}
            </div>
          </details>
        ) : null}
      </main>
    );
  }

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
            onClick={() => setStep("clinic-name")}
            disabled={initializing}
          >
            Build a Surgery Clinic
          </button>
        </div>
      </main>
    );
  }

  if (step === "clinic-name") {
    return (
      <main className="opening-screen clinic-name-screen">
        <section className="founder-creator" aria-labelledby="clinic-name-title">
          <span className="eyebrow">An irreversible commitment to overhead</span>
          <h1 id="clinic-name-title">Name Your Clinic</h1>
          <label className="founder-name-field">
            <span>Clinic name</span>
            <input
              autoFocus
              maxLength={80}
              value={clinicName}
              onChange={(event) => setClinicName(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  normalizedClinicName.length > 0 &&
                  !duplicateClinicName
                ) {
                  beginClinic();
                }
              }}
            />
          </label>
          {duplicateClinicName ? (
            <p className="opening-form-error" role="alert">
              That clinic name already exists in town.
            </p>
          ) : null}
          <button
            className="opening-choice founder-continue"
            type="button"
            disabled={
              initializing ||
              normalizedClinicName.length === 0 ||
              duplicateClinicName
            }
            onClick={beginClinic}
          >
            {initializing ? "Opening clinic..." : "Open the Clinic"}
          </button>
        </section>
      </main>
    );
  }

  if (step === "happy") {
    return (
      <main className="opening-screen happy-ending-screen">
        <PixelAvatar
          avatar={appearance}
          label={`${trimmedFounderName}, rich and happy`}
          size="large"
          className="happy-founder-avatar"
        />
        <p className="happy-ending-copy">You are rich and happy.</p>
        <button
          className="opening-choice"
          type="button"
          onClick={() => setStep("main")}
        >
          Return to Campaigns
        </button>
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
            trimmedFounderName.length > 0
              ? `${trimmedFounderName}, founder preview`
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
              if (
                event.key === "Enter" &&
                trimmedFounderName.length > 0
              ) {
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
            &larr;
          </button>
          <span>Head {headIndex + 1} of 10</span>
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
            &rarr;
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
            &larr;
          </button>
          <span>Body {bodyIndex + 1} of 10</span>
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
            &rarr;
          </button>
        </div>
        <button
          className="opening-choice founder-continue"
          type="button"
          disabled={trimmedFounderName.length === 0}
          onClick={() => setStep("inheritance")}
        >
          Continue
        </button>
      </section>
    </main>
  );
}
