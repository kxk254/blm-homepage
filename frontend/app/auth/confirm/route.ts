import { NextRequest, NextResponse } from "next/server";
import { forwardSetCookies } from "@/src/lib/api/client";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://backend:8000";

// パスワード再設定メールのリンク先。tokenをFastAPIに検証してもらい、
// 発行されたセッションCookieをそのまま引き継いでから本来の遷移先(next)へ進める
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");
  const next = searchParams.get("next") ?? "/account";

  if (token) {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const backendRes = await fetch(
      `${BACKEND_URL}/api/auth/confirm?token=${encodeURIComponent(token)}`,
      {
        cache: "no-store",
        headers: forwardedProto ? { "X-Forwarded-Proto": forwardedProto } : undefined,
      }
    );

    if (backendRes.ok) {
      await forwardSetCookies(backendRes);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account/login`);
}
