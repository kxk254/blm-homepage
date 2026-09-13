"use client";
import React, { useState } from "react";
import styles from "@/src/layout/Header.module.css";
import Link from "next/link";
import LogoutForm from "@/src/components/cart/LogoutForm";
import { signOut } from "@/app/(home)/account/actions";

type MobileNavProps = {
  className?: string;
  displayName?: string | null;
  checkedAuth?: boolean;
};

// 画面が狭いスマホでは右上に名前・ログアウトを常時表示する余裕がないため、
// ハンバーガーメニューの中にまとめて入れる（ADMINへのリンクはAdminBar側で常時表示されるため、ここには含めない）
export default function MobileNav({
  className,
  displayName,
  checkedAuth,
}: MobileNavProps) {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive((prev) => !prev);
  };
  const closeMenu = () => {
    setIsActive(false);
  };

  return (
    <nav className={className}>
      {/* Hamburger button */}
      <div
        onClick={toggleMenu}
        className={`${styles.hamburger} ${isActive ? styles["is-active"] : ""}`}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      {isActive ? (
        <div
          className={`${styles.navOverlay} ${isActive ? styles["is-active"] : ""}`}
        >
          <ul>
            <li>
              <Link href="/shop" onClick={closeMenu}>
                SHOP
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeMenu}>
                CONTACT
              </Link>
            </li>
            {checkedAuth &&
              (displayName ? (
                <>
                  <li className={styles.navOverlayName}>{displayName} 様</li>
                  <li>
                    <Link href="/account" onClick={closeMenu}>
                      マイページ・設定
                    </Link>
                  </li>
                  <li>
                    <LogoutForm
                      action={signOut}
                      className={styles.navOverlayLogout}
                    >
                      ログアウト
                    </LogoutForm>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/account/login" onClick={closeMenu}>
                    ログイン
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
