import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HELP_TOPICS, HelpDialog, HelpReferenceTopic } from "./HelpDialog";

describe("compact clinic Help", () => {
  it("offers six topics and safe current/new-clinic guidance entry points", () => {
    const markup = renderToStaticMarkup(<HelpDialog paused={false} onTogglePause={() => undefined}
      onShowGuidance={() => undefined} onReplayFirstShift={() => undefined} />);
    expect(HELP_TOPICS.map((topic) => topic.title)).toEqual(["Find a patient", "Finish a chart", "Time & waiting", "Build & access", "Goals", "Save & campaigns"]);
    for (const topic of HELP_TOPICS) expect(markup).toContain(topic.title.replace(/&/g, "&amp;"));
    expect(markup).toContain("Show guidance here");
    expect(markup).toContain("Replay first shift in a new clinic");
    expect(markup).toContain("Your current clinic stays saved.");
    expect(markup).not.toContain("Prototype tools");
    expect(markup).not.toContain("Got It");
    expect(markup).not.toContain('aria-modal="true"'); // Hidden reference must not block chart keys.
  });
  it("keeps chart filing, optional reference, keyboard, pause and origin facts available by topic", () => {
    const markup = HELP_TOPICS.map((topic) => renderToStaticMarkup(<HelpReferenceTopic topic={topic} />)).join("");
    expect(markup).toContain("Enact Corrected Plan");
    expect(markup).toContain("1–9 selects an answer");
    expect(markup).toContain("Tips never pause");
    expect(markup).toContain("Mistakes still count");
    expect(markup).toContain("http://127.0.0.1:4173");
    expect(markup).not.toContain("secretary");
  });
});
