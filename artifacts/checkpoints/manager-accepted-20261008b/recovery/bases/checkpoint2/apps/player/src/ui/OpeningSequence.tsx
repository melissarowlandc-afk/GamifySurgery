import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FounderIdentity,
} from "@gamify-surgery/game-domain";
import {
  clinicNameExists,
  normalizeClinicName,
  type LocalPrototypeProfile,
} from "../session/prototypeStorage";
import {
  FOUNDER_IDENTITY_PRESETS,
  createUnifiedFounderAppearance,
} from "../content/founderAppearancePresets";
import {
  readLastIntroTagline,
  selectIntroTagline,
  writeLastIntroTagline,
  type IntroTagline,
} from "../content/introTaglines";
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

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
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
  const [introTagline, setIntroTagline] = useState<IntroTagline | null>(
    () =>
      initialStep === "main"
        ? selectIntroTagline(readLastIntroTagline())
        : null,
  );
  const [founderName, setFounderName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [founderIdentityIndex, setFounderIdentityIndex] = useState(0);
  const initializingRef = useRef(false);
  const [initializing, setInitializing] = useState(false);
  const appearance = createUnifiedFounderAppearance(founderIdentityIndex);
  const trimmedFounderName = founderName.trim();
  const normalizedClinicName = normalizeClinicName(clinicName);
  const duplicateClinicName =
    normalizedClinicName.length > 0 &&
    clinicNameExists(profile, normalizedClinicName);
  const founder: FounderIdentity = {
    displayName: trimmedFounderName,
    headId: FOUNDER_IDENTITY_PRESETS[founderIdentityIndex]!.head.id,
    bodyId: FOUNDER_IDENTITY_PRESETS[founderIdentityIndex]!.body.id,
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

  useEffect(() => {
    if (step === "main" && introTagline) {
      writeLastIntroTagline(introTagline);
    }
  }, [introTagline, step]);

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
    setFounderIdentityIndex(0);
    initializingRef.current = false;
    setInitializing(false);
    setStep("founder");
  };

  const returnToCampaigns = () => {
    setIntroTagline(
      selectIntroTagline(introTagline ?? readLastIntroTagline()),
    );
    setStep("main");
  };

  if (step === "main") {
    return (
      <main className="opening-screen prototype-main-screen">
        <header className="opening-title-lockup">
          <span className="opening-wordmark">Stitchin&apos; Time</span>
          <div className="opening-tagline-slot">
            <p className="opening-tagline" data-testid="intro-tagline">
              {introTagline}
            </p>
          </div>
        </header>
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
          representation="full"
          animation="star-jump"
          roleStyle="founder"
          className="happy-founder-avatar"
        />
        <p className="happy-ending-copy">You are rich and happy.</p>
        <button
          className="opening-choice"
          type="button"
          onClick={returnToCampaigns}
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
          representation="full"
          roleStyle="founder"
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
            aria-label="Previous founder"
            onClick={() =>
              setFounderIdentityIndex((current) =>
                wrapIndex(current - 1, FOUNDER_IDENTITY_PRESETS.length),
              )
            }
          >
            &larr;
          </button>
          <span className="founder-preset-label">
            <b>{FOUNDER_IDENTITY_PRESETS[founderIdentityIndex]!.label}</b>
            <small>
              Founder {founderIdentityIndex + 1} of {FOUNDER_IDENTITY_PRESETS.length}
            </small>
          </span>
          <button
            type="button"
            className="founder-arrow"
            aria-label="Next founder"
            onClick={() =>
              setFounderIdentityIndex((current) =>
                wrapIndex(current + 1, FOUNDER_IDENTITY_PRESETS.length),
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
