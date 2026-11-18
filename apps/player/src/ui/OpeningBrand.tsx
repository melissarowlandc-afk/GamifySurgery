import { useEffect, useState } from "react";
import { readLastIntroTagline, selectIntroTagline, writeLastIntroTagline, type IntroTagline } from "../content/introTaglines";
import { useLoadingFlowSnapshot } from "./LoadingFlowContext";
import { OpeningWordmark } from "./OpeningWordmark";
import "./OpeningBrand.css";

/** A displayed screen keeps its line through stage, status and Retry changes. */
export function OpeningBrand({ heading = false, fixedTagline, remember }: { heading?: boolean; fixedTagline?: IntroTagline; remember?: boolean }) {
  const flow = useLoadingFlowSnapshot();
  const [tagline] = useState(() => fixedTagline ?? selectIntroTagline(readLastIntroTagline()));
  const visible = remember ?? !flow?.active;
  useEffect(() => { if (visible) writeLastIntroTagline(tagline); }, [tagline, visible]);
  return <div className="welcome-brand">
    <OpeningWordmark heading={heading} />
    <p className="welcome-tagline" data-testid="intro-tagline">{tagline}</p>
  </div>;
}
