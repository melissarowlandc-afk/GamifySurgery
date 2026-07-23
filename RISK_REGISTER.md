# Risk Register

Status: Living record.

Last updated: 2026-07-22

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---:|---:|---|---|
| RK-001 | Missing detail is invented and later conflicts with owner intent | Medium | High | Keep open questions explicit; require approval gates | Active |
| RK-002 | Incorrect clinical content reaches players | Medium | Critical | Melissa-only approval, source requirements, immutable releases, emergency withdrawal | Active |
| RK-003 | Commercial question-bank material is copied too closely | Medium | High | Original drafting, provenance, source review, copyright checks | Active |
| RK-004 | Wrong tutorial answers cause financial or progression softlock | High without controls | High | Guaranteed base rewards and worst-case simulation | Active |
| RK-005 | Satisfaction above 90% becomes opaque or luck-gated | Medium | High | Visible components, recoverability, bounded random effects | Active |
| RK-006 | Phone interface is technically complete but unpleasant | High | High | Phone-specific layouts, touch testing, staged panels, sound-off testing | Active |
| RK-007 | Browser suspension contradicts facility-time expectations | High | Medium-High | Approve hidden-tab semantics; explicit auto-pause indicator | Active |
| RK-008 | Two devices overwrite or corrupt a campaign | Medium | High | Save revisions, one active writer, explicit conflict handling | Active |
| RK-009 | Balance/content edits alter existing campaigns | Medium | High | Immutable releases and saved version pins | Active |
| RK-010 | Random results change after an update | Medium | High | Pin generator version, named streams, deterministic replay tests | Active |
| RK-011 | Admin interface or service credentials are exposed | Low-Medium | Critical | Separate deployment, MFA, outer access gate, server-side secrets, permission tests | Active |
| RK-012 | Email data is used beyond the stated purpose | Low-Medium | High | Purpose limitation, separation, role controls, retention/deletion policy | Active |
| RK-013 | One person creates several accounts despite email uniqueness | Medium | Low-Medium | Single-use invitations and admin review; avoid claiming certainty | Active |
| RK-014 | Security logs become undeclared analytics | Medium | High | Field allowlist, retention, access control, periodic review | Active |
| RK-015 | Pilot drifts into research without approval | Medium | Critical | Research disabled, no telemetry, explicit new IRB/privacy gate | Active |
| RK-016 | Free hosting/database tier loses valuable pilot data | Medium | High | Manual export while disposable; paid backups only after explicit approval; restore tests | Active |
| RK-017 | Full admin website consumes effort before gameplay is proven | High | Medium-High | Minimal publish workflow in vertical slice; expand iteratively | Active |
| RK-018 | One-concept technical slice is mistaken for a valid learning pilot | Medium | High | Separate technical slice from multi-concept human pilot | Active |
| RK-019 | Independent campaign schedules confuse players with multiple campaigns | Medium | Medium | Clearly identify active campaign and retain each schedule separately | Active |
| RK-020 | Framework/provider lock-in becomes expensive | Medium | High | Pure domain layer, standard PostgreSQL, release bundles, adapter boundaries | Active |

