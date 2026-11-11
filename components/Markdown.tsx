import ReactMarkdown, { type Components } from "react-markdown";

// dir="auto" lets a paragraph that starts in Arabic run right-to-left on its own.
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
