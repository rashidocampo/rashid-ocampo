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
            className={`block rounded-full border px-4 py-1 text-base transition ${
              active === t.slug ? "border-royal bg-royal text-white" : "border-navy-800/25 text-navy-800 hover:border-royal hover:text-royal"
            }`}
          >
            {t.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
