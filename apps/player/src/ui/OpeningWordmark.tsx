import "./OpeningWordmark.css";

/** Shared title treatment from OpeningSequence, including its existing fonts. */
export function OpeningWordmark({ heading = false }: { heading?: boolean }) {
  const Tag = heading ? "h1" : "span";
  return <Tag className="opening-wordmark">Stitchin’ Time</Tag>;
}
