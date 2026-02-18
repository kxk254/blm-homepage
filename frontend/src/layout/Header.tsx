"use client";
import MobileNav from "@/src/components/header/MobileNav";
import NormalNav from "@/src/components/header/NormalNav";
import styles from "./Header.module.css";
import Link from "next/link";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          Blue Mille Feuille
        </Link>
        <MobileNav className={styles.menuControlerMov} />
        <NormalNav className={styles.menuControlerNorm} />
      </div>
    </header>
  );
}
