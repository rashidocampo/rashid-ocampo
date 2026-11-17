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
  // eight-pointed star lattice
  [64, 64, <g key="k" {...S}><path d="M32 2 41 23 62 32 41 41 32 62 23 41 2 32 23 23Z M32 12 52 32 32 52 12 32Z M0 0l16 16M64 0 48 16M0 64l16-16M64 64 48 48" /></g>],
  // interlaced octagons
  [56, 56, <g key="k" {...S}><path d="M16 0h24l16 16v24L40 56H16L0 40V16Z M28 0 56 28 28 56 0 28Z M8 8h40v40H8z" /></g>],
  // mashrabiya window grid
  [48, 48, <g key="k" {...S}><path d="M24 0C9 0 0 11 0 24v24h48V24C48 11 39 0 24 0Z M24 8C14 8 8 16 8 25v15h32V25C40 16 34 8 24 8Z M24 8v32M8 24h32" /></g>],
  // rosettes
  [60, 60, <g key="k" {...S}><circle cx="30" cy="30" r="24"/><circle cx="30" cy="30" r="9"/><path d="M30 6Q45 30 30 54Q15 30 30 6ZM6 30Q30 15 54 30Q30 45 6 30Z M13 13l34 34M47 13 13 47" /></g>],
  // woven diagonal ribbons
  [48, 48, <g key="k" {...S}><path d="M-12 12 12-12 60 36 36 60ZM-12 36 36-12 60 12 12 60Z M0 0l48 48M48 0 0 48" /></g>],
  // geometric sunburst
  [64, 64, <g key="k" {...S}><circle cx="32" cy="32" r="12"/><path d="M32 0v20m0 24v20M0 32h20m24 0h20M9 9l14 14m18 18 14 14M55 9 41 23M23 41 9 55M16 0l16 20L48 0M16 64l16-20 16 20" /></g>],
  // hexagonal flower lattice
  [60, 52, <g key="k" {...S}><path d="M15 0h30l15 26-15 26H15L0 26Z M30 0v52M0 26h60M15 0l30 52M45 0 15 52" /><circle cx="30" cy="26" r="9"/></g>],
  // arches and columns
  [52, 64, <g key="k" {...S}><path d="M3 64V28Q3 3 26 3T49 28v36M12 64V29Q12 14 26 14T40 29v35M26 14v50M0 63h52M3 35h46" /></g>],
  // nested mihrab niches
  [72, 80, <g key="k" {...S}><path d="M8 80V34Q8 9 36 3Q64 9 64 34V80M18 80V36Q18 20 36 14Q54 20 54 36V80M28 80V39Q28 31 36 26Q44 31 44 39V80M0 80h72M8 56h10m36 0h10" /></g>],
  // kufic-inspired stepped maze
  [64, 64, <g key="k" {...S} strokeWidth={2}><path d="M4 4h24v12H16v12h32V4h12v36H36v12h24v8H4V40h20V28H4Z M32 16v12M16 52v8" /></g>],
  // tessellated eight-point petals
  [72, 72, <g key="k" {...S}><path d="M36 4 45 27 68 36 45 45 36 68 27 45 4 36 27 27Z M36 16 56 36 36 56 16 36Z M36 16v40M16 36h40M0 0l16 16M72 0 56 16M0 72l16-16M72 72 56 56" /></g>],
  // concentric lantern silhouettes
  [64, 80, <g key="k" {...S}><path d="M32 3v9M23 12h18M18 24q14-18 28 0l5 12v28H13V36ZM18 64h28l-5 9H23ZM13 36h38M23 36v28M41 36v28M13 50h38M23 24l9 12 9-12" /></g>],
  // geometric prayer-rug medallions
  [76, 96, <g key="k" {...S}><rect x="4" y="4" width="68" height="88" rx="2"/><rect x="10" y="10" width="56" height="76"/><path d="M38 18 54 38 38 58 22 38Z M38 26 46 38 38 50 30 38Z M10 70h56M18 76h40M18 18h40" /></g>],
  // offset circular mosaics
  [64, 64, <g key="k" {...S}><circle cx="0" cy="0" r="22"/><circle cx="64" cy="0" r="22"/><circle cx="0" cy="64" r="22"/><circle cx="64" cy="64" r="22"/><circle cx="32" cy="32" r="22"/><path d="M0 32h64M32 0v64M0 0l64 64M64 0 0 64" /></g>],
  // pointed arch trellis
  [56, 76, <g key="k" {...S}><path d="M0 76V29Q0 11 28 0Q56 11 56 29v47M8 76V32Q8 19 28 11Q48 19 48 32v44M16 76V34Q16 27 28 21Q40 27 40 34v42M0 51h56M0 65h56" /></g>],
  // woven diamond chain
  [64, 64, <g key="k" {...S}><path d="M32 0 64 32 32 64 0 32Z M32 10 54 32 32 54 10 32Z M32 20 44 32 32 44 20 32Z M0 0l64 64M64 0 0 64M0 32h64M32 0v64" /></g>],
  // star-and-crescent ornamental repeat
  [72, 72, <g key="k" {...S}><path d="M28 7a26 26 0 1 0 29 40A23 23 0 0 1 28 7Z M49 10l4 10 11 1-8 7 2 11-9-6-9 6 2-11-8-7 11-1Z" /><circle cx="18" cy="54" r="3"/></g>],
  // botanical arabesque vines
  [72, 88, <g key="k" {...S}><path d="M36 0C6 18 65 32 36 44S6 70 36 88M36 15Q9 3 9 25Q29 31 36 15ZM36 31Q63 17 63 41Q44 48 36 31ZM36 58Q9 46 9 68Q29 76 36 58ZM36 75Q63 61 63 85Q44 91 36 75Z M36 0v88" /></g>],
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
