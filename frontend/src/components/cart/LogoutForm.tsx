"use client";

import type { ReactNode } from "react";
import { useCart } from "@/src/lib/cart/CartContext";

interface LogoutFormProps {
  action: () => void | Promise<void>;
  className?: string;
  children: ReactNode;
}

// カート(localStorage)はログイン状態と無関係に永続化されるため、
// ログアウト時はここで明示的に空にする
export default function LogoutForm({ action, className, children }: LogoutFormProps) {
  const { clearCart } = useCart();

  return (
    <form action={action} onSubmit={() => clearCart()}>
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
