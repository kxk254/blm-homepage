"use client";
import MobileNav from "@/src/components/header/MobileNav";
import NormalNav from "@/src/components/header/NormalNav";
import styles from "./Header.module.css";
import Link from "next/link";
import { useCart } from "@/src/lib/cart/CartContext";
import { usePathname } from "next/navigation";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    // ログイン/ログアウトはServer Actionでcookieを書き換える形で行われるため、
    // ブラウザ側からはそれを直接検知できない。Headerはルートlayout内で
    // 再マウントされないので、遷移先(pathname)が変わるたびに/api/auth/meを
    // 呼び直すことでログイン直後の表示を反映させる。
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((user: { isAdmin?: boolean } | null) => {
        if (!cancelled) setIsAdmin(user?.isAdmin === true);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <header>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          Blue Mille Feuille
        </Link>
        <div className={styles.headerRight}>
          <MobileNav className={styles.menuControlerMov} isAdmin={isAdmin} />
          <NormalNav className={styles.menuControlerNorm} isAdmin={isAdmin} />
          <Link href="/cart" className={styles.cartLink}>
            CART{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
