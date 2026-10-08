import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { createFreshProfile } from "../session/prototypeStorage";
import { OpeningSequence } from "./OpeningSequence";

describe("combined clinic opening", () => {
  const props = {profile: createFreshProfile(), onBeginClinic: () => undefined, onResumeCampaign: () => undefined, onRestoreCampaign: () => undefined};
  it("puts names, appearance, default-on guidance, actual cash and the happy branch in one form", () => {
    const markup = renderToStaticMarkup(<OpeningSequence {...props} initialStep="founder" />);
    expect(markup.match(/<form/g)).toHaveLength(1);
    for (const copy of ["Open Your Clinic", "Founder name", "Clinic name", "Guidance: On", "Grandpa left you options. You chose overhead.", "Be Rich and Happy"])
      expect(markup).toContain(copy);
    expect(markup).toContain(`Starting cash: $${PROTOTYPE_BALANCE_RELEASE.facility.startingCash.toLocaleString("en-US")}`);
    expect(markup).not.toContain("$1,000,000");
    expect(markup).not.toContain("Build a Surgery Clinic");
    expect(markup).not.toContain(">Continue<");
    expect(markup).toContain('type="submit" disabled=""');
    expect(props.profile.campaigns).toHaveLength(0);
  });
  it("honors an explicit opening preference without a separate choice screen", () => {
    expect(renderToStaticMarkup(<OpeningSequence {...props} initialStep="founder" initialGuidanceEnabled={false} />)).toContain("Guidance: Off");
    expect(renderToStaticMarkup(<OpeningSequence {...props} initialStep="main" />)).toContain("New Campaign");
  });
});
