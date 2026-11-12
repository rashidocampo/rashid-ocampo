"use client";

import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import { socialIcons } from "./NavIcons";

const order = [
  ["facebook", "Facebook", "pop"],
  ["instagram", "Instagram", "spin"],
  ["youtube", "YouTube", "pop"],
  ["tiktok", "TikTok", "wave"],
  ["linkedin", "LinkedIn", "pop"],
  ["github", "GitHub", "wave"],
] as const;

/** Social links as a glass pill, matching the main menu. Only networks with a link are shown. */
export default function SocialLinks({ links }: { links: Partial<Record<(typeof order)[number][0], string>> }) {
  const items = order
    .filter(([key]) => /^https?:\/\//.test(links[key] ?? ""))
    .map(([key, label, fx]) => ({ label, href: links[key], target: "_blank", icon: socialIcons[key], fx }));
  if (!items.length) return null;
  return <LiquidNavbar tone="dark" compact hoverSelect label="Social media" items={items} />;
}
