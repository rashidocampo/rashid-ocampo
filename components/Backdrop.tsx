import Smoke from "./Smoke";

/**
 * Layered section backdrop: the ornamental pattern tinted with the theme colour,
 * and (on dark sections) an aurora. "smoke" gives the aurora slow, curling smoke-like motion.
 * Each layer scrolls at its own speed.
 */
export default function Backdrop({ tone = "dark", aurora = true, smoke = false }: { tone?: "dark" | "light"; aurora?: boolean; smoke?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className={`pattern absolute -inset-y-[18%] inset-x-0 ${tone === "dark" ? "bg-sky opacity-[0.2]" : "bg-royal opacity-[0.1]"}`} data-parallax="0.32" />
      {aurora && smoke && (
        <div className="absolute -inset-y-[8%] inset-x-0" data-parallax="0.16">
          <Smoke />
        </div>
      )}
      {aurora && !smoke && (
        <div className="aurora" data-parallax="0.16">
          <span /><span /><span /><span />
        </div>
      )}
    </div>
  );
}
