"use client";

import { useEffect } from "react";
import { useCart } from "@/src/lib/cart/CartContext";

export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // 決済完了時に一度だけカートを空にする
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
