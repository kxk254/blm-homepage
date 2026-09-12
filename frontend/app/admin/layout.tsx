import { ReactNode } from "react";
import type { Metadata } from "next";

// 管理画面は絶対に検索結果に出してはいけない(robots.tsのdisallowと二重で防止)
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
