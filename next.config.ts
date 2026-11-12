import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // Balik Islam chapters moved from the blog into the Books library; old links keep working.
  async redirects() {
    const moved: [string, string][] = [
      ["mga-barya", "kabanata-1-mga-barya"],
      ["kabanata-2-sa-kabilang-dagat", "kabanata-2-sa-kabilang-dagat"],
      ["kabanata-3-ang-madre-sa-bisikleta", "kabanata-3-ang-madre-sa-bisikleta"],
      ["kabanata-4-ang-babaeng-balot-na-balot", "kabanata-4-ang-babaeng-balot-na-balot"],
      ["kabanata-5-mga-aklat", "kabanata-5-mga-aklat"],
      ["kabanata-6-alas-dos-ng-hapon", "kabanata-6-alas-dos-ng-hapon"],
    ];
    return moved.map(([from, to]) => ({ source: `/blog/${from}`, destination: `/books/balik-islam/${to}`, permanent: true }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
