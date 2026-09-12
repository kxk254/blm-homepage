import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

// アクセスの度にSupabaseのセッショントークンを更新し、Cookieに書き戻す。
// これをmiddlewareでやらないと、有効期限が切れたセッションがServer Componentに
// 渡り続けてログアウトが検知できなくなる。
// ついでにgetUser()の結果も返す（proxy.ts側でadminロール判定に使うため、
// 二重にSupabaseへ問い合わせずに済む）。
export async function updateSession(
  request: NextRequest
): Promise<{ response: NextResponse; user: User | null }> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // getUser()はSupabaseに問い合わせてトークンを検証する（getSession()はしない）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}
