import {
  GRAVES_CASES,
  GRAVES_CLAIMS,
  GRAVES_CONCEPTS,
  GRAVES_SOURCES,
  GRAVES_VARIANTS,
} from "./graves";
import {
  NEW_BATCH_AUTHORING_CONCEPTS,
  NEW_BATCH_CASES,
  NEW_BATCH_CASE_REVIEWS,
  NEW_BATCH_CLAIMS,
  NEW_BATCH_CONCEPTS,
  NEW_BATCH_QUESTIONS,
  NEW_BATCH_SERVICE_CONTRACTS,
  NEW_BATCH_SOURCES,
} from "./new-clinical-batch";

export const TWENTY_CONCEPT_BATCH_CONCEPTS = [...GRAVES_CONCEPTS, ...NEW_BATCH_CONCEPTS];
export const OWNER_DELEGATED_NEW_AUTHORING_CONCEPTS = NEW_BATCH_AUTHORING_CONCEPTS;
export const TWENTY_CONCEPT_BATCH_QUESTIONS = [...GRAVES_VARIANTS, ...NEW_BATCH_QUESTIONS];
export const TWENTY_CONCEPT_BATCH_CASES = [...GRAVES_CASES, ...NEW_BATCH_CASES];
export const TWENTY_CONCEPT_BATCH_SOURCES = [...GRAVES_SOURCES, ...NEW_BATCH_SOURCES];
export const TWENTY_CONCEPT_BATCH_CLAIMS = [...GRAVES_CLAIMS, ...NEW_BATCH_CLAIMS];
export const OWNER_DELEGATED_NEW_CASE_REVIEWS = NEW_BATCH_CASE_REVIEWS;
export const TWENTY_CONCEPT_BATCH_SERVICE_CONTRACTS = NEW_BATCH_SERVICE_CONTRACTS;

export const TWENTY_CONCEPT_BATCH_MANIFEST = {
  contentVersion: "development-batch.2026-09-09.1",
  conceptCount: 20,
  questionVariantCount: 80,
  caseCount: 52,
  multistepCaseCount: 24,
  resultGateCount: 28,
  originalClinicianReviewedConceptCount: 6,
  ownerDelegatedNeedsClinicianReviewConceptCount: 14,
  admissionScope: "local_owner_development_preview",
  publicReleaseAuthorized: false,
} as const;
