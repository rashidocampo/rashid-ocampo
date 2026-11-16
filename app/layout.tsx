import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import HeaderAudio from "@/components/HeaderAudio";
import Motion from "@/components/Motion";
import Footer from "@/components/Footer";
import { getPages, getSettings } from "@/lib/data";
import { buildNav, SITE_URL, siteFont, themePalette } from "@/lib/site";

export const viewport: Viewport = { themeColor: "#fbf9f4" };

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
    facebook: { appId: '1974758140352853' },
    twitter: { card: "summary_large_image", title, description: st.description },
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [st, pages] = await Promise.all([getSettings(), getPages()]);
  const font = siteFont(st.headlineFont);
  const heading = st.headingOnlyFont ? siteFont(st.headingOnlyFont) : font;
  const vars = { "--font-display": heading.family, "--font-body": font.family, "--display-weight": heading.weight, "--display-tracking": heading.tracking, ...themePalette(st.themeColor) } as React.CSSProperties;
  return (
    <html lang="en" className="min-h-full antialiased">
      <body className="flex min-h-screen min-h-dvh flex-col" style={vars}>
        {/* Marks that scripts run, so animated pieces can start hidden; shows everything if the motion script never arrives */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');setTimeout(function(){var c=document.documentElement.classList;if(!c.contains('motion-ready'))c.add('motion-off')},4000)" }} />
        <Motion />
        <Header name={st.headerTitle} items={buildNav(st, pages)} logoEnabled={st.logoEnabled} logoImage={st.logoImage} />
        <HeaderAudio src={st.headerAudioUrl} />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
