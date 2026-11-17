import ReactMarkdown, { type Components } from "react-markdown";

// Render the stored article exactly as authored. Formatting belongs in the
// article's Markdown, not in automatic text transformations.
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
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
