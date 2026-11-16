/** Text on article thumbnails. Compact preview, with the entire title revealed on hover or keyboard focus. */
export default function CoverTitle({ title }: { title: string }) {
  const preview = Array.from(title).slice(0, 12).join("");
  const shortened = Array.from(title).length > 12;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="relative z-10 w-full px-2.5 pb-2.5 text-white sm:px-3 sm:pb-3">
        <span className="block break-words text-[11px] font-semibold leading-[1.35] drop-shadow-sm sm:text-xs group-hover:hidden group-focus-visible:hidden">
          {preview}{shortened ? "…" : ""}
        </span>
        <span dir="auto" className="hidden max-h-full break-words text-[10px] font-medium leading-[1.4] drop-shadow-sm group-hover:block group-focus-visible:block sm:text-xs">
          {title}
        </span>
      </div>
    </div>
  );
}
