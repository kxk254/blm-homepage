import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Blue Millefeuille",
    short_name: "Blue Millefeuille",
    description:
      "日常にそっときらめきを添えるハンドメイドアクセサリーショップ",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfcfa",
    theme_color: "#fdfcfa",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
