import { revalidateTag } from "next/cache";
import { ADMIN_EMAIL, SUPABASE_KEY, SUPABASE_URL } from "@/lib/site";

// Called by the admin dashboard after saving, so the public pages refresh immediately.
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: auth },
    cache: "no-store",
  });
  const user = res.ok ? await res.json() : null;
  if (user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag("site", { expire: 0 });
  return Response.json({ ok: true });
}
