import { useId } from "react";

const W = 1200;
const H = 400;

/** One strand of the ribbon: the strands fan out and cross over, like a twisting band of light. */
function strand(t: number) {
  let d = "";
  for (let x = 0; x <= W; x += 24) {
    const u = x / W;
    const y =
      H / 2 +
      (t - 0.5) * 150 * Math.cos(u * Math.PI * 2.2 + 0.6) +
      62 * Math.sin(u * Math.PI * 1.8 + t * 0.9) +
      (t - 0.5) * 40;
    d += (x === 0 ? "M" : "L") + x + " " + y.toFixed(1);
  }
  return d;
}

/** Decorative flowing ribbon of fine light lines. Colour comes from `currentColor`. */
export default function Ribbons({ className = "", lines = 18 }: { className?: string; lines?: number }) {
  const id = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.3" stopColor="currentColor" />
          <stop offset="0.7" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: lines }, (_, i) => (
        <path key={i} d={strand(i / (lines - 1))} stroke={`url(#${id})`} strokeWidth={i % 6 === 0 ? 1.6 : 0.8} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
