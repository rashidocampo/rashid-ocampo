/** A line of text that drifts sideways forever. The content is repeated so the loop has no seam. */
export default function Marquee({ items, className = "", reverse = false, speed = 36 }: { items: string[]; className?: string; reverse?: boolean; speed?: number }) {
  if (!items.length) return null;
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`marquee ${className}`} aria-hidden>
      <div className="marquee-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}>
        {[0, 1].map((k) => (
          <div key={k} className="marquee-row">
            {row.map((t, i) => (
              <span key={i} className="marquee-item">
                <span dir="auto">{t}</span>
                <svg viewBox="0 0 24 24" className="marquee-dot"><path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" fill="currentColor" /></svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
