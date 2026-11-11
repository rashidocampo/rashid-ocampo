import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Parallax from "@/components/Parallax";
import { getSettings } from "@/lib/data";
import { defaultSettings, headlineFonts, site, themePalette } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: `${site.name} — Balik-Islam`, template: `%s — ${site.name}` },
  description: defaultSettings.description,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const st = await getSettings();
  const font = headlineFonts[st.headlineFont] ?? headlineFonts.solid;
  const vars = { "--font-display": font.family, "--display-weight": font.weight, "--display-transform": font.transform, ...themePalette(st.themeColor) } as React.CSSProperties;
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={vars}>
        <Parallax />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
