import { getPosts, getSettings } from "@/lib/data";
import { ogImage, ogSize } from "@/lib/og";
import { formatDate } from "@/lib/site";

export const alt = "Blog post by Rashid Ocampo";
export const size = ogSize;
export const contentType = "image/jpeg";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [st, posts] = await Promise.all([getSettings(), getPosts()]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return ogImage({ st, eyebrow: st.greeting, title: st.siteName, banner: st.tagline, text: st.description, photo: st.heroImage });
  return ogImage({
    st,
    eyebrow: `${st.siteName} · ${formatDate(post.published_at)}`,
    title: post.title,
    text: post.excerpt,
    photo: post.cover_url ?? st.heroImage,
    position: post.cover_url ? "50% 50%" : `${st.heroX}% ${st.heroY}%`,
  });
}
