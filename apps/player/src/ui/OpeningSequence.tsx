import { AccountMenu } from "./AccountMenu";
import { ClinicalContentNotice } from "./ClinicalContentNotice";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FounderIdentity,
} from "@gamify-surgery/game-domain";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import {
  clinicNameExists,
  normalizeClinicName,
  type LocalPrototypeProfile,
} from "../session/prototypeStorage";
import {
  FOUNDER_AVATAR_CHOICES,
  createFounderAvatarAppearance,
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
  initialGuidanceEnabled?: boolean;
  onBeginClinic: (
    founder: FounderIdentity,
    clinicName: string,
    campaignSeed?: string,
    guidanceEnabled?: boolean,
  ) => void;
  onResumeCampaign: (campaignId: string) => void;
  onRestoreCampaign: (campaignId: string) => void;
}

type OpeningStep =
  | "main"
  | "founder"
  | "happy";

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

export function OpeningSequence({
  profile,
  campaignSeed,
  initialStep = "main",
  initialGuidanceEnabled = true,
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
  const [guidanceEnabled, setGuidanceEnabled] = useState(initialGuidanceEnabled);
  const [founderIdentityIndex, setFounderIdentityIndex] = useState(0);
  const initializingRef = useRef(false);
  const [initializing, setInitializing] = useState(false);
  const appearance = createFounderAvatarAppearance(founderIdentityIndex);
  const founderChoice = FOUNDER_AVATAR_CHOICES[founderIdentityIndex]!;
  const trimmedFounderName = founderName.trim();
  const normalizedClinicName = normalizeClinicName(clinicName);
  const duplicateClinicName =
    normalizedClinicName.length > 0 &&
    clinicNameExists(profile, normalizedClinicName);
  const founder: FounderIdentity = {
    displayName: trimmedFounderName,
    headId: founderChoice.head.id,
    bodyId: founderChoice.body.id,
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
    onBeginClinic(founder, normalizedClinicName, campaignSeed, guidanceEnabled);
  };

  const beginFreshFounder = () => {
    setFounderName("");
    setGuidanceEnabled(initialGuidanceEnabled);
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
        <div className="opening-beta-info"><ClinicalContentNotice /><AccountMenu /></div>
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

  if (step === "happy") {
    return (
      <main className="opening-screen happy-ending-screen">
        <div className="opening-beta-info"><ClinicalContentNotice /><AccountMenu /></div>
        <PixelAvatar
          avatar={appearance}
          label={`${trimmedFounderName}, rich and happy`}
          size="large"
          representation="full"
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
      <form className="founder-creator" aria-labelledby="founder-title" onSubmit={(event) => { event.preventDefault(); beginClinic(); }}>
        <div className="opening-beta-info"><ClinicalContentNotice /><AccountMenu /></div>
        <h1 id="founder-title">Open Your Clinic</h1>
        <p className="opening-overhead-copy">Grandpa left you options. You chose overhead.</p>
        <p className="opening-starting-cash">Starting cash: ${PROTOTYPE_BALANCE_RELEASE.facility.startingCash.toLocaleString("en-US")}</p>
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
          />
        </label>
        <div className="founder-preset-row">
          <button
            type="button"
            className="founder-arrow"
            aria-label="Previous founder"
            onClick={() =>
              setFounderIdentityIndex((current) =>
                wrapIndex(current - 1, FOUNDER_AVATAR_CHOICES.length),
              )
            }
          >
            &larr;
          </button>
          <span className="founder-preset-label">
            <b>{founderChoice.label}</b>
            <small>
              Founder {founderIdentityIndex + 1} of {FOUNDER_AVATAR_CHOICES.length}
            </small>
          </span>
          <button
            type="button"
            className="founder-arrow"
            aria-label="Next founder"
            onClick={() =>
              setFounderIdentityIndex((current) =>
                wrapIndex(current + 1, FOUNDER_AVATAR_CHOICES.length),
              )
            }
          >
            &rarr;
          </button>
        </div>
        <label className="founder-name-field">
          <span>Clinic name</span>
          <input maxLength={80} value={clinicName} onChange={(event) => setClinicName(event.target.value)} />
        </label>
        {duplicateClinicName ? <p className="opening-form-error" role="alert">That clinic name already exists in town.</p> : null}
        <label className="opening-guidance-preference">
          <input type="checkbox" aria-label="First-shift guidance" checked={guidanceEnabled} onChange={(event) => setGuidanceEnabled(event.target.checked)} />
          <span>Guidance: {guidanceEnabled ? "On" : "Off"}</span>
        </label>
        <button className="opening-choice founder-continue" type="submit"
          disabled={initializing || trimmedFounderName.length === 0 || normalizedClinicName.length === 0 || duplicateClinicName}>
          {initializing ? "Opening clinic..." : "Open the Clinic"}
        </button>
        <button className="text-button" type="button" disabled={initializing || trimmedFounderName.length === 0} onClick={() => setStep("happy")}>Be Rich and Happy</button>
        <button className="text-button" type="button" onClick={returnToCampaigns}>Return to Campaigns</button>
      </form>
    </main>
  );
}
