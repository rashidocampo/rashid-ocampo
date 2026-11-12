import { socialIcons } from "./NavIcons";

const order = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["youtube", "YouTube"],
  ["tiktok", "TikTok"],
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
] as const;

/** Square outlined icon links. Only networks with a link are shown. */
export default function SocialLinks({ links }: { links: Partial<Record<(typeof order)[number][0], string>> }) {
  const items = order.filter(([key]) => /^https?:\/\//.test(links[key] ?? ""));
  if (!items.length) return null;
  return (
    <ul className={`shrink-0 gap-2 sm:flex ${items.length > 3 ? "grid grid-cols-3" : "flex"}`}>
      {items.map(([key, label]) => (
        <li key={key}>
          <a href={links[key]} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} data-magnetic className="btn btn-line !min-h-11 !w-11 !p-0 text-white/85 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:transition-transform [&>svg]:duration-500 hover:[&>svg]:rotate-[360deg]">
            {socialIcons[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
