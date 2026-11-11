import { getSettings } from "@/lib/data";
import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = "Rashid Ocampo — sharing the beauty of Islam";
export const size = ogSize;
export const contentType = "image/jpeg";

export default async function Image() {
  const st = await getSettings();
  return ogImage({ st, eyebrow: st.greeting, title: site.name, banner: st.tagline, text: st.description, photo: st.heroImage, position: `${st.heroX}% ${st.heroY}%` });
}
