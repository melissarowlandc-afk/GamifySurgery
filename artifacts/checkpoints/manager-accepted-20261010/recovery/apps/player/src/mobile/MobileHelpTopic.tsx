import { HELP_TOPICS } from "../ui/HelpDialog";

const PHONE_CONTROLS: Partial<Record<typeof HELP_TOPICS[number]["id"], string>> = {
  charts: "Tap a checked-in patient on the map to open their chart, or tap a pediatric parent for the child's chart. Tap a full-width answer choice. The pinned bottom button enacts or files the visit. Close and browser Back use the same guarded chart action. Pause, Play and Speed remain in the top bar.",
  build: "Open Build, choose a room card, then drag the ghost and tap ✓ Place. Two fingers pan or pinch. Rotate and Cancel sit beside Place. In Doors mode, tap a legal wall to add a door or an existing door to remove it. Undo restores a removed door. Room catalog or another tool exits Doors; Done checks access before leaving Build. Tap a built room for Move, Upgrade or Sell.",
  goals: "Tap Goals to review progress. When ready, the chip becomes Advance; one tap advances the clinic. More > Goals keeps the requirements available.",
  time: "The darker Pause or Play button shows the current state. Tap either to choose it; Speed cycles 1×, 2× and 4×. Pinch to zoom the map, drag to pan, and tap ⌖ to recenter. Tap floor or a free seat to move the founder. GLP-1 consult fills with facility time; tap the full chip to complete a consult. More > GLP-1 consult info shows the cooldown and details.",
};

export function MobileHelpTopic({ topic }: { topic: typeof HELP_TOPICS[number] }) {
  return <section className="help-topic-detail" aria-label={topic.title}>
    <h3>{topic.title}</h3><p>{topic.body.replace(/Open the patient tab/g, "Open Patients").replace(/click/gi, "tap")}</p>
    {PHONE_CONTROLS[topic.id] ? <p>{PHONE_CONTROLS[topic.id]}</p> : "controls" in topic ? <p>{topic.controls}</p> : null}
  </section>;
}
