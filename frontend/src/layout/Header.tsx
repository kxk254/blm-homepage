"use client";
import MobileNav from "@/src/components/header/MobileNav";
import NormalNav from "@/src/components/header/NormalNav";
import styles from "./Header.module.css";
import Link from "next/link";
import { useCart } from "@/src/lib/cart/CartContext";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { itemCount } = useCart();

  return (
    <header>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          Blue Mille Feuille
        </Link>
        <div className={styles.headerRight}>
          <MobileNav className={styles.menuControlerMov} />
          <NormalNav className={styles.menuControlerNorm} />
          <Link href="/cart" className={styles.cartLink}>
            CART{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
