import type { MetadataRoute } from "next";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";

const baseUrl = "https://blmf.jp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await db
    .select({ id: products.id, createdAt: products.createdAt })
    .from(products);

  const productUrls: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${baseUrl}/shop/${item.id}`,
    lastModified: item.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tokushoho`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...productUrls,
  ];
}
