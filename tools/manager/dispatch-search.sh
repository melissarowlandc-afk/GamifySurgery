#!/usr/bin/env bash
# Manager dispatch wrapper WITH live web search (source-verification lanes only; owner-approved 2026-11-19 flow). Otherwise identical to dispatch.sh.
# is always appended and every prompt/result is on disk.
# Usage: tools/manager/dispatch.sh <name> <thread-id|new> <model> <effort> <repo-dir> [read-only]
#   <name>      prompt file .local-dev/manager/prompts/<name>.txt must exist
#   <thread-id> existing Codex thread to resume, or "new"
#   <model>     gpt-6.2-sol | gpt-6-luna | gpt-6.2-astra   (owner 2026-11-19; never gpt-6-sol, gpt-6.1-sol, gpt-6-astra)
#   <effort>    max | high | medium
#   <repo-dir>  working directory (main tree or GS-release)
#   read-only   optional 6th arg: sandbox read-only (reviews)
set -u
MG="C:/Users/rowla/Projects/GamifySurgery/.local-dev/manager"
FOOTER="C:/Users/rowla/Projects/GamifySurgery/tools/manager/dispatch-footer.txt"
CODEX="$(command -v codex || true)"; [ -n "$CODEX" ] || CODEX="/c/Program Files/WindowsApps/OpenAI.Codex_26.1111.9664.0_x64__2p2nqsd0c76g0/app/resources/codex.exe"  # standalone CLI on PATH first (owner 2026-11-19)
NAME="${1:?name}"; THREAD="${2:?thread}"; MODEL="${3:?model}"; EFFORT="${4:?effort}"; DIR="${5:?dir}"; MODE="${6:-workspace-write}"
mkdir -p "$MG/prompts" "$MG/out"
[ -s "$FOOTER" ] || { echo "$NAME refused: footer missing"; exit 2; }
[ -s "$MG/prompts/$NAME.txt" ] || { echo "$NAME refused: prompt missing or empty"; exit 2; }
[ -d "$DIR" ] || { echo "$NAME refused: dir missing"; exit 2; }
case "$MODEL" in gpt-6.2-sol|gpt-6-luna|gpt-6.2-astra) ;; *) echo "$NAME refused: model $MODEL not allowed"; exit 2;; esac
[ "$MODE" = read-only ] || MODE=workspace-write
[ -f "$MG/out/$NAME-out.md" ] && mv "$MG/out/$NAME-out.md" "$MG/out/$NAME-out.prev-$(date -u +%Y%m%dT%H%M%S).md"
PROMPT="$(cat "$MG/prompts/$NAME.txt" "$FOOTER")"
printf '{"event":"start","name":"%s","thread":"%s","model":"%s","effort":"%s","dir":"%s","mode":"%s","utc":"%s"}\n' "$NAME" "$THREAD" "$MODEL" "$EFFORT" "$DIR" "$MODE" "$(date -u +%FT%TZ)" >> "$MG/dispatch-log.jsonl"
cd "$DIR" || exit 2
if [ "$THREAD" = new ]; then
  "$CODEX" --search exec -m "$MODEL" -c "model_reasoning_effort=$EFFORT" -c 'windows.sandbox="unelevated"' -s "$MODE" -C "$DIR" \
    -o "$MG/out/$NAME-out.md" "$PROMPT" < /dev/null > "$MG/out/$NAME.log" 2>&1
else
  "$CODEX" exec resume "$THREAD" -m "$MODEL" -c "model_reasoning_effort=$EFFORT" -c 'windows.sandbox="unelevated"' \
    -c "sandbox_mode=\"$MODE\"" -o "$MG/out/$NAME-out.md" "$PROMPT" < /dev/null > "$MG/out/$NAME.log" 2>&1
fi
rc=$?
SID=$(grep -m1 -o 'session id: [0-9a-f-]*' "$MG/out/$NAME.log" | cut -d' ' -f3)
printf '{"event":"end","name":"%s","exit":%s,"session":"%s","utc":"%s"}\n' "$NAME" "$rc" "$SID" "$(date -u +%FT%TZ)" >> "$MG/dispatch-log.jsonl"
echo "exit $rc session $SID"
cat "$MG/out/$NAME-out.md" 2>/dev/null
exit $rc
