import Admin from "@/components/admin/Admin";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-paper via-white to-[#e6e9f0] px-5 pb-32 pt-10 text-navy-900 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Admin />
      </div>
    </section>
  );
}
