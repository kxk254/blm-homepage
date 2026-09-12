import { ReactNode } from "react";
import type { Metadata } from "next";

// 決済完了・キャンセル画面はセッション固有のため検索結果に出さない
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
