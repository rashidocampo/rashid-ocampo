import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Parallax from "@/components/Parallax";
import { defaultSettings, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: `${site.name} — Balik-Islam`, template: `%s — ${site.name}` },
  description: defaultSettings.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Parallax />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
