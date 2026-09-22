from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path


REPO = Path(__file__).resolve().parents[2]
TOOLS = REPO / "tools" / "character-pose-process"
RUN = REPO / "Photos for Codex 2" / "Codex Patients or Staff or Other Characters 2" / "mixed-batch-2026-09-10" / "pose-process-proof-v1" / "m2-run-001"
PROOF = RUN.parent
PROMPT_ID = "bb0d4b1d-4921-4cf1-8fd2-50fd908ba5fe"
PROPOSAL_SHA = "e2585246c2cdd59e615afff998002e5ddb0c2e5d452b85f1614f98350a96f1ba"
SCHEMA_SHA = "3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a"
COMPOSITE_SHA = "e87e1d066078fe6a355caa98e7a1158fef937fa189ccbb26edf5e43c7d76ac34"
MASK_SHA = "f610c2474289088d12fc5f195b2ac98365efb06c8a284545ef4c58044742c34f"
OLD_LIB_SHA = "19b84a2c92db8b44358dd24ae1e831b73f9bcc2181626c1303bb78b8f0e0f0aa"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def canonical(value) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def run(command: list[str]) -> str:
    result = subprocess.run(command, cwd=REPO, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(f"command failed ({result.returncode}): {' '.join(command)}\n{result.stdout}\n{result.stderr}")
    return result.stdout + result.stderr


def write_or_verify(path: Path, value) -> None:
    encoded = (json.dumps(value, indent=2) + "\n").encode()
    if path.exists():
        if path.read_bytes() != encoded:
            raise RuntimeError(f"existing final evidence differs: {path}")
        return
    with path.open("xb") as stream:
        stream.write(encoded)


def main() -> None:
    test_output = run(["node", "--test", "tools/character-pose-process/m2-runner.test.mjs"])
    if not all(token in test_output for token in ["tests 11", "pass 11", "fail 0"]):
        raise RuntimeError("M2 TAP totals were not 11 pass / 0 fail")
    validate_output = run(["node", "tools/character-pose-process/m2-runner.mjs", "--validate-only"])
    validate = json.loads(validate_output)
    run(["python", "tools/character-pose-process/m2-analyze.py"])

    proposal = load(PROOF / "synthetic-compositor-proposal.json")
    history_failure = load(RUN / "actual-history-failure.json")
    history = load(RUN / "actual-history.json")
    receipt = load(RUN / "receipt.json")
    request = load(RUN / "request-body.json")
    audit = load(RUN / "audit.json")
    observations = load(RUN / "observations-final.json")
    ledger = load(RUN / "ledger.json")
    record = history[PROMPT_ID]

    checks = {
        "proposalPin": sha(PROOF / "synthetic-compositor-proposal.json") == PROPOSAL_SHA,
        "schemaPin": sha(PROOF / "parent-evidence" / "node-schemas.json") == SCHEMA_SHA,
        "compositePin": sha(RUN / "composite.png") == COMPOSITE_SHA,
        "maskPin": sha(RUN / "transparency-mask.png") == MASK_SHA,
        "reconstructedPreFixLibraryPin": sha(RUN / "m2-runner-lib-pre-protocol-fix.reconstructed.mjs") == OLD_LIB_SHA,
        "initialAndFinalHistoryBytesEqual": (RUN / "actual-history-failure.json").read_bytes() == (RUN / "actual-history.json").read_bytes(),
        "historyObjectsEqual": history_failure == history,
        "historyPromptId": record["prompt"][1] == PROMPT_ID,
        "historyClientId": record["prompt"][3]["client_id"] == "gamifysurgery-pose-process-m2-run-001",
        "historyGraphEqualsProposal": record["prompt"][2] == proposal["graph"],
        "requestGraphEqualsProposal": request["prompt"] == proposal["graph"],
        "requestClientId": request["client_id"] == "gamifysurgery-pose-process-m2-run-001",
        "receiptPromptId": receipt["promptId"] == PROMPT_ID and json.loads(receipt["rawResponseText"])["prompt_id"] == PROMPT_ID,
        "auditPromptId": audit["promptId"] == PROMPT_ID,
        "auditExecutionMs": audit["execution"]["durationMs"] == 1084,
        "auditDownloadMs": audit["download"]["durationMs"] == 71,
        "auditUnknownQueueAndOperator": audit["queueDurationMs"] is None and audit["operatorDurationMs"] is None,
        "ledgerFourEvents": ledger["revision"] == 4 and ledger["summary"]["eventCount"] == 4,
        "ledgerOneCorrection": ledger["summary"]["corrections"] == 1,
        "ledgerNoSavingsOrReuse": ledger["summary"]["reusedPieceUses"] == 0,
        "observedFixedCanvas": observations["canvasAndClipping"]["fixedOutputSizeObserved"] == [448, 1024],
        "observedClockwise": observations["orientation"]["clockwiseSignObserved"] is True,
        "observedNoRebase": observations["canvasAndClipping"]["expansionOrRebaseObserved"] is False,
        "observedHistoriesEqual": observations["protocol"]["initialAndFinalHistoryByteIdentical"] is True,
        "validateOnlyPin": validate["proposalSha256"] == PROPOSAL_SHA and validate["schemaSha256"] == SCHEMA_SHA,
    }
    if not all(checks.values()):
        raise RuntimeError(f"final validation failures: {[name for name, passed in checks.items() if not passed]}")

    validation = {
        "schemaVersion": 1,
        "state": "synthetic-mechanics-candidate-reviewed",
        "promptId": PROMPT_ID,
        "submissionCount": 1,
        "resumeCount": 1,
        "tests": {"command": "node --test tools/character-pose-process/m2-runner.test.mjs", "passed": 11, "failed": 0},
        "validateOnly": validate,
        "checks": checks,
        "metrics": {"serverExecutionMs": 1084, "downloadMs": 71, "queueMs": None, "operatorMs": None, "savingsMeasured": False},
        "scope": {"syntheticOnly": True, "privateArtProcessed": False, "modelsUsed": False, "uploadsUsed": False},
        "protocolCorrection": "Windows output-subfolder separators normalized for fixed-path comparison; same prompt resumed, no resubmission or raster correction.",
    }
    validation_path = RUN / "m2-final-validation.json"
    write_or_verify(validation_path, validation)

    files = [
        TOOLS / "m2-runner-lib.mjs", TOOLS / "m2-runner.mjs", TOOLS / "m2-runner.test.mjs", TOOLS / "m2-README.md", TOOLS / "m2-analyze.py", TOOLS / "m2-finalize.py",
        *sorted(path for path in RUN.iterdir() if path.is_file() and path.name != "m2-final-checksums.json"),
    ]
    checksums = {
        "schemaVersion": 1,
        "state": "final-current-m2-files",
        "historicalManifestContext": "m2-offline-checksums.json records pre-execution/pre-protocol-fix state and does not verify the current runner library.",
        "excludes": ["m2-final-checksums.json (self)"],
        "entries": {str(path.relative_to(REPO)).replace("\\", "/"): sha(path) for path in files},
    }
    write_or_verify(RUN / "m2-final-checksums.json", checksums)
    print(json.dumps({"ok": True, "checks": len(checks), "testsPassed": 11, "filesHashed": len(files), "ledgerRevision": 4}))


if __name__ == "__main__":
    main()
