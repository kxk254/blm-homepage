"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/src/lib/cart/CartContext";

export default function ClearCartOnSuccess() {
  const { clearCart, isLoaded } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    // isLoadedがfalseのうちに呼ぶと、直後のlocalStorage読み込みでカートが復元されてしまう
    // (Stripeの決済ページから戻る際はフルリロードになるため、この読み込みが必ず走る)
    if (!isLoaded || hasCleared.current) return;
    hasCleared.current = true;
    clearCart();
    // clearCartは毎レンダーで再生成される関数のため依存配列に入れない(hasClearedで1回に制限済み)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return null;
}
