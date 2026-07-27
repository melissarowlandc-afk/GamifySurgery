# Founder and Inheritance Opening

Status: Implemented Level 0/1 prototype direction

## Flow

Every genuinely new campaign and recoverable restart begins with:

1. A deliberately small founder creator: name, one of ten interchangeable head
   presets, and one of ten interchangeable body presets.
2. A sparse inheritance screen containing the two equally real choices
   **Be Rich and Happy** and **Build a Surgery Clinic**.
3. Either the short rich-and-happy non-game ending or a required clinic-name
   prompt followed by one-time initialization of the existing Level 0 tutorial.

Existing campaigns bypass this opening and resume their saved state.

## Campaign boundary

The founder's trimmed display name and complete pixel-appearance descriptor are
stored in the authoritative campaign save. The founder is rendered from that
same descriptor inside the clinic.

No campaign, clinic, FSRS history, room, patient, timer, XP, or spendable money
is created by founder editing, the inheritance screen, the naming prompt, or
the happy ending. Choosing the clinic path first requires a normalized unique
clinic name, then performs one synchronous campaign initialization and
immediately persists it before mounting gameplay. Repeated activation,
refreshes, and retries cannot initialize twice.

The inherited $1,000,000 is narrative framing only. The new clinic uses the
centrally configured Level 0 starting cash.

## Restart behavior

Restart Campaign retains the accepted recoverable behavior: the prior campaign
is archived and a clinic retry uses the prior root seed. The
retry is not created until the player selects the clinic path. A separate New
Campaign uses a new seed. Either route receives fresh campaign-scoped FSRS
histories only when its clinic actually begins.

## Presentation boundary

The founder and inheritance screens have no gameplay HUD, sidebars, objectives,
alerts, scenery, clinic-name prompt, character statistics, or branching
narrative system. Naming appears only after selecting the clinic branch. The
happy ending contains only the customized star-jumping founder, the sentence
`You are rich and happy.`, and a return-to-main-screen action.
