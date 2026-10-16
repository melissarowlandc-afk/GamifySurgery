import type { SupabaseClient } from "@supabase/supabase-js";
import { APP_BUILD_VERSION, APP_VERSION } from "../appVersion";

export const MAX_FEEDBACK_LENGTH = 1000;
export interface TesterFeedbackSubmission {
  id: string;
  comment: string;
  release_version: string;
  app_version: string;
  level: number;
  shell: "desktop" | "phone";
}
export interface TesterFeedbackTransport {
  send(submission: TesterFeedbackSubmission): Promise<void>;
}

export function createTesterFeedback(comment: string, level: number, shell: TesterFeedbackSubmission["shell"]): TesterFeedbackSubmission {
  const trimmed = comment.trim();
  if (!trimmed || trimmed.length > MAX_FEEDBACK_LENGTH || !Number.isInteger(level) || level < 0 || level > 5) {
    throw new Error("Feedback context unavailable");
  }
  return { id: crypto.randomUUID(), comment: trimmed, release_version: APP_VERSION, app_version: APP_BUILD_VERSION, level, shell };
}

/** The server owns player identity, timestamp, quota and disposition. */
export function createTesterFeedbackTransport(client: SupabaseClient, accountId: string): TesterFeedbackTransport {
  return {
    async send(submission) {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError || !sessionData.session || sessionData.session.user.id !== accountId) {
        throw new Error("Feedback account unavailable");
      }
      // Pin this account's token through sign-out/account switches, like flags.
      const { data, error } = await client.rpc("submit_tester_feedback", {
        p_id: submission.id, p_comment: submission.comment, p_release_version: submission.release_version,
        p_app_version: submission.app_version, p_level: submission.level, p_shell: submission.shell,
      }).setHeader("Authorization", `Bearer ${sessionData.session.access_token}`);
      if (error || data?.id !== submission.id || typeof data.created_at !== "string" || !Number.isFinite(Date.parse(data.created_at))) {
        throw new Error("Feedback acknowledgement unavailable");
      }
    },
  };
}
