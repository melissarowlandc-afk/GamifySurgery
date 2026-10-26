import { lazy, Suspense } from "react";
import { AppShell } from "./AppShell";
import type { PrototypeShellProps } from "./shellContract";
import { usePresentationLayout } from "./shellPresentation";

const loadMobileShell = () => import("./mobile/MobileShell");
const MobileShell = lazy(loadMobileShell);

/** Fetch presentation code while entry is open; this never mounts a session. */
export async function preloadPrototypeShell(layout: "desktop" | "phone"): Promise<void> {
  if (layout === "phone") await loadMobileShell();
}

/** Layout owns presentation only; App keeps its one session and projection. */
export function PrototypeShell(props: PrototypeShellProps) {
  const layout = usePresentationLayout();
  if (layout === "desktop") return <AppShell {...props} />;
  return (
    <Suspense fallback={<p role="status">Loading phone layout…</p>}>
      <MobileShell {...props} />
    </Suspense>
  );
}
