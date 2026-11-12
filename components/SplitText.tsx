import { Fragment } from "react";

/** Text split into words (and optionally letters), each in its own mask, so headings can rise into place piece by piece. */
export default function SplitText({ text, letters = false }: { text: string; letters?: boolean }) {
  const words = text.trim().split(/\s+/);
  return (
    <span aria-label={text} role="text" className="split">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="sw">
            {letters
              ? Array.from(w).map((ch, j) => <span key={j} className="swi">{ch}</span>)
              : <span className="swi">{w}</span>}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
