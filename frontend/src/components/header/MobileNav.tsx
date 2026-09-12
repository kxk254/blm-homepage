"use client";
import React, { useState } from "react";
import styles from "@/src/layout/Header.module.css";
import Link from "next/link";

type MobileNavProps = { className?: string; isAdmin?: boolean };

export default function MobileNav({ className, isAdmin }: MobileNavProps) {
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
            <li>
              <Link href="/account" onClick={closeMenu}>
                MY PAGE
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/admin/products" onClick={closeMenu}>
                  ADMIN
                </Link>
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
