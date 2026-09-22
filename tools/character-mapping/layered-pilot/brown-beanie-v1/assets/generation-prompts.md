# Brown Beanie source art and generation record

All generated donor artwork used the built-in `image_gen` tool. Deterministic
atlas cleanup and the September 17 thumb correction are importer transforms,
not new generated art. Original source:
`Photos for Codex 2/Patients or Staff or Other Characters/exec-092d31ac-7592-4634-8883-167ddac564df.png`,
SHA-256 `1ded19438dc0df3f0fa7f4cdadddddbfa3750632d47a27c7c721c8e9cdacb636`.
`original-reference.png` is an exact workspace copy for tool input. Original
head and available torso/lower pixels remain authoritative over generated art.

| Source image | Exact prompt | Intended use |
|---|---|---|
| [upper-generated-v1.png](upper-generated-v1.png) | [Upper prompt](upper-generated-v1-prompt.txt) | Separate sweater upper sleeves and forearm/cuff/hands. Generated torso row excluded because it retains sleeves. |
| [upper-broader-v2.png](upper-broader-v2.png) | [Measured-width correction](upper-broader-v2-prompt.txt) | Superseded narrower 16 arm donors. |
| [upper-broader-v3.png](upper-broader-v3.png) | [Full source-width correction](upper-broader-v3-prompt.txt) | Active 16 arm donors. South source sleeve strips measure 21/23px and assembled strips 19/20px at registered row 180. Generated torso row remains excluded. The reproducible [corrected derivation](upper-broader-v3-corrected-v2.png) masks only narrow black elbow cut-end bands and horizontally reflects only the South/North anatomical-left forearm cell with every landmark. Native pixel inspection showed both South hands pointed source-right and both North hands source-left despite their intended labels; the right-hand donors remain unchanged. No pixels are recolored or invented. |
| [profile-arm-free-torso-v2.png](profile-arm-free-torso-v2.png) | [Arm-free profile restoration](profile-arm-free-torso-v2-prompt.txt) | Active East/West torso donors. Original profile torso masks retained only a narrow front strip and an arm seam, so these two source-referenced full trunks restore pelvic width without sleeves or hands. Original South/North arm-free torso and all original heads remain active. |
| [profile-continuous-legs-v1.png](profile-continuous-legs-v1.png) | [Continuous legs](profile-continuous-legs-v1-prompt.txt) | Active profile trouser/boot source, actual column order E/W/E/W. Thigh crop ends at source row 625; shin begins at 470, giving 155 shared source rows around the annotated knee. Original S/N lower parts remain active. Each profile segment uses a fixed 1.70 transverse multiplier and 26px rounded runtime clip, with cloth continuing into the boot. Resulting 19–24.5px mid-bone widths are comparable to the original East walking donor's independently sampled 22/27px shin runs while preserving the rigid gait. |
| [lower-generated-v4.png](lower-generated-v4.png) | [Initial](lower-generated-v1-prompt.txt), [cut-end cleanup](lower-generated-v2-prompt.txt), [color correction](lower-generated-v4-prompt.txt) | Superseded trial: separated knee cut outlines remained visible in motion. |
| [seated-lower-generated-v2.png](seated-lower-generated-v2.png) | [Initial](seated-lower-generated-v1-prompt.txt), [color correction](seated-lower-generated-v2-prompt.txt) | Four seated lower bodies S/E/W/N. |
| [clipboard-generated-v1.png](clipboard-generated-v1.png) | [Clipboard prompt](clipboard-generated-v1-prompt.txt) | Superseded compact bent arms. |
| [clipboard-broader-v2.png](clipboard-broader-v2.png) | [Broader clipboard arms](clipboard-broader-v2-prompt.txt) | Active two fuller long-sleeve clipboard arms, imported by actual anatomical shoulder and hand direction (first source arm is RIGHT, second LEFT). |

Source sheets are inputs to the standard packer, not the canonical runtime
atlas. Inspect actual anatomy before import: upper S/N forearm source rows were
reversed, while upper-arm rows were correct; clipboard source pair was reversed.
Canonical destination slot names and sides remain unchanged. Record each actual
crop and landmark in the packed manifest rather than assuming prompt compliance.

Lower v1 had unwanted knee cuff bands. V2 removed them; v4 corrected overly light
trouser color. V3 was an unnecessary background extraction edit and is unused:
despite apparent glow in the viewer, direct pixel samples in the earlier source
negative space were already alpha0. Always verify actual alpha before editing.

Continuous limb source art is preferable where a garment covers a joint:
decompose it into the same fixed atlas slots with shared cloth overlap, rather
than letting generation invent heavy end outlines on individual segments.

The selected image sources must still pass assembled source-versus-fit review;
having a generated sheet or successful atlas import is not appearance approval.
