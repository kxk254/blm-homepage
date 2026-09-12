import { ReactNode } from "react";
import type { Metadata } from "next";

// 会員ログイン・登録・マイページは個人向けページのため検索結果に出さない
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
