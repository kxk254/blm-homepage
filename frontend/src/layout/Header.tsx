"use client";
import MobileNav from "@/src/components/header/MobileNav";
import NormalNav from "@/src/components/header/NormalNav";
import styles from "./Header.module.css";
import Link from "next/link";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    // Call once on mount to set initial value
    handleResize();
    // Add event listner
    window.addEventListener("resize", handleResize);
    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("isMobile changed:", isMobile);
  }, [isMobile]);

  return (
    <header>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          Blue Mille Feuille
        </Link>
        {isMobile ? <MobileNav /> : <NormalNav />}
      </div>
    </header>
  );
}
