import { useEffect, useState } from "react";
import { CLINIC_PRESENTATION_EVENT, CLINIC_PRESENTATION_RETRY, type ClinicPresentation } from "./clinicPresentation";
import { LoadingRest, useLoadingFlow, useLoadingFlowSnapshot } from "./LoadingFlowContext";
import { LoadingScreen } from "./LoadingScreen";

/** Observes presentation, never grants or changes game/session authority. */
export function ClinicPresentationGate({ campaignId, authorized, onRetry }: {
  campaignId: string; authorized: boolean; onRetry?(): void;
}) {
  const flow = useLoadingFlow();
  useLoadingFlowSnapshot(); // Re-evaluate safe recovery availability at a deadline.
  const [frame, setFrame] = useState<ClinicPresentation>("waiting");
  useEffect(() => {
    if (!flow) return;
    setFrame("waiting");
    const update = () => {
      const host = document.querySelector<HTMLElement>('[data-testid="facility-canvas"]');
      const value = host?.getAttribute("data-clinic-frame");
      setFrame(value === "ready" || value === "failed" ? value : "waiting");
    };
    document.addEventListener(CLINIC_PRESENTATION_EVENT, update); update();
    return () => document.removeEventListener(CLINIC_PRESENTATION_EVENT, update);
  }, [flow, campaignId]);
  useEffect(() => { if (frame === "ready") flow?.advance("frame"); }, [flow, frame]);
  if (!flow) return null;
  const retry = () => {
    const host = document.querySelector<HTMLElement>('[data-testid="facility-canvas"]');
    if (frame !== "ready" && host) { setFrame("waiting"); host.dispatchEvent(new Event(CLINIC_PRESENTATION_RETRY)); }
    else onRetry?.();
  };
  return <>
    <LoadingScreen active={frame !== "ready"} phase="art" status="Getting your clinic ready…"
      failure={frame === "failed" ? "Clinic pictures could not load. Your saved copies are safe." : null}
      onRetry={onRetry || typeof document !== "undefined" && document.querySelector('[data-testid="facility-canvas"]') ? retry : undefined} />
    <LoadingRest ready={frame === "ready" && authorized} />
  </>;
}
