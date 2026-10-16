import type { ComponentProps } from "react";
import type { AppShell } from "./AppShell";
import type { MobileBuildActions } from "./mobile/build/types";

/** Both presentations receive the existing desktop views and session actions. */
export type PrototypeShellProps = ComponentProps<typeof AppShell> & {
  /** Consumed only by the phone shell; AppShell's contract/behavior is unchanged. */
  mobileBuildActions?: MobileBuildActions;
};
