import { lazy, Suspense } from "react";
import { AppShell } from "./AppShell";
import type { PrototypeShellProps } from "./shellContract";
import { usePresentationLayout } from "./shellPresentation";

const MobileShell = lazy(() => import("./mobile/MobileShell"));

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
