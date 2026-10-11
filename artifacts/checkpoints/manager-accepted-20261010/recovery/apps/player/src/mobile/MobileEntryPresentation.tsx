import { useEffect } from "react";
import "./mobileEntry.css";

/** Presentation lifecycle only. App's AuthGate/opening markup and handlers stay shared. */
export default function MobileEntryPresentation() {
  useEffect(() => {
    const body = document.body;
    const previous = body.getAttribute?.("data-phone-entry") ?? null;
    body.setAttribute("data-phone-entry", "true");
    return () => {
      if (previous === null) body.removeAttribute("data-phone-entry");
      else body.setAttribute("data-phone-entry", previous);
    };
  }, []);
  return null;
}
