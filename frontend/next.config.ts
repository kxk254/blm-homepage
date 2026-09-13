import type { NextConfig } from "next";

// 商品画像はNAS由来で、nginxが同一オリジンの/media配下として配信するため、
// next/imageはリモートパターン設定なしでそのまま最適化できる
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://backend:8000";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // AboutページはHomeに統合したため、既存のブックマーク/検索結果向けに転送する
        source: "/about",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // 本番はnginxが/apiをbackendへ転送するのでNext.jsはここを経由しないが、
    // nginxなしでnext dev/next startを直接叩くローカル開発時のために
    // ブラウザ側からの相対パスfetch("/api/...")もbackendへ転送しておく
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
