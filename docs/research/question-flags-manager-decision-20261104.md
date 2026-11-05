# Manager decision — owner/tester flag rewrites (2026-11-04)

After three author rounds and three independent reviews (question-flags-adversarial-review, -review2, -review3-20261104.json), the rule is: ship a rewrite when it either passed independent review or fully resolves the owner's original flag without a FAIL. In both cases the owner has said the live version is worse. All shipped versions stay needs_clinician_review. Everything else keeps its live version and returns to the whole-bank queue.

- Ship (PASS): F01, F09, F12.
- Ship (REVISE, original flag fully resolved per review 3): F03, F05, F10, F11, F15, F17.
- Keep live version and re-queue: F02, F06, F07, F13, F16 (flag only partially resolved), F08 (not resolved), F04 (FAIL; source hold), F14 (held).
