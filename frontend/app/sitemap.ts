import type { MetadataRoute } from "next";
import { apiFetch } from "@/src/lib/api/client";
import type { Product } from "@/src/lib/api/types";

const baseUrl = "https://blmf.jp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await apiFetch<Product[]>("/api/products");

  const productUrls: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${baseUrl}/shop/${item.id}`,
    lastModified: new Date(item.createdAt),
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
      url: `${baseUrl}/care`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
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
