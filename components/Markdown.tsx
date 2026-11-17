import React, { type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

// Never rewrite article text while rendering it.
function plainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (React.isValidElement<{ children?: ReactNode }>(node)) return plainText(node.props.children);
  return "";
}

const auto = (Tag: "p" | "h1" | "h2" | "h3" | "li" | "blockquote") => {
  const C = ({ node: _node, children, ...props }: { node?: unknown } & React.HTMLAttributes<HTMLElement>) => {
    const text = plainText(children).trim();
    const firstLetter = text.match(/[\p{L}]/u)?.[0] ?? "";
    const arabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/u.test(firstLetter);
    return <Tag dir={arabic ? "rtl" : "ltr"} style={{ textAlign: arabic ? "right" : "left" }} {...props}>{children}</Tag>;
  };
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
