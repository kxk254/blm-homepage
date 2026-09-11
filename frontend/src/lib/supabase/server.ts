import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server ComponentsやRoute Handlersからログイン中のユーザーを取得するためのクライアント。
// Server Componentからの呼び出しはCookie書き込みができないため失敗を握りつぶす
// （セッションの更新はmiddlewareが担当する）。
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Componentから呼ばれた場合は無視する
          }
        },
      },
    }
  );
}
