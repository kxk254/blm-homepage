import "server-only";
import { createClient } from "@supabase/supabase-js";

// service_roleキーはRLS/Storageポリシーを完全にバイパスするため、
// このクライアントはサーバー専用の管理操作（画像アップロード等）でのみ使うこと。
// 絶対にNEXT_PUBLIC_の環境変数に入れたりクライアントに渡したりしない。
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (see .env.example)."
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
