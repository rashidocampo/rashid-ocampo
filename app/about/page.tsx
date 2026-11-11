import PageShell from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata = { title: "About" };

export default function About() {
  return (
    <PageShell eyebrow="ABOUT" title={`${site.name}, a Balik-Islam`}>
      <div className="max-w-2xl space-y-5">
        <p>{site.description}</p>
        <p className="text-navy-700">My full story is being written and will be shared here soon, in shā’ Allāh.</p>
      </div>
    </PageShell>
  );
}
