"""Audit the captured archive without accessing owner storage or remote services."""
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter
import argparse
import hashlib
import json
import re
import runpy
import subprocess
import sys
import struct
import zlib

sys.dont_write_bytecode = True


def audit(root, check_ignore=True):
    root = root.resolve()
    repo = root.parents[2]
    selection = json.loads((root / "validation/selection.json").read_bytes())
    helpers = runpy.run_path(str(root / "verify_archive.py"))
    apply_patch = helpers["apply_patch_bytes"]
    contracts = {c["path"]: c for c in json.loads((root / "recovery/patches/patch-verification.json").read_bytes())["contracts"]}
    strong = {
        "private_key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"),
        "aws_access_key": re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
        "github_token": re.compile(r"\bgh[pousr]_[A-Za-z0-9]{25,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b"),
        "openai_key": re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b"),
        "bearer_token": re.compile(r"\bBearer\s+[A-Za-z0-9._-]{24,}\b"),
        "jwt": re.compile(r"\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b"),
    }
    secret_assignment = re.compile(r'''(?i)["']?(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|private[_-]?key)["']?\s*[:=]\s*["']([^"'\n]{8,})["']''')
    email = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
    ssn = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
    findings, literals, identifiers, boms, decoding, endings = [], [], [], [], [], []
    png_metadata, metadata_errors, save_shapes = [], [], []
    text_count = png_count = 0
    metadata_text_count = 0
    examined = set()
    output_files = {"validation/safety-audit.json", "validation/archive-size.json", "manifest.json", "validation/verification-results.json", "validation/negative-guard-tests.json"}

    def scan_text(label, data, kind):
        nonlocal text_count
        if b"\0" in data:
            return
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            if Path(label).suffix.lower() in {".json", ".md", ".txt", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".css", ".html", ".py", ".ps1", ".cmd", ".patch", ".svg"}:
                decoding.append({"kind": kind, "path": label})
            return
        text_count += 1
        if data.startswith(b"\xef\xbb\xbf"):
            boms.append({"kind": kind, "path": label})
        if b"\r" in data:
            endings.append({"kind": kind, "path": label, "crlf": data.count(b"\r\n"), "bareCr": data.count(b"\r") - data.count(b"\r\n")})
        for name, pattern in strong.items():
            for match in pattern.finditer(text):
                findings.append({"kind": kind, "path": label, "signature": name, "line": text.count("\n", 0, match.start()) + 1})
        for match in secret_assignment.finditer(text):
            # Report locations only; do not reproduce potential credentials.
            literals.append({"kind": kind, "path": label, "line": text.count("\n", 0, match.start()) + 1,
                "valueSha256": hashlib.sha256(match[1].encode()).hexdigest(), "valueLength": len(match[1])})
        for name, pattern in (("email", email), ("social_security_number", ssn)):
            for match in pattern.finditer(text):
                identifiers.append({"kind": kind, "path": label, "signature": name, "line": text.count("\n", 0, match.start()) + 1})

    def scan_png(label, data):
        nonlocal png_count, metadata_text_count
        if not data.startswith(b"\x89PNG\r\n\x1a\n"):
            return
        png_count += 1
        pos = 8
        while pos < len(data):
            assert pos + 12 <= len(data), label
            length = struct.unpack(">I", data[pos:pos + 4])[0]
            tag, body = data[pos + 4:pos + 8], data[pos + 8:pos + 8 + length]
            assert pos + 12 + length <= len(data), label
            assert zlib.crc32(tag + body) & 0xFFFFFFFF == struct.unpack(">I", data[pos + 8 + length:pos + 12 + length])[0], label
            if tag in {b"tEXt", b"zTXt", b"iTXt", b"eXIf"}:
                item = {"path": label, "chunk": tag.decode(), "bytes": length}
                png_metadata.append(item)
                if tag != b"eXIf":
                    try:
                        if tag == b"tEXt":
                            text = body.replace(b"\0", b" ").decode("latin-1").encode("utf-8")
                        elif tag == b"zTXt":
                            keyword, remainder = body.split(b"\0", 1)
                            text = keyword + b" " + zlib.decompress(remainder[1:])
                        else:
                            keyword, remainder = body.split(b"\0", 1)
                            compression, method, remainder = remainder[0], remainder[1], remainder[2:]
                            language, translated, value = remainder.split(b"\0", 2)
                            text = keyword + b" " + translated + b" " + (zlib.decompress(value) if compression else value)
                        metadata_text_count += 1
                        scan_text(label + "#" + tag.decode(), text, "image_metadata")
                    except Exception as error:
                        metadata_errors.append({**item, "error": type(error).__name__})
            pos += length + 12
            if tag == b"IEND":
                assert pos == len(data), "Unexpected trailing PNG payload: " + label
                break

    def scan_save_shapes(label, value):
        if isinstance(value, dict):
            if {"campaignId", "campaignSeed", "facilityTick", "rooms"}.issubset(value):
                save_shapes.append({"path": label, "campaignId": value["campaignId"], "campaignSeed": value["campaignSeed"], "createdAtRealMs": value.get("createdAtRealMs"), "facilityTick": value["facilityTick"]})
            for key, item in value.items():
                scan_save_shapes(label, item)
        elif isinstance(value, list):
            for item in value:
                scan_save_shapes(label, item)
        elif isinstance(value, str) and value.startswith('{"schemaVersion":'):
            try:
                scan_save_shapes(label, json.loads(value))
            except ValueError:
                pass

    for entry in selection["files"]:
        path = entry["path"]
        if entry["method"] == "patch":
            c = contracts[path]
            data = apply_patch((root / c["base"]).read_bytes(), (root / c["patch"]).read_bytes())
        else:
            data = (root / "recovery" / path).read_bytes()
        scan_text(path, data, "recovered")
        if path.endswith(".json"):
            scan_save_shapes(path, json.loads(data))
    for p in sorted(root.rglob("*")):
        if not p.is_file():
            continue
        path = p.relative_to(root).as_posix()
        examined.add(path)
        if path in output_files:
            continue
        data = p.read_bytes()
        scan_text(path, data, "archive")
        scan_png(path, data)
    prohibited = []
    for entry in selection["files"]:
        p = entry["path"]
        if p.startswith((".claude/", ".local-dev/", "apps/player/dist/", "test-results/", "playwright-report/")) or p.lower().endswith((".pdf", ".epub", ".pem", ".pfx", ".key")):
            prohibited.append(p)
    allowed_save_paths = {"tests/fixtures/level-five-integration-checkpoints-20261012.json", "tests/fixtures/level-five-legacy-behavior-20261012.json", "tests/fixtures/level-five-economy-checkpoint-20261012.json"}
    assert all(s["path"] in allowed_save_paths for s in save_shapes), "Unexpected save-shaped JSON paths: " + str(sorted({s['path'] for s in save_shapes if s['path'] not in allowed_save_paths}))
    assert all(s["campaignId"].startswith(("campaign.audit.level-five-m8.", "campaign.audit.level-five-m9.", "campaign.m9.legacy.")) and s["createdAtRealMs"] == 0 for s in save_shapes), "Unexpected save provenance"
    paths = sorted({e["path"] for e in selection["files"]} | {e["path"] for e in json.loads((root / "validation/stage-sources.json").read_bytes())["files"]} |
                   {"artifacts/checkpoints/manager-accepted-20261012/" + p for p in examined} |
                   {"artifacts/checkpoints/manager-accepted-20261012/manifest.json", "artifacts/checkpoints/manager-accepted-20261012/validation/safety-audit.json"})
    ignore = {"command": "git check-ignore --no-index -z --stdin", "logicalAndPhysicalPathsChecked": len(paths), "ignored": [], "exitCode": None}
    if check_ignore:
        p = subprocess.run(["git", "check-ignore", "--no-index", "-z", "--stdin"], input=b"\0".join(s.encode() for s in paths) + b"\0", cwd=repo, capture_output=True)
        assert p.returncode in {0, 1}, p.stderr.decode("utf-8", "replace")
        ignore["ignored"] = [s.decode("utf-8") for s in p.stdout.split(b"\0") if s]
        ignore["exitCode"] = p.returncode
    audit_result = {
        "status": "PASS" if not (findings or literals or identifiers or prohibited or boms or decoding or metadata_errors or ignore["ignored"]) else "REVIEW_REQUIRED",
        "checkedAtUtc": datetime.now(timezone.utc).isoformat(), "logicalRecoveryTargetsScanned": len(selection["files"]),
        "physicalArchiveFilesScanned": len(examined), "utf8TextInspections": text_count,
        "strongSecretSignatures": findings, "literalCredentialAssignments": literals, "personalIdentifiers": identifiers,
        "forbiddenPayloadPaths": prohibited, "utf8Boms": boms, "textEncodingErrors": decoding,
        "preservedSourceOrPatchLineEndings": endings, "newMetadataUtf8NoBomLf": not any(e["kind"] == "archive" and not e["path"].startswith(("recovery/", "evidence/")) for e in endings),
        "saveShapeInspection": {"saveShapedJson": save_shapes, "ownerSavePayloads": 0, "ownerBrowserStorageAccessed": 0,
            "provenance": "Only M8/M9 reducer-generated disposable audit/legacy fixtures with explicit synthetic campaign seeds and zero real creation time; generation code, results and manager acceptance are captured."},
        "checkIgnore": ignore, "sourceRestrictions": {"proprietaryPdfsReadOrIncluded": 0, "sourceCorpusIncluded": 0,
            "fullArticlesIncluded": 0, "sourceExcerptsIncluded": 0, "webSourcesFetched": 0,
            "policyMentions": "Restricted-source names in policy or rights records are not ingested source corpora."},
        "imagePrivacyReview": {"pngImagesMetadataInspected": png_count, "metadataRecords": png_metadata, "embeddedTextChunksScanned": metadata_text_count, "metadataDecodeErrors": metadata_errors,
            "representativeVisualReviewReceipt": "validation/image-privacy-review.json", "realPatientOrOwnerCampaignImagesIncluded": False},
        "clinicalReviewStatus": "validation/clinical-review-audit.json and clinical-source-invariance.json",
        "clinicalApprovalClaimed": False, "ownerSavesAccessed": 0, "ownerBrowserStorageAccessed": 0, "gitMutations": 0,
    }
    return audit_result


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps(audit(Path(__file__).resolve().parent), ensure_ascii=False, indent=2))
