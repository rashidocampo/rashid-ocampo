import PageShell from "@/components/PageShell";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <PageShell eyebrow="CONTACT" title="Get in Touch">
      <div className="max-w-2xl space-y-5">
        <p>Questions about Islam, invitations to speak, or simply a salām — you are welcome to reach out.</p>
        <p className="text-navy-700">Contact details will be added here soon, in shā’ Allāh.</p>
      </div>
    </PageShell>
  );
}
