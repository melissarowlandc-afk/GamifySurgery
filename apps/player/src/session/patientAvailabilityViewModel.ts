import {
  PROTOTYPE_DOMAIN_CONTEXT,
  getEmployeeDiscussionLists,
  getPatientLists,
  getRoutinePatientAvailability,
  type DomainContext,
  type GameState,
} from "@gamify-surgery/game-domain";

let reviewDateTimeFormatter: Intl.DateTimeFormat | undefined;

function formatReviewDateTime(timestamp: number): string {
  reviewDateTimeFormatter ??= new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
  return reviewDateTimeFormatter.format(new Date(timestamp));
}

/** A quiet empty-folder explanation; all clocks and eligibility remain unchanged. */
export function createPatientAvailabilityGuidance(
  state: GameState,
  asOfRealMs: number,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): string | null {
  if (
    state.facilityLevel < 1 ||
    getPatientLists(state).waiting.length > 0 ||
    getEmployeeDiscussionLists(state).waiting.length > 0
  ) {
    return null;
  }

  const availability = getRoutinePatientAvailability(state, asOfRealMs, context);
  switch (availability.reason) {
    case "paused":
      return "The clinic is paused. Resume facility time when you're ready to continue.";
    case "at_capacity":
      return "New visits are paused while the clinic is at capacity. Continue current visits to make room.";
    case "arrival_scheduled":
    case "available":
      return "No new patients waiting. Keep the clinic running for the next eligible visit.";
    case "in_progress":
      if (availability.pendingEncounterCount > 0) {
        return "Some patients are waiting on tests. Keep the clinic running and check Existing Patients when results return.";
      }
      return availability.activeEncounterCount > 0
        ? "Current patients are still checking in or receiving care. Continue any available chart in Existing Patients, or keep the clinic running."
        : "A team discussion is still in progress. Continue it in Existing Patients.";
    case "reviews_scheduled":
      return `Next review eligibility: ${formatReviewDateTime(availability.nextReviewAtRealMs!)} (real-world time). You can pause the clinic and return later; arrival timing can vary.`;
    case "capabilities_unavailable":
      return "No new patient visits are available with the clinic's current rooms and staff. Check your rooms, staff, and Goals.";
    case "content_unavailable":
      return "No new patient visits are available for this clinic right now. Check Existing Patients and Goals for your next step.";
  }
}
