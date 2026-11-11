import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Parallax from "@/components/Parallax";
import { getSettings } from "@/lib/data";
import { headlineFonts, site, SITE_URL, themePalette } from "@/lib/site";

export const viewport: Viewport = { themeColor: "#06153a" };

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSettings();
  const title = `${site.name} — ${st.tagline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${site.name}` },
    description: st.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: SITE_URL }],
    creator: site.name,
    openGraph: { type: "website", siteName: site.name, locale: "en_US", title, description: st.description, url: "/" },
    twitter: { card: "summary_large_image", title, description: st.description },
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  };
}

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
