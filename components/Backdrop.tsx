/**
 * Layered section backdrop: the ornamental pattern tinted with the theme colour,
 * and (on dark sections) drifting aurora curtains. Each layer scrolls at its own speed.
 */
export default function Backdrop({ tone = "dark", aurora = true }: { tone?: "dark" | "light"; aurora?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className={`pattern absolute -inset-y-[18%] inset-x-0 ${tone === "dark" ? "bg-sky opacity-[0.2]" : "bg-royal opacity-[0.1]"}`} data-parallax="0.32" />
      {aurora && (
        <div className="aurora" data-parallax="0.16">
          <span /><span /><span /><span />
        </div>
      )}
    </div>
  );
}
