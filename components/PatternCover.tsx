import { useId } from "react";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4 };

/** Geometric tiles: [tile width, tile height, drawing]. Colours come from the theme. */
const tiles: [number, number, React.ReactNode][] = [
  // overlapping circles
  [40, 40, <g key="k" {...S}><circle cx="20" cy="20" r="20" /><circle cx="0" cy="0" r="20" /><circle cx="40" cy="0" r="20" /><circle cx="0" cy="40" r="20" /><circle cx="40" cy="40" r="20" /></g>],
  // scales
  [40, 20, <g key="k" {...S}><path d="M0 20a20 20 0 0 1 40 0M6 20a14 14 0 0 1 28 0M12 20a8 8 0 0 1 16 0" /><path d="M-20 10a20 20 0 0 1 40 0M-14 10a14 14 0 0 1 28 0M-8 10a8 8 0 0 1 16 0M20 10a20 20 0 0 1 40 0M26 10a14 14 0 0 1 28 0M32 10a8 8 0 0 1 16 0" /></g>],
  // triangles
  [40, 34.64, <g key="k" {...S}><path d="M0 34.64 20 0l20 34.64M0 0h40M0 34.64h40" /><path d="M20 0 30 17.32H10Z" fill="currentColor" fillOpacity=".35" stroke="none" /></g>],
  // diamonds
  [36, 36, <g key="k" {...S}><path d="M18 0 36 18 18 36 0 18Z" /><path d="M18 9l9 9-9 9-9-9Z" fill="currentColor" fillOpacity=".3" stroke="none" /></g>],
  // chevrons
  [44, 26, <g key="k" {...S} strokeWidth={3}><path d="M-2 14 22 1l24 13M-2 27 22 14l24 13" /></g>],
  // honeycomb
  [41.57, 72, <g key="k" {...S}><path d="M0 12 20.78 0l20.79 12M0 12v24M41.57 12v24M0 36l20.78 12 20.79-12M20.78 48v24" /></g>],
  // quarter arcs
  [48, 48, <g key="k" {...S}><path d="M0 24a24 24 0 0 0 24-24M48 24a24 24 0 0 0-24 24M0 12A12 12 0 0 0 12 0M48 36a12 12 0 0 0-12 12" /><circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" /></g>],
  // woven squares
  [32, 32, <g key="k" {...S}><path d="M4 4h10v10H4zM18 18h10v10H18z" /><path d="M18 4h10v10H18zM4 18h10v10H4z" fill="currentColor" fillOpacity=".28" stroke="none" /></g>],
];

/** Small stable number from a piece of text, so each post always gets the same design. */
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Cover artwork for posts without a photo: a geometric pattern in the theme's colours.
 * The pattern, its angle, its scale and the light direction all vary from post to post.
 */
export default function PatternCover({ seed, className = "" }: { seed: string; className?: string }) {
  const id = useId();
  const h = hash(seed);
  const [w, ht, art] = tiles[h % tiles.length];
  const angle = [0, 15, 30, 45, -15, -30][(h >>> 4) % 6];
  const scale = [0.9, 1.15, 1.4][(h >>> 8) % 3];
  const flip = (h >>> 11) % 2 === 1;
  const glowX = 15 + ((h >>> 13) % 70);
  return (
    <svg className={`absolute inset-0 h-full w-full text-sky ${className}`} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}g`} x1={flip ? "1" : "0"} y1="0" x2={flip ? "0" : "1"} y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-navy-800)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--color-royal)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-royal-light)" }} />
        </linearGradient>
        <radialGradient id={`${id}r`} cx={`${glowX}%`} cy="30%" r="60%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}p`} width={w} height={ht} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle}) scale(${scale})`}>
          {art}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}g)`} />
      <rect width="100%" height="100%" fill={`url(#${id}p)`} opacity="0.55" />
      <rect width="100%" height="100%" fill={`url(#${id}r)`} />
    </svg>
  );
}
