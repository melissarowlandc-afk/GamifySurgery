import { useRef, useState, type ComponentProps } from "react";
import type { MobilePrototypeTools as ExpandedMobilePrototypeTools } from "../MobilePrototypeTools";
import { MobileRestartDialog } from "../desktopPanelAdapters";

/** Phone confirmations do not pause, change speed, or invoke a command before acceptance. */
export function MobilePerformanceTools(props: ComponentProps<typeof ExpandedMobilePrototypeTools>) {
  const [pending, setPending] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const accepted = useRef(false);
  const request = () => { accepted.current = false; setPending(true); };
  const confirm = () => {
    if (!pending || accepted.current) return;
    accepted.current = true;
    setPending(false);
    props.onFastForward();
  };
  return <div className="development-copy mobile-prototype-tools">
    <div className="development-actions">
      <button type="button" onClick={props.onAddMoney}>{props.view.addMoneyLabel}</button>
      <button type="button" onClick={request}>{props.view.fastForwardLabel}</button>
      <MobileRestartDialog paused={props.paused} onTogglePause={props.onTogglePause} onRestart={props.onRestart} onOpenChange={props.onRestartOpenChange} />
    </div>
    {pending ? <section role="alertdialog" aria-label={`Confirm ${props.view.fastForwardLabel}`} className="mobile-tools-confirm">
      <h3>{props.view.fastForwardLabel}?</h3>
      <p>This advances the clinic in one batch. Your phone may be briefly busy.</p>
      <button type="button" onClick={() => setPending(false)}>Cancel</button>
      <button type="button" onClick={confirm}>Confirm {props.view.fastForwardLabel}</button>
    </section> : null}
    <dl>
      <div><dt>Campaign</dt><dd>{props.view.campaignIdLabel}</dd></div>
      <div><dt>FSRS histories</dt><dd>{props.view.learningHistoryLabel}</dd></div>
      <div><dt>Scored reviews</dt><dd>{props.view.reviewCountLabel}</dd></div>
    </dl>
    <label className="prototype-toggle"><input type="checkbox" checked={props.tutorialsEnabled}
      onChange={event => props.onTutorialsEnabledChange(event.currentTarget.checked)} /><span><strong>Tutorial guidance</strong><small>Show first-run coaching for untouched campaigns.</small></span></label>
    <button type="button" onClick={() => setCardsOpen(!cardsOpen)}>{cardsOpen ? "Close FSRS cards" : "Inspect FSRS cards"}</button>
    {cardsOpen ? <ul>{props.view.learningCards.map(card => <li key={card.conceptId}><strong>{card.conceptLabel}</strong> <span>{card.statusLabel}</span></li>)}</ul> : null}
  </div>;
}
