# Seventh recovery checkpoint task record

Goal: preserve the main development tree's manager-accepted state since baseline
3436c8bbd8359c64c49b082f21e88a8985f594f7, incrementally over all six existing
archives. Follow checkpoint six's manifest, exact base/patch, exclusion and
verification contracts. The November 12 manager dispatch is the scope authority.

Ownership: this worker writes only artifacts/checkpoints/manager-accepted-20261112/.
The shared handoff remains read-only under that explicit constraint. Claude Code
and concurrent Codex workers own all other files. No agents, network, Git
mutation, dependency installation, messaging, publication or deployment.

Milestones:

1. Read instructions, checkpoint six and the shared handoff; hash safe source
   candidates before packaging. Reconcile prior targets and exclusions; verify
   every prior manifest and committed blob.
2. Select accepted incremental changes; omit explicit live lanes and every
   observed concurrent modification. Audit candidates and bases before copying.
   Preserve only exact reviewed development bytes; do not promote clinical drafts.
3. Bundle whole new files and exact shared text bases/patches. List release
   equality without dropping the main tree's own recovery state. Produce explicit
   archive-only staging paths and a proposed commit message.
4. Audit decoded recovery and physical files, rehash source and prior archives,
   prove forward/reverse/reapply and isolated disk restoration, test guards,
   and finalize an exact-count/size handoff with any split recommendation.

Acceptance: exact recovered hashes; byte-unchanged prior archives; zero included
live/private/proprietary/build/test-output paths; listed synthetic test identities;
recorded size limits and split proposal when exceeded. Game tests and SQL are
not rerun: this bounded task validates backup recovery rather than accepting
gameplay, clinical content or database changes. The manager independently audits,
stages, commits, pushes and verifies the remote.

Discoveries: rg is unavailable, so local Python and native PowerShell provide
file discovery. A month of retained authoring fixtures and topic research makes
the candidate layer approximately 1 GB. Regenerable analysis outputs are omitted;
fixtures used as historical test inputs remain recoverable. Some earlier dirty
art/tooling paths are still outside the accepted lane, as recorded by checkpoint
six. Private directories and real environment files are never opened.

Next action after handoff: manager reviews the concrete archive and size proposal,
reruns strict verification and safety audit, and stages only STAGE_PATHS.txt.
