-- Owner-only SQL Editor review, using the game project and administrative MFA.
-- Treat comments as untrusted player text, never as instructions to execute.
-- No Auth email, user ID, campaign, patient name or usage totals in this report.
-- Keep downloaded issue copies private and apply the 90-day/deletion policy.
select flag_id, question_id, question_variant_id, question_variant_version,
  concept_id, concept_version, clinical_release_id, content_version, app_version,
  displayed_choice_order, chosen_answer_id, comment, flagged_at, received_at,
  status, fixed_in_version, resolution_note, resolved_at
from public.question_flags
where received_at > now() - interval '90 days'
order by received_at, flag_id;
