import Markdown from "@/components/Markdown";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Contact" };

export default async function Contact() {
  const st = await getSettings();
  return (
    <PageShell eyebrow="CONTACT" title="Get in Touch">
      <div className="max-w-2xl"><Markdown>{st.contactText}</Markdown></div>
    </PageShell>
  );
}
