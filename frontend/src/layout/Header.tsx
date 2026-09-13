"use client";
import MobileNav from "@/src/components/header/MobileNav";
import NormalNav from "@/src/components/header/NormalNav";
import AccountMenu from "@/src/components/header/AccountMenu";
import AdminBar from "@/src/layout/AdminBar";
import CartBar from "@/src/layout/CartBar";
import styles from "./Header.module.css";
import Link from "next/link";
import { useCart } from "@/src/lib/cart/CartContext";
import { usePathname } from "next/navigation";

import React, { useEffect, useState } from "react";

// globals.cssの--info-bar-heightと必ず一致させること(帯の積み上げ位置の計算に使う)
const INFO_BAR_HEIGHT_PX = 36;

interface CurrentUser {
  email: string;
  fullName: string | null;
  isAdmin: boolean;
}

export default function Header() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  // ログイン確認が終わるまでは「ログイン」も名前も出さない
  // （出す前提を決め打ちすると、実際の状態と一瞬食い違って見えてしまうため）
  const [checkedAuth, setCheckedAuth] = useState(false);
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
      .then((data: CurrentUser | null) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setCheckedAuth(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const isAdmin = user?.isAdmin === true;
  // カートページ自体では既にカートの中身が丸ごと見えているので、帯を出すと二重表示になる
  const showCartBar = itemCount > 0 && pathname !== "/cart";

  const adminBarTop = 0;
  const cartBarTop = isAdmin ? INFO_BAR_HEIGHT_PX : 0;
  const headerTopOffset =
    (isAdmin ? INFO_BAR_HEIGHT_PX : 0) + (showCartBar ? INFO_BAR_HEIGHT_PX : 0);

  useEffect(() => {
    // 表示中の帯(AdminBar/CartBar)の合計ぶんだけ、Header自体と各ページ本文の
    // 上部余白を下にずらす。--header-top-offsetを参照している箇所すべてに効くので、
    // ページごとの個別対応が要らない
    document.documentElement.style.setProperty(
      "--header-top-offset",
      `${headerTopOffset}px`
    );
  }, [headerTopOffset]);

  const displayName = user ? user.fullName || user.email : null;

  return (
    <>
      {isAdmin && <AdminBar top={adminBarTop} />}
      {showCartBar && <CartBar itemCount={itemCount} top={cartBarTop} />}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Blue Mille Feuille
        </Link>
        <div className={styles.headerRight}>
          <MobileNav
            className={styles.menuControlerMov}
            displayName={displayName}
            checkedAuth={checkedAuth}
          />
          <NormalNav className={styles.menuControlerNorm} />
          {checkedAuth && (
            <div className={styles.accountStatus}>
              {displayName ? (
                <AccountMenu displayName={displayName} />
              ) : (
                <Link href="/account/login" className={styles.loginLink}>
                  ログイン
                </Link>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
