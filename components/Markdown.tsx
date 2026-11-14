import ReactMarkdown, { type Components } from "react-markdown";

// Separate Arabic citations from surrounding prose, even when the source
// contains them on the same line. Leave short honorifics and names inline.
// The database content is not modified.
function formatReadingText(markdown: string): string {
  const arabic = /[\u0600-\u06FF]/g;
  const quoted = /﴿[^﴾\n]+﴾|«[^»\n]+»|“[^”\n]*[\u0600-\u06FF][^”\n]*”/g;
  return markdown.split("\n").map((line) => {
    if (!/[A-Za-zÀ-ž]/.test(line) || /^\s*(?:#{1,6}\s|[-*+]\s|\d+\.\s|>\s)/.test(line)) return line;
    let result = line.replace(quoted, (match) =>
      (match.match(arabic)?.length ?? 0) >= 8 ? "\n\n" + match + "\n\n" : match
    );
    // Also handle unquoted Arabic hadith excerpts embedded in Filipino text.
    result = result.replace(
      /[\u0600-\u06FF][\u0600-\u06FF\u064B-\u065F\s،؛؟ـًٌٍَُِّْٰ\u06D6-\u06ED]{18,}[\u0600-\u06FF]/g,
      (match) => (match.match(arabic)?.length ?? 0) >= 16 ? "\n\n" + match.trim() + "\n\n" : match
    );
    return result.replace(/\n{3,}/g, "\n\n");
  }).join("\n");
}

const auto = (Tag: "p" | "h1" | "h2" | "h3" | "li" | "blockquote") => {
  const C = ({ node: _node, ...props }: { node?: unknown } & React.HTMLAttributes<HTMLElement>) => <Tag dir="auto" {...props} />;
  return C;
};
const components = {
  p: auto("p"), h1: auto("h1"), h2: auto("h2"), h3: auto("h3"), li: auto("li"), blockquote: auto("blockquote"),
} as Components;

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-post">
      <ReactMarkdown components={components}>{formatReadingText(children)}</ReactMarkdown>
    </div>
  );
}
