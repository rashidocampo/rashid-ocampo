import ReactMarkdown, { type Components } from "react-markdown";

// Keep Qur'anic verses visually separate from surrounding Filipino prose.
// This is a display-only transformation; the saved sermon text is unchanged.
function spaceVerses(markdown: string): string {
  return markdown.replace(
    /﴿[^﴾]*﴾(?:[ \t]*\[[^\]\n]{1,100}\])?/g,
    (verse) => "\n\n" + verse.trim() + "\n\n",
  );
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
      <ReactMarkdown components={components}>{spaceVerses(children)}</ReactMarkdown>
    </div>
  );
}
