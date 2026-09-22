# Navy Vest source artwork

Built-in image_gen mode, 2026-09-17. Identity reference:
Photos for Codex 2/Patients or Staff or Other Characters/exec-ee82180f-799f-4617-9159-27eefa97f158.png
(patient.adult.035). Source SHA-256:
9f843a7297c830ce3263a95a6476f1a953a42fe9fef6b883c9f324fb6e7be4f2.

- [Upper donor](upper-generated-v1.png), [exact prompt](upper-generated-v1-prompt.txt).
  Also referenced standard-atlas/templates/upper-labeled-v1.png for layout only.
  Generated output exec-e9fbdfa2-acaf-4d77-b85f-3cefea97fb35.png.
- [Whole-body seats](seated-generated-v1.png), [exact prompt](seated-generated-v1-prompt.txt).
  Generated output exec-b34ea329-0782-4f96-a36e-3705aa996216.png.

Parent inspected both outputs. Upper row labels are not evidence of correct
anatomy: verify visible thumb/elbow orientation before immutable-slot import.
Prefer original torso/legs and exact original head where complete source pixels
exist. Whole-body seated figures use one uniform transform, no limb fitting.
Project consumers use these copied assets, not generated-image cache paths.

Profile extraction showed missing back cloth after original sleeves were removed.
Added [complete E/W vest donor](profile-torso-v1.png),
[exact repair prompt](profile-torso-v1-prompt.txt), built-in image_gen output
exec-d615ccc1-df62-42c8-bf94-75c9878c1440.png. Parent inspected: dark oval holes
replaced by opaque navy cloth; shoulder seam remains and should be covered by
correctly registered sleeve caps. Preserve original source-relative torso width.

First walking proof exposed gaps and tilted shoes in original profile leg splits.
Added [continuous profile legs](profile-legs-v1.png),
[exact prompt](profile-legs-v1-prompt.txt), built-in image_gen output
exec-8eb7f1fe-a1b5-4b88-b0ba-541040f8919d.png (2172x724).
Parent inspected: matching dark olive/charcoal cloth and compact brown shoes;
columns1/2/4 visibly face East, column3 faces West. Correct anatomical mapping
and reflection must follow actual art, not requested column labels. Split at
knee with adequate opaque overlap; preserve flat sole and true heel entry.
