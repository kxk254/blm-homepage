import { NextResponse, type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://backend:8000";

// SupabaseAuthのセッションはリフレッシュトークンの回転が必要だったため毎リクエスト
// Cookie書き戻しが必須だったが、JWTセッションは自己完結していて書き戻し不要になった。
// そのため管理者ガードが必要な/admin/*だけ、FastAPIにログイン状態を問い合わせれば済む。
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = request.headers.get("cookie") ?? "";
    let isAdmin = false;
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { cookie },
        cache: "no-store",
      });
      if (res.ok) {
        const user = (await res.json()) as { isAdmin?: boolean };
        isAdmin = user.isAdmin === true;
      }
    } catch {
      // バックエンドに到達できない場合も安全側に倒して未ログイン扱いにする
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
