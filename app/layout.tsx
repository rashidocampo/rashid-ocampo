import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPages, getSettings } from "@/lib/data";
import { buildNav, headlineFonts, SITE_URL, themePalette } from "@/lib/site";

export const viewport: Viewport = { themeColor: "#06153a" };

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSettings();
  const title = `${st.siteName} — ${st.tagline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${st.siteName}` },
    description: st.description,
    applicationName: st.siteName,
    authors: [{ name: st.siteName, url: SITE_URL }],
    creator: st.siteName,
    openGraph: { type: "website", siteName: st.siteName, locale: "en_US", title, description: st.description, url: "/" },
    twitter: { card: "summary_large_image", title, description: st.description },
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [st, pages] = await Promise.all([getSettings(), getPages()]);
  const font = headlineFonts[st.headlineFont] ?? headlineFonts.serif;
  const vars = { "--font-display": font.family, "--display-weight": font.weight, "--display-tracking": font.tracking, ...themePalette(st.themeColor) } as React.CSSProperties;
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={vars}>
        <Header name={st.siteName} items={buildNav(st, pages)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
