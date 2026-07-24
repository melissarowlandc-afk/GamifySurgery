import {
  Rating,
  createEmptyCard,
  fsrs,
  type Card,
  type CardInput,
  type ReviewLog,
  type StepUnit,
} from "ts-fsrs";
import type { PrototypeBalanceRelease } from "@gamify-surgery/balance-config";
import type { ReviewRatingIntent } from "./types";
import type { SchedulerPins } from "./types";

export const FSRS_INTEGRATION_VERSION = "fsrs-adapter.v1" as const;
export const FSRS_LIBRARY_VERSION = "5.4.1" as const;
export const FSRS_ALGORITHM_VERSION = "FSRS-6" as const;

export function createSchedulerPins(
  parameterSetId: string,
): SchedulerPins {
  return {
    integrationVersion: FSRS_INTEGRATION_VERSION,
    libraryName: "ts-fsrs",
    libraryVersion: FSRS_LIBRARY_VERSION,
    algorithmVersion: FSRS_ALGORITHM_VERSION,
    parameterSetId,
  };
}

export function schedulerPinsMatch(
  pins: SchedulerPins,
  parameterSetId: string,
): boolean {
  return (
    pins.integrationVersion === FSRS_INTEGRATION_VERSION &&
    pins.libraryName === "ts-fsrs" &&
    pins.libraryVersion === FSRS_LIBRARY_VERSION &&
    pins.algorithmVersion === FSRS_ALGORITHM_VERSION &&
    pins.parameterSetId === parameterSetId
  );
}

/**
 * Project-owned persistence boundary around ts-fsrs.
 *
 * Dates are serialized as epoch milliseconds so campaign saves remain plain
 * JSON. The adapter is the only domain module that knows ts-fsrs' object
 * shapes, making a later library upgrade an explicit migration.
 */
export interface SerializedFsrsCard {
  dueAtMs: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReviewAtMs: number | null;
}

export interface SerializedFsrsReviewLog {
  rating: number;
  state: number;
  dueAtMs: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  lastElapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reviewedAtMs: number;
}

function serializeCard(card: Card): SerializedFsrsCard {
  return {
    dueAtMs: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReviewAtMs: card.last_review?.getTime() ?? null,
  };
}

function deserializeCard(card: SerializedFsrsCard): CardInput {
  return {
    due: new Date(card.dueAtMs),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    learning_steps: card.learningSteps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as CardInput["state"],
    last_review:
      card.lastReviewAtMs === null ? null : new Date(card.lastReviewAtMs),
  };
}

function serializeReviewLog(log: ReviewLog): SerializedFsrsReviewLog {
  return {
    rating: log.rating,
    state: log.state,
    dueAtMs: log.due.getTime(),
    stability: log.stability,
    difficulty: log.difficulty,
    elapsedDays: log.elapsed_days,
    lastElapsedDays: log.last_elapsed_days,
    scheduledDays: log.scheduled_days,
    learningSteps: log.learning_steps,
    reviewedAtMs: log.review.getTime(),
  };
}

function createScheduler(learning: PrototypeBalanceRelease["learning"]) {
  const againStep = `${learning.minimumAgainDelayMinutes}m` as StepUnit;
  return fsrs({
    request_retention: learning.requestedRetention,
    maximum_interval: learning.maximumIntervalDays,
    enable_fuzz: learning.enableFuzz,
    enable_short_term: true,
    learning_steps: [againStep],
    relearning_steps: [againStep],
  });
}

export function createNewFsrsCard(nowMs: number): SerializedFsrsCard {
  return createEmptyCard(new Date(nowMs), serializeCard);
}

export function applyFsrsReview(
  card: SerializedFsrsCard,
  ratingIntent: ReviewRatingIntent,
  reviewedAtMs: number,
  learning: PrototypeBalanceRelease["learning"],
): {
  card: SerializedFsrsCard;
  log: SerializedFsrsReviewLog;
} {
  const rating =
    ratingIntent === "Good" ? Rating.Good : Rating.Again;
  return createScheduler(learning).next(
    deserializeCard(card),
    new Date(reviewedAtMs),
    rating,
    ({ card: nextCard, log }) => ({
      card: serializeCard(nextCard),
      log: serializeReviewLog(log),
    }),
  );
}
