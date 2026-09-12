import { ReactNode } from "react";
import type { Metadata } from "next";

// カートは個人ごとの一時的な状態のため検索結果に出さない
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
