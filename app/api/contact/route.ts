import { createHash } from "node:crypto";
import { SUPABASE_URL } from "@/lib/site";

export const runtime = "nodejs";
const json = (message: string, status: number) => Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !service || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return json("Contact submissions are not yet enabled.", 503);
  if (Number(request.headers.get("content-length") || 0) > 12000) return json("Message too large.", 413);
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== request.headers.get("host")) return json("Invalid request origin.", 403);
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return json("Invalid submission.", 400); }
  const str = (key: string) => typeof data[key] === "string" ? (data[key] as string).trim() : "";
  const name = str("name"), email = str("email"), subject = str("subject"), message = str("message"), token = str("token");
  if (str("website") || !Number.isFinite(Number(data.started)) || Date.now() - Number(data.started) < 3500) return json("Submission rejected.", 400);
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || subject.length < 3 || subject.length > 120 || message.length < 10 || message.length > 4000 || token.length < 10 || token.length > 3000) return json("Please check your message fields.", 400);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256").update(ip + ":" + (process.env.CONTACT_HASH_SALT || secret)).digest("hex");
  const headers = { apikey: service, Authorization: "Bearer " + service, "Content-Type": "application/json" };
  const rate = await fetch(SUPABASE_URL + "/rest/v1/rpc/contact_check_rate", { method: "POST", headers, body: JSON.stringify({ p_key: key }), cache: "no-store" }).catch(() => null);
  if (!rate?.ok) return json("Contact service temporarily unavailable.", 503);
  if (await rate.json() !== true) return json("Too many attempts. Please try again later.", 429);
  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form, cache: "no-store" }).catch(() => null);
  if (!verify?.ok) return json("Verification unavailable.", 503);
  const result = await verify.json();
  if (!result.success || result.hostname !== new URL(origin).hostname) return json("Security verification failed. Please retry.", 403);
  const fingerprint = createHash("sha256").update(email.toLowerCase() + "\n" + subject + "\n" + message).digest("hex");
  const saved = await fetch(SUPABASE_URL + "/rest/v1/contact_messages", { method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ name, email, subject, message, fingerprint }), cache: "no-store" }).catch(() => null);
  if (saved?.status === 409) return json("This message has already been submitted.", 409);
  if (!saved?.ok) return json("Unable to save your message. Please retry.", 503);
  return Response.json({ message: "Message received securely." }, { headers: { "Cache-Control": "no-store" } });
}
