import { useId } from "react";
import type { CloudCampaignSummary } from "../session/cloud/transport";
import { campaignSavedTime } from "./campaignSavedTime";

/** The whole row is the same Resume action; this component owns no save logic. */
export function CampaignChoices({ campaigns, levels, disabled, reasonId, onOpen }: {
  campaigns: readonly CloudCampaignSummary[];
  levels: Readonly<Record<string, number | null>>;
  disabled: boolean;
  reasonId?: string;
  onOpen(campaignId: string): void;
}) {
  const id = useId();
  return <section className="cloud-campaign-choices" aria-label="Resume a previous campaign" data-campaign-count={campaigns.length}>
    {campaigns.map((campaign, index) => {
      const level = levels[JSON.stringify([campaign.campaignId, campaign.revision])], descriptionId = `${id}-campaign-${index}`;
      const saved = new Date(campaign.acceptedAtMs), validDate = Number.isFinite(saved.getTime());
      return <button type="button" className="cloud-clinic-row" key={campaign.campaignId} aria-label={`Resume ${campaign.name}`}
        aria-describedby={[descriptionId, ...(reasonId ? [reasonId] : [])].join(" ")} disabled={disabled} onClick={() => onOpen(campaign.campaignId)}>
        <span className="cloud-clinic-info"><strong className="cloud-clinic-name">{campaign.name}</strong>
          <span className="cloud-clinic-meta" id={descriptionId}>
            {level === undefined || level === null ? null : <>Level {level} · </>}{validDate ?
              <time dateTime={saved.toISOString()} title={saved.toLocaleString()}>{campaignSavedTime(campaign.acceptedAtMs)}</time> : campaignSavedTime(NaN)}
            {campaign.status === "archived" ? " · Archived" : ""}{campaign.writerActive ? " · Open elsewhere" : ""}
          </span>
        </span>
        <span className="cloud-clinic-arrow" aria-hidden="true">›</span>
      </button>;
    })}
  </section>;
}
