# MRI Room candidate artwork provenance

## Current revision — north-facing tech, centered bed entrance, foreground patient

Latest owner direction is authoritative in ../OWNER_REVISIONS_2026-10-07.md. Desk source console06 is enlarged uniformly20% into206x317; tech uses the existing sit.north source south of the desk. Matching rear-view operator-chair03 was edited with builtin image_gen, transparent_background=true, from operator-chair02; preserved original: [originals/operator-chair-03.png](originals/operator-chair-03.png), exact prompt: [prompts/operator-chair-03.prompt.txt](prompts/operator-chair-03.prompt.txt), SHA2560A4F34C28994E3E96B979B9A966C505BA84620191D25F45166FB618C11F4741C. Source/prompt receipt now verifies21 pairs and the three original references.

The original empty bed and all character sources/scales remain unchanged. Private bed ground moves to(2.49,2.42); its visible forepart draws to the measured center of the donut opening and the section inside the scanner is clipped by the renderer. Existing sit.west patient sits at(2.18,1.970390086), exact hip anchor on the outer cushion, with actual shoe alpha west of the bed end and explicit foreground depth above bed and scanner. The small step stool is omitted so feet hang freely. Chair back layers in front of the tech's lower body, leaving head/shoulders visible. No generated patient, painted source composite, stretched asset or runtime edit.

Implemented directly in the current MRI lane, with no new worker dispatch. Final focused validation passes95 checks,272door/backing states,2048routes,22304actual-base walking samples,164standing approaches,all9native/alpha/source checks and zero browser errors. Current339 owned file hashes verify;11 prepared files reproduce byte-for-byte. Full-height cabinet/backing, actor baseline/shared sources and approved Reading Room hash are preserved. Current scan image SHA256469A00334839B40F70C55175442598DADE32F0BD65190329337C309F66C5E8FA. parent-review.json records current bytes/poses/bed entrance/layers. Owner review and runtime integration remain separate; work is local only.

Previous candidate/receipts preserved under ../proof/history/v6-west-tech-seated-patient/ and history/v6-west-tech-seated-patient/. The following sections are historical.

## Previous owner revision — October 7, 2026 (historical)

The owner rejected the generated lying patient. The active candidate uses the existing patient.adult.001 sit.west character on the empty MRI table; no generated patient pixels, duplicate standing patient or occupied-table sprite remains in the active proof. Intentionally simplified scanning presentation is authorized. OWNER_REVISIONS_2026-10-07.md records the directions superseding the corresponding original brief requirements.

Nine active transparent assets: gantry-side, table-empty, console, operator-chair, coil-cabinet, zone-sign, scan-light, comfort-cart and open-shelves. The scanner frame is384x519, the front cart180x216, and new backless open shelves180x300. The console172x264 shows the tabletop, full keyboard and two monitor faces from an elevated camera. The four-pixel width adjustment permits uniform fitting to the rear-worktop height without stretching; front and rear projected edges have distinct measured heights. These are candidate software-art sizes, not clinical measurements. The larger fixtures require a revised private layout; shared runtime/design sources and actor sources/scales are preserved.

New builtin image_gen edits: console04 changes the camera/desktop presentation using console03 and approved CT furniture as references; open-shelves01 replaces lockers01 with backless storage using the same style reference. Console05 and console06 extend desk supports to calibrate the worktop after uniform fitting. Exact prompts and editTarget records are retained. Original model outputs are preserved byte-for-byte; transparent_background=true was requested for every call. No Python painting, stretching or synthetic patient image was used for this revision.

generation-manifest.json selects nine sources and retains eleven earlier originals in sourceHistory. source-integrity.json verifies all20 original hashes, all20 prompt hashes and unchanged original brief/stand-in/style-reference inputs. console06 SHA256C26DDA09176708ED51C81362A246A8544BA1CEB485176E80B9E621CC02B23C3D; open-shelves01 SHA256B69A61F8C0AA5931A2A8C66189233FA7F658BD71A6E08CCD1C962049D0512C61. Precise prepared rear/front tabletop heights must be measured separately because the projected visible tabletop has depth; a prompt's numerical request is not evidence of compliance.

The previous provenance, source-integrity, parent-review and generation-manifest receipts are preserved under history/2026-10-07-before-owner-revision/. The previous ten-asset proof is preserved under ../proof/history/v5-last-ten-asset-candidate/. The following sections describe that earlier candidate and its decisions, including the retired generated patient and closed lockers. They do not define the active revision. Final current packing, geometry, contacts and functional evidence belong to prepared/metadata.json and ../proof/ receipts after the revision is rebuilt.

Artwork and proof remain local, owner review pending, and separate from runtime integration. No clinical teaching content, source medical claim, timing, staffing, payment or progression rule is added. No GitHub backup, release or deployment is claimed.

Final revision review: Sol completed nine-source native preparation/private proof and stopped writing. Parent reviewed actual code/diff and five final captures, reran the focused validator independently (92checks PASS,272door/backing states,2048routes,22304base walking samples,164standing approaches,zero errors), verified all288 worker-owned hashes, and rehashed all20 originals/prompts without mismatch. Current parent-review.json records exact reviewed files. Repeat packing reproduces11 files byte-for-byte. Rear desk rise80.000px/front projected lip63.419px, scanner bore120.000px, empty cushion53.953px and chair44.942px; bore/cushion align. Existing sit-west patient hip uses its original221.153 source anchor exactly at the cushion; preserved distinct actor scale. The old occupied-table/closed-locker prepared files and root capture are retired, with prior evidence preserved in history. See current proof receipts for exact transforms, walking-versus-seated endpoint distinctions and candidate review limitations.

## Historical first candidate provenance

Created October 7, 2026 for GS-039. Owner instruction: "tools/room-design/level-4/mri/ART_BRIEF.md Read this to build the MRI room". Artwork creation is authorized; final layout/design approval and runtime integration are pending.

All new artwork uses the builtin image_gen tool with transparent_background=true. Each object is a separate edit of a project-created stand-in, with approved CT furniture used only as a style reference. The occupied couch is an edit of the new empty couch. No CLI/API key workflow was used.

Exact prompts are preserved in prompts/. Generated originals are copied without alteration into originals/; the original Codex-generated files remain in place. generation-manifest.json records selected sources and earlier versions. source-integrity.json independently verifies all 16 originals and records all 16 exact prompt hashes, plus unchanged brief/stand-in/style-reference hashes. Prepared canvases, source-preserving fit/mask details and measured contacts are the separate proof worker's responsibility.

## Input references

- MRI ART_BRIEF.md: SHA256 9150F62A0A2AEA8EB1363D0114746EC96AC441493983E1DA4C5973EF0A9A75E9.
- MRI stand-in/assets/manifest.json: SHA256 1CDB059DF1824A497AD1DCE91E2316CCD63D4E55927D518C6724615893F5A6FF.
- apps/player/public/art/rooms/gs015-v1/ct/furniture.webp: SHA256 8E9293A5835079DD72850882586A9D5B7A2D93B24A39F1E0D64C06DD735A01B7. Approved in-repository art; style reference only.
- Layout/anchors/depth/door/backing contracts: tools/room-design/touchup-2026-10/lab/design-rooms.js, read-only. That shared source may change concurrently; the proof records its own baseline snapshot/hash.

## Preserved originals

- originals/gantry-side-01.png — C9F185BD2CEC907326EB8A9CEB3514DBF44613898BFB29AF66A84B1F08F7F91B.
  Exact prompt: prompts/gantry-side-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-e14e5434-862b-435a-ad1b-058b22f92cec.png.
- originals/table-empty-01.png — F53677A9FC0FB0EF890A20934315CDA50FAED3F60EFFF0383AAE435F9B8C52C5.
  Exact prompt: prompts/table-empty-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-bffc42fa-3ae3-471b-a594-a4d582aec6f1.png.
- originals/console-01.png — 864F39B2DFF01D43129F18A32695894790CBAE266DBD3DFCEC8C4A4DB60D0022.
  Exact prompt: prompts/console-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-b115ac4f-2bbd-4230-aae5-b5c61b666b42.png.
- originals/operator-chair-01.png — 88B2C73DED5372F4300DAD7B15C8F56A5927D8B4354E1B0B893297C971216D9D.
  Exact prompt: prompts/operator-chair-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-c69cc2d9-b248-4641-98d8-922a0961ac0f.png.
- originals/coil-cabinet-01.png — 4D1D45D0D4A7834FC8082B847BC773B63185C9E403D4965830853E2E13F5A53A.
  Exact prompt: prompts/coil-cabinet-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-4418f8f5-6a6c-4275-984c-b3807097cbf6.png.
- originals/zone-sign-01.png — 3B0770FC9781F405906A72212CB6B63BD9F4371E28EAA89BDC6390881FBBBEDF.
  Exact prompt: prompts/zone-sign-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-1f9eda57-e34c-4d7c-a3a9-7a09acf9aea2.png.
- originals/scan-light-01.png — 45B1FF18880683116D0924E1187CFE12CFDBC771A85C541A54817C3EAF13F684.
  Exact prompt: prompts/scan-light-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-fcc57abc-1ea6-4206-99d6-e4863154dd35.png.
- originals/lockers-01.png — 9943C9F64722146476908C154E6ECC36D7147A88596113E871A04DC984A68D54.
  Exact prompt: prompts/lockers-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-26a2c668-9f23-4b74-acfe-8ed234257d95.png.
- originals/comfort-cart-01.png — 92F9665343C8DCC9AEBA1544804185636B0BEE13AA83001670336176DEFA47A5.
  Exact prompt: prompts/comfort-cart-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-453b1572-a439-4710-99f4-1fb67e174682.png.

## Review and use status

Completed occupied couch source: originals/table-occupied-01.png — 6F6128CC772989C8E7C290D26A23C90D00E6878E4108E00F93AD840A2ECE74CF. Exact prompt: prompts/table-occupied-01.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-1ce8216b-7d77-4b48-94cd-6f1d9627daff.png. The visual edit preserves the couch position and adds a generic patient with headphones at the left and a pale blanket to the right; exact unchanged-furniture verification belongs to deterministic preparation, not this visual inspection.

Originals have been visually inspected for subject, camera, palette, permitted text and orientation. They are painted candidates, not approved production assets. The side-view magnet's prescribed portrait canvas versus long-cylinder description, the console worktop scale and seated actor contact require measured proof review. Do not infer exact registration or grounded access from a generated image.

The patient is a generic generated adult under a blanket, not a real person or source clinical input. Asset content comes from owner art direction and project-created reference art. This package introduces no clinical teaching statement, service timing, payment, staffing or progression change.

Prepared candidate art must retain genuine alpha and original source bytes. Semantic revisions use image_gen; deterministic crop/uniform scale/alpha source packing may be documented by prepare-assets.mjs. No stretched sprites or character-source changes are authorized.

Local-only artwork checkpoint; no new GitHub backup, release or deployment has been created for MRI.

## Measured source revision decisions

Early assembled version01 proof was inspected by the parent. Uniform packing measured console worktop49.40gamepx versus accepted80px, and couch top47.48gamepx versus brief54px. Targeted image_gen edits console02 and table-empty02 were requested to correct those geometric features. Version01 sources/prompts remain untouched; no code stretching or semantic repaint was used to fix them. The prepared occupied variant uses only patient pixels from occupied01 over the selected empty master; there was no occupied02 image_gen call. These measurements and revisions are software-art calibration, not clinical evidence.

- originals/console-02.png — C88973E342BF39D7937AB0ACAC7D685BB680D3FAB49D78B936EBF896F943870C. Exact prompt: prompts/console-02.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-243b4e72-6d2b-4be2-a034-d740e45a6bb1.png.
- originals/table-empty-02.png — D74E4633DA839786B88E2B01A044F37BA27D01CF7D94B367AFB8DFA0D458114C. Exact prompt: prompts/table-empty-02.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-abb9cbce-61d5-44b3-9120-e0ad942b0bf1.png.

## Physical floor-contact corrections

Prepared artwork retains transparent margins. The bottom of that canvas is not the physical foot line: the isolated proof anchors furniture using the measured opaque floor contact and retains the specified logical ground/depth point. Parent review found that canvas-bottom anchoring hid several small height errors. Four further builtin edits target the real-foot standards without scaling/stretching the source or moving its feet: gantry02 raises the bore, empty03 raises the cradle with a longer pedestal, console03 raises the desktop with a compact monitor assembly, and chair02 raises the seat with a longer post/shorter back. The outputs require measured verification; numeric prompt instructions are not verification.

- originals/gantry-side-02.png — 8538A643A844501F7608635FD69A1C2C0948110B8BA072E9C57B272B11E6859A. Exact prompt: prompts/gantry-side-02.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-c065cc96-bf72-48bd-8512-6fff6e7674b5.png.
- originals/table-empty-03.png — C1AE313DB73AED72474E83C190348E18F7BCCE69E71AC6C7C8E3665CDEAE842D. Exact prompt: prompts/table-empty-03.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-9c7c5283-486c-4038-bca8-01aaa19c44fc.png.
- originals/console-03.png — 53ECFE58B0CF1183646C7A7662CE0736914ED0ABBD99C4971483F81B6375E0C5. Exact prompt: prompts/console-03.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-15650ac2-6f45-473e-800e-5c4ae9d98ef5.png.
- originals/operator-chair-02.png — A90815FF13A42BDACCAC5F9AC064393DEC0CD98855D1D8DEE1828EE8A4C179D4. Exact prompt: prompts/operator-chair-02.prompt.txt. Original generated path: C:\Users\rowla\.codex\generated_images\01a11877-6649-7f40-9c2d-3c389eb52568\exec-6eb13328-df6d-4f54-882c-e688c3e4c827.png.

The selected empty couch is empty03. Prepared occupied art composites the original patient-only mask with a documented rigid shift onto that master. Shared pixels outside the patient mask and the pedestal must remain identical. Original images remain byte-for-byte preserved, including superseded variants. The current seated character remains at its existing source and game scale; its audited39.111px seat-to-foot rise does not match the45px chair target and remains a separate owner-review limitation.

Actual revised-source measurements were bore94.990, couch55.739, console80.206 and chair50.940gamepx at the initial maximum uniform fit. The source outputs overshot some instructions. To retain coherent source shapes and correct physical art heights, final preparation uniformly scales down gantry02, empty03 and chair02 inside their exact native canvases, with true opaque-foot registration. Console03 retains its fit. This leaves additional transparent padding beyond the brief's4–8px target in some frames: an explicit candidate exception, not an approved change. The packing receipt records exact uniform factors and post-fit measured contacts. Source images, logical ground/solid geometry, actor source and actor scale remain unchanged. These are software-art measurements; no clinical precision claim is introduced.

Final contact calibration reports bore90.000, cushion53.953, console80.206 and chair44.942gamepx, each within1.5px of its software-art target. At the authored world grounds, cushion is0.047gamepx below the bore centre. Factors relative to maximum fit are gantry0.9474667774086378, empty0.9687931124810085, chair0.883394058841072, console1. The prepared occupied variant uses the same empty-master transform:4,114 patient-region pixel differences, zero changes outside its mask. Detailed measured source picks, alpha bounds, exact factors and output hashes belong to assets/prepared/metadata.json and proof/asset-contract.json.

Initial nine generation calls used stand-in/assets/<asset-id>.png as edit target and apps/player/public/art/rooms/gs015-v1/ct/furniture.webp as the style-only reference. Occupied01 used the generated empty01 source as its sole edit target. Subsequent source edits used the prior same-object original recorded by editTarget in generation-manifest.json. All calls requested transparent_background=true. Larger padding, portrait magnet versus long-housing brief, compact monitor profiles and unchanged actor contact remain owner-review items; art measurement/automated controls are not design approval or permission for runtime rollout.

Actor-contract audit: proof data has remained byte-identical from its first snapshot onward, SHA2566D0E51993CBD6E4F79F1B98E138A8D9E1973083D6EB11132AEC3A3B2F744639D. The earlier39.135px estimate used a standalone width127.787456 that was not the displayed proof width. Actual unchanged rendered width127.7090592334495 with49raw-pixel seat-to-foot distance gives39.11089939024391gamepx. Baseline support leaves feet0.489px above floor;45px support leaves5.889px. Source sit-east SHA256A2A0856C7C8FF0BA698586710B7C16CF4107F3C61C0E7E4BFAD2A3357E943471 is unchanged. This is a corrected measurement, not an actor/scale edit.

