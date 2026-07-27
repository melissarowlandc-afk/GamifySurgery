import { useState } from "react";
import type { CampaignListItemView } from "./types";

interface CampaignManagerProps {
  campaigns: CampaignListItemView[];
  onCreateCampaign: () => void;
  onSwitchCampaign: (campaignId: string) => void;
}

function formatCreatedAt(createdAtRealMs: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAtRealMs));
}

export function CampaignManager({
  campaigns,
  onCreateCampaign,
  onSwitchCampaign,
}: CampaignManagerProps) {
  const [open, setOpen] = useState(false);
  const activeCampaign = campaigns.find((campaign) => campaign.active);
  const resumableCampaigns = campaigns.filter(
    (campaign) => campaign.status === "resumable",
  );
  const archivedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "archived",
  );

  return (
    <>
      <button
        className="text-button"
        type="button"
        onClick={() => setOpen(true)}
      >
        Campaigns ({campaigns.length})
      </button>
      {open ? (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog campaign-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaigns-title"
          >
            <span className="eyebrow">Stored in this browser only</span>
            <h2 id="campaigns-title">Clinic campaigns</h2>
            <p>
              Each campaign has its own facility and FSRS learning history.
              Opening or creating one never transfers mastery from another.
            </p>

            <div className="campaign-list">
              {resumableCampaigns.map((campaign) => (
                <article
                  className={`campaign-card${
                    campaign.active ? " is-active" : ""
                  }`}
                  key={campaign.campaignId}
                >
                  <div className="campaign-card-heading">
                    <strong>{campaign.name}</strong>
                    <span>
                      {campaign.active ? "Current" : "Saved"}
                    </span>
                  </div>
                  <dl>
                    <div>
                      <dt>Created</dt>
                      <dd>{formatCreatedAt(campaign.createdAtRealMs)}</dd>
                    </div>
                    <div>
                      <dt>Progress</dt>
                      <dd>
                        Level {campaign.facilityLevel} ·{" "}
                        {campaign.fsrsReviewCount} scored FSRS review
                        {campaign.fsrsReviewCount === 1 ? "" : "s"}
                      </dd>
                    </div>
                    <div>
                      <dt>ID</dt>
                      <dd>{campaign.campaignId}</dd>
                    </div>
                  </dl>
                  {!campaign.active ? (
                    <button
                      className="button button-secondary button-wide"
                      type="button"
                      onClick={() => {
                        onSwitchCampaign(campaign.campaignId);
                        setOpen(false);
                      }}
                    >
                      Open {campaign.name}
                    </button>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="dialog-actions campaign-dialog-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  onCreateCampaign();
                  setOpen(false);
                }}
              >
                Create fresh campaign
              </button>
            </div>
            <p className="campaign-dialog-footnote">
              {activeCampaign
                ? `${activeCampaign.name} is open.`
                : "No campaign is currently open."}{" "}
              Prototype access currently stores these clinics in this browser.
            </p>
            {archivedCampaigns.length > 0 ? (
              <p className="campaign-dialog-footnote">
                {archivedCampaigns.length} archived clinic
                {archivedCampaigns.length === 1 ? "" : "s"} can be restored
                from the Campaign screen.
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
