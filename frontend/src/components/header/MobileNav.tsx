"use client";
import React, { useState, useEffect } from "react";
import styles from "@/src/layout/Header.module.css";
import Link from "next/link";

type MobileNavProps = { className?: string };

export default function MobileNav({ className }: MobileNavProps) {
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
              <Link href="/" onClick={closeMenu}>
                HOME
              </Link>
            </li>
            <li>
              <Link href="/" onClick={closeMenu}>
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="https://mdfshop.base.shop/"
                target="_blank"
                onClick={closeMenu}
              >
                SHOP
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeMenu}>
                CONTACT
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
