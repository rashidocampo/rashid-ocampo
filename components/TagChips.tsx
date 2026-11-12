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
            className={`flex min-h-11 items-center rounded-[6px] border px-4 text-[0.9375rem] transition-colors duration-200 ${
              active === t.slug ? "border-navy-900 bg-navy-900 text-white" : "hairline text-navy-800 hover:border-navy-900"
            }`}
          >
            {t.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
