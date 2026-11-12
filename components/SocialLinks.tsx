import { socialIcons } from "./NavIcons";

const order = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["youtube", "YouTube"],
  ["tiktok", "TikTok"],
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
] as const;

/** Round outlined icon links in the site's colours. Only networks with a link are shown. */
export default function SocialLinks({ links }: { links: Partial<Record<(typeof order)[number][0], string>> }) {
  const items = order.filter(([key]) => /^https?:\/\//.test(links[key] ?? ""));
  if (!items.length) return null;
  return (
    <ul className={`shrink-0 gap-2 sm:flex sm:gap-2.5 ${items.length > 3 ? "grid grid-cols-3" : "flex"}`}>
      {items.map(([key, label]) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11 border border-white/35 text-white/85 transition duration-300 hover:-translate-y-1 hover:border-sky hover:bg-royal hover:text-white [&>svg]:h-5 [&>svg]:w-5"
          >
            {socialIcons[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
