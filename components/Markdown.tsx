import ReactMarkdown, { type Components } from "react-markdown";

// Preserve each quotation as a single unit. Never split Arabic words or
// detach the surrounding quotation marks into separate paragraphs.
function formatReadingText(markdown: string): string {
  return markdown.replace(
    /(﴿[^﴾\n]+﴾|«[^»\n]+»)([،,]?)((?:[ \t]*\[[^\]\n]{1,100}\])?)/g,
    (full, quotation: string, punctuation: string, reference: string) => {
      // Only move long Arabic quotations; short honorifics stay inline.
      if ((quotation.match(/[\u0621-\u064A]/g) ?? []).length < 12) return full;
      return "\n\n" + quotation + punctuation + reference + "\n\n";
    }
  ).replace(/\n{3,}/g, "\n\n");
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
