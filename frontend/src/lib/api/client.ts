import "server-only";
import { cookies, headers } from "next/headers";

// docker-compose内ではサービス名で名前解決できるため、Next.jsのサーバー側から
// FastAPIを直接(nginxを経由せず)呼ぶ。ブラウザからの相対パス`/api/...`はnginxが
// 同じFastAPIへ転送するので、パスの形は両者で揃えてある。
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://backend:8000";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const detail =
      body && typeof body === "object" && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : `API error (status ${status})`;
    super(detail);
    this.status = status;
    this.body = body;
  }
}

function parseSetCookie(setCookieStr: string) {
  const parts = setCookieStr.split(";").map((part) => part.trim());
  const [rawName, ...rawValueParts] = parts[0].split("=");
  const name = rawName;
  const value = rawValueParts.join("=");

  const options: {
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    expires?: Date;
  } = {};

  for (const attr of parts.slice(1)) {
    const [rawKey, rawVal] = attr.split("=");
    switch (rawKey.toLowerCase()) {
      case "path":
        options.path = rawVal;
        break;
      case "max-age":
        options.maxAge = Number(rawVal);
        break;
      case "httponly":
        options.httpOnly = true;
        break;
      case "secure":
        options.secure = true;
        break;
      case "samesite":
        options.sameSite = rawVal?.toLowerCase() as "lax" | "strict" | "none";
        break;
      case "expires":
        options.expires = new Date(rawVal);
        break;
    }
  }

  return { name, value, options };
}

/**
 * FastAPIのレスポンスが持つSet-CookieをすべてNext.js側のCookieに書き戻す。
 * Server Componentから呼ばれた場合は書き込みができないため、失敗は無視する
 * （ログイン状態の反映はproxy.tsのmiddlewareが担当する）。
 */
export async function forwardSetCookies(res: Response) {
  const cookieStore = await cookies();
  for (const raw of res.headers.getSetCookie?.() ?? []) {
    const { name, value, options } = parseSetCookie(raw);
    try {
      cookieStore.set(name, value, options);
    } catch {
      // no-op
    }
  }
}

/**
 * Server Components/Server Actions/Route HandlersからFastAPIを呼ぶための共通fetch。
 * ブラウザのCookie(セッションJWT)をそのまま転送し、FastAPI側でセッションが
 * 発行・更新・削除された場合(Set-Cookie)はNext.js側のCookieにも書き戻す。
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const requestHeaders: Record<string, string> = { cookie: cookieHeader };
  // FormData(画像アップロード等)の場合はboundary付きのContent-Typeを
  // fetchに自動設定させる必要があるため、ここでは付与しない
  if (typeof init.body === "string") {
    requestHeaders["Content-Type"] = "application/json";
  }
  // ブラウザ→nginx→Next.jsの実際のプロトコル(nginxがX-Forwarded-Protoを付与)を
  // backendまで伝える。backend(uvicorn)自体は常にhttpで喋るため、これが無いと
  // 本番でHTTPS化してもセッションCookieにSecure属性が付かなくなる
  const forwardedProto = (await headers()).get("x-forwarded-proto");
  if (forwardedProto) {
    requestHeaders["X-Forwarded-Proto"] = forwardedProto;
  }
  Object.assign(requestHeaders, init.headers as Record<string, string> | undefined);

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
  });

  await forwardSetCookies(res);

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // ボディがJSONでない場合はnullのままにする
    }
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export function apiPost<T>(path: string, data?: unknown, init: RequestInit = {}) {
  return apiFetch<T>(path, {
    ...init,
    method: "POST",
    body: data !== undefined ? JSON.stringify(data) : init.body,
  });
}

export function apiPut<T>(path: string, data: unknown, init: RequestInit = {}) {
  return apiFetch<T>(path, { ...init, method: "PUT", body: JSON.stringify(data) });
}

export function apiPatch<T>(path: string, data: unknown, init: RequestInit = {}) {
  return apiFetch<T>(path, { ...init, method: "PATCH", body: JSON.stringify(data) });
}

export function apiDelete<T>(path: string, init: RequestInit = {}) {
  return apiFetch<T>(path, { ...init, method: "DELETE" });
}
