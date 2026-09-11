import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// アクセスの度にSupabaseのセッショントークンを更新し、Cookieに書き戻す。
// これをmiddlewareでやらないと、有効期限が切れたセッションがServer Componentに
// 渡り続けてログアウトが検知できなくなる。
export async function updateSession(request: NextRequest) {
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
  await supabase.auth.getUser();

  return supabaseResponse;
}
