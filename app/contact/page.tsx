import Markdown from "@/components/Markdown";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/data";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Rashid Ocampo: questions about Islam, speaking invitations, or a simple salām.",
  alternates: { canonical: "/contact" },
};

export default async function Contact() {
  const st = await getSettings();
  return (
    <PageShell eyebrow="CONTACT" title="Get in Touch">
      <div className="max-w-2xl"><Markdown>{st.contactText}</Markdown></div>
    </PageShell>
  );
}
