import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Balik-Islam`,
    short_name: site.name,
    description: "Sharing the beauty of Islam, reflections on faith, and reminders to return to Allah.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f4",
    theme_color: "#fbf9f4",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
