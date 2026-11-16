"use client";

import { useState, type ReactNode } from "react";
import { Bookmark } from "@/components/Icons";

type ShelfEntry = {
  slug: string;
  title: string;
  card: ReactNode;
};

export default function BookShelf({ entries }: { entries: ShelfEntry[] }) {
  const [selected, setSelected] = useState("");
  const visible = entries.filter((entry) => selected === "" || entry.slug === selected);

  return (
    <section id="library" className="books-shelf" aria-labelledby="books-shelf-title">
      <div className="books-shelf-heading">
        <h2 id="books-shelf-title"><Bookmark className="books-section-icon" />My Books</h2>
        {entries.length > 1 && (
          <select
            aria-label="Filter books"
            aria-controls="books-list"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            <option value="">All Books</option>
            {entries.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.title}</option>)}
          </select>
        )}
      </div>
      {entries.length ? (
        <ul id="books-list" className="books-cards">
          {visible.map((entry) => <li className="books-card" key={entry.slug}>{entry.card}</li>)}
        </ul>
      ) : (
        <p className="books-empty">The first book will be added soon.</p>
      )}
    </section>
  );
}
