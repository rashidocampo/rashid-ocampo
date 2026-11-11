import Markdown from "@/components/Markdown";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata = { title: "About" };

export default async function About() {
  const st = await getSettings();
  return (
    <PageShell eyebrow="ABOUT" title={`${site.name}, ${st.tagline.replace(/^A /, "a ")}`}>
      <div className="max-w-2xl space-y-5">
        <p>{st.description}</p>
        <Markdown>{st.aboutText}</Markdown>
      </div>
    </PageShell>
  );
}
