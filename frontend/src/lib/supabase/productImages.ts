import "server-only";
import { createAdminClient } from "./admin";
import { PRODUCT_IMAGES_BUCKET } from "./storage";

export interface BucketImage {
  name: string;
  url: string;
}

export async function listBucketImages(): Promise<BucketImage[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .list("", { sortBy: { column: "created_at", order: "desc" } });

  if (error || !data) return [];

  return data
    .filter((file) => file.id !== null) // フォルダのプレースホルダー行を除外
    .map((file) => {
      const { data: publicUrlData } = admin.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .getPublicUrl(file.name);
      return { name: file.name, url: publicUrlData.publicUrl };
    });
}
