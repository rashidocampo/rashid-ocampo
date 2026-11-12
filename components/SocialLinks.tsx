import { socialIcons } from "./NavIcons";

const order = [
  ["youtube", "YouTube"],
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["tiktok", "TikTok"],
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
] as const;

/** Plain icon links for the dark bottom bar. Only networks with a link are shown. */
export default function SocialLinks({ links }: { links: Partial<Record<(typeof order)[number][0], string>> }) {
  const items = order.filter(([key]) => /^https?:\/\//.test(links[key] ?? ""));
  if (!items.length) return null;
  return (
    <ul className="-mx-2 flex flex-wrap items-center">
      {items.map(([key, label]) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white [&>svg]:h-5 [&>svg]:w-5"
          >
            {socialIcons[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
