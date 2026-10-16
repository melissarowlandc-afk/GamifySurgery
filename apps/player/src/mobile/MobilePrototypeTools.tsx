import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";
import { DevelopmentPanel } from "../ui/DevelopmentPanel";
import { RestartDialog } from "../ui/RestartDialog";
import { MobileRestartDialog } from "./desktopPanelAdapters";

/** Same projected tools/handlers, already disclosed inside the phone tools sheet. */
export function MobilePrototypeTools(props: ComponentProps<typeof DevelopmentPanel> & { onRestartOpenChange?: (open: boolean) => void }) {
  const panel = DevelopmentPanel(props);
  const copy = Children.toArray(panel.props.children).filter(child => !isValidElement(child) || child.type !== "summary");
  const adapt = (node: ReactNode): ReactNode => {
    if (!isValidElement<{ children?: ReactNode }>(node)) return node;
    if (node.type === RestartDialog) return <MobileRestartDialog {...node.props as ComponentProps<typeof RestartDialog>} onOpenChange={props.onRestartOpenChange} />;
    if (node.props.children === undefined) return node;
    return cloneElement(node, { children: Children.map(node.props.children, adapt) });
  };
  return <div className="mobile-prototype-tools">{Children.map(copy, adapt)}</div>;
}
