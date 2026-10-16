import { Children, cloneElement, isValidElement, useEffect, useRef, type ComponentProps, type ReactNode, type ReactPortal } from "react";
import { ChartPanel } from "../ui/ChartPanel";
import { BuildPanel } from "../ui/BuildPanel";
import { CampaignManager } from "../ui/CampaignManager";
import { RoomActionMenu } from "../ui/RoomActionMenu";
import { RestartDialog } from "../ui/RestartDialog";
import { EmployeeDiscussionPanel, employeeDiscussionChartView } from "../ui/EmployeeDiscussionPanel";

/**
 * Desktop renderers portal to body. Calling each renderer unconditionally in
 * its own mobile adapter keeps its hooks and handlers, but hosts its returned
 * portals locally. No global portal patch or desktop component change.
 */
export function inlineDesktopPortals(node: ReactNode): ReactNode {
  if (node && typeof node === "object" && "$$typeof" in node &&
      node.$$typeof === Symbol.for("react.portal")) {
    return inlineDesktopPortals((node as ReactPortal).children);
  }
  if (Array.isArray(node)) return Children.map(node, inlineDesktopPortals);
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children !== undefined) {
    return cloneElement(node, undefined, inlineDesktopPortals(node.props.children));
  }
  return node;
}

export function MobileChartPanel(props: ComponentProps<typeof ChartPanel>) {
  return inlineDesktopPortals(ChartPanel(props));
}
export function MobileBuildPanel(props: ComponentProps<typeof BuildPanel>) {
  return inlineDesktopPortals(BuildPanel(props));
}
export function MobileCampaignManager(props: ComponentProps<typeof CampaignManager>) {
  return inlineDesktopPortals(CampaignManager(props));
}
export function MobileRoomActionMenu(props: ComponentProps<typeof RoomActionMenu>) {
  return inlineDesktopPortals(RoomActionMenu(props));
}
export function MobileRestartDialog(props: ComponentProps<typeof RestartDialog> & { onOpenChange?: (open: boolean) => void }) {
  const resumeOnUnmount = useRef(false);
  const latest = useRef(props);
  latest.current = props;
  const node = RestartDialog({ ...props,
    onTogglePause: () => { resumeOnUnmount.current = !props.paused; props.onTogglePause(); },
    onRestart: () => { resumeOnUnmount.current = false; props.onRestart(); },
  });
  const open = Children.toArray(node.props.children).some((child) => child && typeof child === "object" && "$$typeof" in child && child.$$typeof === Symbol.for("react.portal"));
  useEffect(() => { props.onOpenChange?.(open); }, [open, props.onOpenChange]);
  useEffect(() => () => {
    latest.current.onOpenChange?.(false);
    if (resumeOnUnmount.current && latest.current.paused) latest.current.onTogglePause();
  }, []);
  return inlineDesktopPortals(node);
}
export function MobileEmployeeDiscussionPanel(props: ComponentProps<typeof EmployeeDiscussionPanel>) {
  return <MobileChartPanel chart={employeeDiscussionChartView(props.discussion)}
    onClose={props.onClose} onSubmitAnswer={props.onAnswer} onFlagQuestion={props.onFlagQuestion ?? (() => {})}
    onAcknowledgeTerminalFeedback={props.onAcknowledge} onToggleSummary={() => {}} onFileChart={props.onFile} />;
}
