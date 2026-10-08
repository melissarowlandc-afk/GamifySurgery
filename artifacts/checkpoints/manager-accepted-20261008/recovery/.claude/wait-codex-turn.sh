#!/usr/bin/env bash
# Read-only waiter for Codex worker threads used by the Claude manager thread.
# Watches the thread's rollout log under ~/.codex/sessions until a new turn
# ends (task_complete or turn_aborted), then prints the worker's final message.
# It never writes to ~/.codex.
#
# Usage:
#   wait-codex-turn.sh <thread-id> --count
#       Print how many turns have ended so far (use as a baseline before queueing).
#   wait-codex-turn.sh <thread-id> [--baseline N] [--timeout SECONDS]
#       Wait until more than N turns have ended (default N = count at start),
#       then print the outcome. Default timeout 3600 s; exit 2 on timeout.
set -euo pipefail

usage="usage: wait-codex-turn.sh <thread-id> [--count | --baseline N] [--timeout SECONDS]"
id="${1:?$usage}"; shift
case "$id" in *[!0-9a-fA-F-]*) echo "invalid thread id: $id" >&2; exit 64 ;; esac

mode=wait baseline="" timeout=3600 interval=15
while [ $# -gt 0 ]; do
  case "$1" in
    --count) mode=count ;;
    --baseline) baseline="${2:?$usage}"; shift ;;
    --timeout) timeout="${2:?$usage}"; shift ;;
    *) echo "$usage" >&2; exit 64 ;;
  esac
  shift
done

sessions="${CODEX_HOME:-$HOME/.codex}/sessions"
find_log() { find "$sessions" -name "rollout-*-$id.jsonl" -print -quit 2>/dev/null; }
ended() { grep -cE '"payload":\{"type":"(task_complete|turn_aborted)"' "$1" || true; }

log="$(find_log)"
if [ "$mode" = count ]; then
  if [ -z "$log" ]; then echo 0; else ended "$log"; fi
  exit 0
fi

if [ -z "$baseline" ]; then
  if [ -z "$log" ]; then baseline=0; else baseline="$(ended "$log")"; fi
fi

deadline=$(( $(date +%s) + timeout ))
while :; do
  [ -z "$log" ] && log="$(find_log)"
  if [ -n "$log" ] && [ "$(ended "$log")" -gt "$baseline" ]; then break; fi
  if [ "$(date +%s)" -ge "$deadline" ]; then
    echo "TIMEOUT: thread $id had no new finished turn after ${timeout}s (baseline $baseline)." >&2
    exit 2
  fi
  sleep "$interval"
done

winlog="$(cygpath -w "$log" 2>/dev/null || echo "$log")"
python -I - "$winlog" <<'PY'
import json, sys
sys.stdout.reconfigure(encoding="utf-8")
last = None
with open(sys.argv[1], encoding="utf-8") as f:
    for line in f:
        if '"task_complete"' in line or '"turn_aborted"' in line:
            try:
                rec = json.loads(line)
            except ValueError:
                continue
            if rec.get("payload", {}).get("type") in ("task_complete", "turn_aborted"):
                last = rec
p = last["payload"]
print(f"thread log: {sys.argv[1]}")
print(f"turn ended: {p['type']} at {last.get('timestamp')} (turn {p.get('turn_id')})")
if p.get("duration_ms") is not None:
    print(f"duration: {p['duration_ms'] / 1000:.0f}s")
print("--- worker final message ---")
print(p.get("last_agent_message") or "(no final message recorded)")
PY
