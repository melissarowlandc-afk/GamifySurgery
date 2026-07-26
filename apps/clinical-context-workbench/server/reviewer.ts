const STABLE_ID = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

export const REVIEWER_ROLES = [
  "owner",
  "developer",
  "clinical_reviewer",
  "rights_reviewer",
  "administrator",
] as const;

export type ReviewerRole = (typeof REVIEWER_ROLES)[number];

export const EXPERT_OPINION_ACCEPTOR_ROLES = [
  "owner",
  "clinical_reviewer",
] as const satisfies readonly ReviewerRole[];

export type LocalReviewerProfile = {
  id: string;
  role: ReviewerRole;
  configuredExplicitly: boolean;
};

export type ReviewerEnvironment = {
  CLINICAL_WORKBENCH_REVIEWER_ID?: string;
  CLINICAL_WORKBENCH_REVIEWER_ROLE?: string;
};

const DEFAULT_REVIEWER_ID = "reviewer.local.owner";
const DEFAULT_REVIEWER_ROLE: ReviewerRole = "owner";

export function canAcceptExpertOpinion(role: ReviewerRole): boolean {
  return EXPERT_OPINION_ACCEPTOR_ROLES.some(
    (allowedRole) => allowedRole === role,
  );
}

export function resolveLocalReviewerProfile(
  environment: ReviewerEnvironment,
): LocalReviewerProfile {
  const rawId = environment.CLINICAL_WORKBENCH_REVIEWER_ID?.trim() ?? "";
  const rawRole =
    environment.CLINICAL_WORKBENCH_REVIEWER_ROLE?.trim() ?? "";
  const id = rawId || DEFAULT_REVIEWER_ID;
  const role = (rawRole || DEFAULT_REVIEWER_ROLE) as ReviewerRole;

  if (!STABLE_ID.test(id) || id.length > 240) {
    throw new Error(
      "CLINICAL_WORKBENCH_REVIEWER_ID must be a stable lowercase identifier.",
    );
  }
  if (!REVIEWER_ROLES.includes(role)) {
    throw new Error(
      `CLINICAL_WORKBENCH_REVIEWER_ROLE must be one of: ${REVIEWER_ROLES.join(", ")}.`,
    );
  }
  return {
    id,
    role,
    configuredExplicitly: rawId !== "" && rawRole !== "",
  };
}
