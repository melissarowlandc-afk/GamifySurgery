"""Capture full command output and status without modifying shared configuration."""
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
repo = Path(__file__).resolve().parents[3]
root = repo / "artifacts/character-statics/staff-gapfill-v6d/validation"
root.mkdir(parents=True, exist_ok=True)
name, *command = sys.argv[1:]
assert re.fullmatch(r"[a-z0-9-]+", name) and command
started = datetime.now(timezone.utc).isoformat()
executable = shutil.which(command[0])
assert executable, "missing executable: " + command[0]
result = subprocess.run([executable, *command[1:]], cwd=repo, stdout=subprocess.PIPE,
                        stderr=subprocess.STDOUT, check=False)
log = root / (name + ".txt")
log.write_bytes(result.stdout)
receipt = {"command": command, "cwd": str(repo), "startedAt": started,
           "finishedAt": datetime.now(timezone.utc).isoformat(), "exitCode": result.returncode,
           "log": log.relative_to(repo).as_posix(),
           "sha256": hashlib.sha256(result.stdout).hexdigest()}
(root / (name + "-command.json")).write_text(json.dumps(receipt, indent=2) + "\n",
                                            encoding="utf-8", newline="\n")
output = result.stdout.decode("utf-8", errors="replace")
print("\n".join(output.splitlines()[-40:]))
print(json.dumps(receipt))
sys.exit(result.returncode)
