import { useEffect, useRef, useState } from "react";
import { useCompetitionClient } from "./useCompetition";
import { useCasualMode } from "../playtime/UsageProvider";
import { CompetitionAccessError, COMPETITION_PRIVACY_NOTICE, type CompetitionBoard } from "./types";
import "./competition.css";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Shared presentation; mounting on either Management tab refreshes the board. */
export function ClinicCompetitionPanel() {
  const client = useCompetitionClient();
  const casualMode = useCasualMode();
  const [board, setBoard] = useState<CompetitionBoard | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const epoch = useRef(0);
  const refresh = async () => {
    if (!client) return;
    const request = ++epoch.current; setBusy(true); setError("");
    if (casualMode === false) void client.flush();
    try {
      const next = await client.leaderboard();
      if (request === epoch.current) setBoard(next);
    } catch (failure) {
      if (failure instanceof CompetitionAccessError) client.clear();
      if (request === epoch.current) setError("Clinic Competition could not be refreshed. Check your connection and try again.");
    } finally { if (request === epoch.current) setBusy(false); }
  };
  useEffect(() => {
    setBoard(null); void refresh();
    return () => { epoch.current++; };
  }, [client, casualMode]);
  const changeHidden = async () => {
    if (!client || !board || busy) return;
    const request = ++epoch.current, hidden = !board.hidden;
    setBusy(true); setError("");
    try {
      await client.setHidden(hidden);
      if (request !== epoch.current) return;
      // Confirm only after the server accepts. Keep the confirmed switch value
      // even if a subsequent read fails (the visibility write already succeeded).
      setBoard({ ...board, hidden, rows: board.rows.map(row => row.isSelf && hidden ? { ...row, rank: null } : row) });
      const next = await client.leaderboard();
      if (request === epoch.current) setBoard(next);
    } catch (failure) {
      if (failure instanceof CompetitionAccessError) client.clear();
      if (request === epoch.current) setError("Competition visibility could not be confirmed. Refresh to check it, then try again.");
    } finally { if (request === epoch.current) setBusy(false); }
  };
  return <section className="clinic-competition" aria-label="Clinic Competition">
    <header><h3>Clinic Competition</h3>{client ? <button type="button" disabled={busy} onClick={() => void refresh()}>Refresh competition</button> : null}</header>
    {casualMode ? <p>Casual players aren't ranked</p> : null}
    {!client ? <p>Clinic Competition is available when signed in to an invited player account.</p> : <>
      <p>Each player's best clinic, ranked by average daily revenue over its last 3 completed game days. Clinics with fewer completed days use 1 or 2 days.</p>
      <p>Revenue is gross patient, service and retail income before expenses. Today's income is excluded.</p>
      <p>{COMPETITION_PRIVACY_NOTICE}</p>
      {casualMode === false ? <button type="button" className="competition-visibility" role="switch" aria-checked={board?.hidden ?? false}
        disabled={!board || busy} onClick={() => void changeHidden()}>Hide my clinic from the competition</button> : null}
      {busy ? <p role="status">Loading Clinic Competition...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {board?.hidden && casualMode === false ? <p>Your clinic is hidden from other players. Only you can see its unranked row.</p> : null}
      {board && board.rows.length === 0 ? <p>{casualMode ? "No clinics yet." : "No clinics yet. Complete a game day to enter your clinic."}</p> : null}
      {board && casualMode === false && !board.rows.some(row => row.isSelf) ? <p>Your clinic will appear after a completed game day is submitted. Older clinics may need one new complete day to establish their revenue history.</p> : null}
      {board && board.rows.length > 0 ? <div className="competition-table-wrap"><table>
        <thead><tr><th scope="col">Rank</th><th scope="col">Clinic</th><th scope="col">Level</th><th scope="col">Average daily revenue</th></tr></thead>
        <tbody>{board.rows.map((row, index) => <tr key={`${row.rank ?? "hidden"}:${index}`} className={row.isSelf ? "competition-self" : undefined}>
          <td>{row.rank ?? (board.hidden ? "Hidden" : "Pending refresh")}</td><th scope="row">{row.clinicName}{row.isSelf ? <small>Your clinic</small> : null}</th>
          <td>{row.facilityLevel}</td><td>{dollars.format(row.averageDailyRevenueCents / 100)}<small>{row.daysCounted} completed {row.daysCounted === 1 ? "day" : "days"}</small></td>
        </tr>)}</tbody>
      </table></div> : null}
    </>}
  </section>;
}
