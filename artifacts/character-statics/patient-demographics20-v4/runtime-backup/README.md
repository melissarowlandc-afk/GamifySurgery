# Approved demographic batch4 checkpoint

The owner approved local integration and GitHub backup on October7,2026. Twenty new adult patients and160 poses are added to the local game;225 total identities/1830 assets and116 adult patient designs are available. Existing205 entries/1670 pose bytes and saved IDs remain unchanged. No clinical content, demographic selection weights or question data changed.

This archive contains the complete new art batch, exact source and correction history, prompts, approval/contact/alpha records, reviewed chair proofs and immutable pre-integration gallery. It retains every registered public pose, byte-identical direct provenance source copy, direct input receipt and a bounded further level of historical metadata. Older historical native/proof chains are outside this checkpoint; their recorded claims remain intact. Absolute local paths in native receipts are historical provenance; verification uses the included workspace copies.

`post-integration/` preserves six exact runtime files. `integration-deltas/` contains their reviewed205-to225 changes, against `../runtime-integration-baseline/`. `snapshot-map.json` binds both versions and patches. `backup-manifest.json` hashes the complete audited file set; it excludes itself to avoid self-reference.

Run from a checkout with Node22.12 or later:

```text
node artifacts/character-statics/patient-demographics20-v4/runtime-backup/verify-backup.mjs
```

The read-only verifier needs only Node built-ins. It checks all included hashes,225 registry identities/1830 PNGs, direct source/input provenance, preservation of previous entries,40 native/prompt pairs, owner approval, immutable approved-gallery evidence and80 authored chair contacts.

This is a faithful art and integration recovery archive. The beta HEAD does not contain the current complete still renderer, selection and save plumbing. Those local files include substantial unfinished work owned by other chats and are deliberately excluded. A clean checkout of this backup alone is therefore **not the complete playable current game**. Use the snapshots/deltas only after restoring or integrating their current game dependencies, and inspect conflicts against ongoing work; do not overwrite unrelated runtime files blindly. Full chair-proof rebuilds also require existing room geometry/art and the extraction tool requires its local canvas dependency. Portable verification does not require either.

Local owner playtesting remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the usual browser profile. Existing local saves stay at that origin. The remote GitHub Pages game has separate saves and is not updated by this beta backup. No merge, release, deployment or publication is included.
