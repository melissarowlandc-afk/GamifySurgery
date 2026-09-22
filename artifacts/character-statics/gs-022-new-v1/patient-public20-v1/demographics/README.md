# GS-022 question-bank demographic audit

This snapshot supports the visual planning of 20 patient/general-public identities. It does not select clinical cases, change simulation weights, or represent clinical approval.

The source is the current owner-approved/editorially accepted question bank, `SYNTHETIC_CLINICAL_RELEASE`: 183 concepts, 450 cases, and 703 decision nodes. The release remains an explicitly unapproved clinical prototype.

Each authored case has equal weight; multiple eligible instantiation profiles split that case's weight equally. 102 legacy cases lack structured age/sex and have no explicit demographic match in either presentation or node prompt text. They are excluded rather than assigned invented demographics.

Run from the repository root:

```powershell
node tools/character-mapping/gs-022-new-v1/audit-question-demographics.mjs --check
```

The script loads the release through Vite SSR and closes its Vite server before exit. Use `--write` only to refresh these two snapshot files after a deliberately reviewed content change.
