import { createContext, useContext, useId, useLayoutEffect, useSyncExternalStore } from "react";
import { LoadingFlow } from "./loadingFlow";

export const LoadingFlowContext = createContext<LoadingFlow | null>(null);
export const useLoadingFlow = () => useContext(LoadingFlowContext);
export function useLoadingFlowSnapshot() {
  const flow = useLoadingFlow();
  return useSyncExternalStore(flow?.subscribe ?? (() => () => {}), flow?.getSnapshot ?? (() => null), () => null);
}

/** A definitive resting state, never a speculative intermediate screen. */
export function LoadingRest({ ready = true, delayMs = 0 }: { ready?: boolean; delayMs?: number }) {
  const flow = useLoadingFlow(), snapshot = useLoadingFlowSnapshot(), id = useId();
  useLayoutEffect(() => {
    if (!ready || !delayMs) { flow?.rest(id, ready); return; }
    const timer = setTimeout(() => flow?.rest(id, true), delayMs);
    return () => { clearTimeout(timer); flow?.forgetRest(id); };
  }, [flow, id, ready, delayMs, snapshot?.epoch]);
  useLayoutEffect(() => () => flow?.forgetRest(id), [flow, id]);
  return null;
}
