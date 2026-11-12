import { useEffect, useState } from "react";
import { readLastIntroTagline, selectIntroTagline, writeLastIntroTagline } from "../content/introTaglines";
import { OpeningWordmark } from "./OpeningWordmark";
import "./OpeningBrand.css";

/** A displayed screen keeps its line through stage, status and Retry changes. */
export function OpeningBrand({ heading = false }: { heading?: boolean }) {
  const [tagline] = useState(() => selectIntroTagline(readLastIntroTagline()));
  useEffect(() => { writeLastIntroTagline(tagline); }, [tagline]);
  return <div className="welcome-brand">
    <OpeningWordmark heading={heading} />
    <p className="welcome-tagline" data-testid="intro-tagline">{tagline}</p>
  </div>;
}
