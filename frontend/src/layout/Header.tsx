"use client";
import MobileNav from "@/src/components/header/MobileNav";
import NormalNav from "@/src/components/header/NormalNav";
import styles from "./Header.module.css";
import Link from "next/link";
import { useCart } from "@/src/lib/cart/CartContext";
import { createClient } from "@/src/lib/supabase/client";
import { usePathname } from "next/navigation";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setIsAdmin(data.user?.app_metadata?.role === "admin");
    });

    // ログイン/ログアウトはServer Actionでcookieを書き換える形で行われるため、
    // ブラウザ側のクライアントはそれを検知できずonAuthStateChangeも発火しない。
    // Headerはルートlayout内で再マウントされないので、遷移先(pathname)が
    // 変わるたびに再チェックすることでログイン直後の表示を反映させる。
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAdmin(session?.user?.app_metadata?.role === "admin");
      }
    );

    return () => listener.subscription.unsubscribe();
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
