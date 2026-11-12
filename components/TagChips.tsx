import Link from "next/link";
import type { Tag } from "@/lib/site";

export default function TagChips({ tags, active }: { tags: Tag[]; active?: string }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t.id}>
          <Link
            href={`/tag/${t.slug}`}
            dir="auto"
            aria-current={active === t.slug ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-full border px-5 text-[0.9375rem] transition-colors duration-200 ${
              active === t.slug ? "border-royal bg-royal text-white" : "hairline text-navy-800 hover:border-royal hover:text-royal"
            }`}
          >
            {t.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
