"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LogoutForm from "@/src/components/cart/LogoutForm";
import { signOut } from "@/app/(home)/account/actions";
import styles from "./AccountMenu.module.css";

// 名前をクリックすると「マイページ・設定」「ログアウト」をまとめたプルダウンを開く。
// ログイン中であることの表示と各種操作をひとつにまとめて、ヘッダーをすっきりさせる
export default function AccountMenu({ displayName }: { displayName: string }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className={styles.name}>{displayName} 様</span>
        <span className={styles.chevron} data-open={open || undefined}>
          ▾
        </span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          <Link
            href="/account"
            className={styles.dropdownItem}
            onClick={() => setOpen(false)}
          >
            マイページ・設定
          </Link>
          <LogoutForm action={signOut} className={styles.dropdownItem}>
            ログアウト
          </LogoutForm>
        </div>
      )}
    </div>
  );
}
