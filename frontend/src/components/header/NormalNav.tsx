"use client";
import React, { useState, useEffect } from "react";
import styles from "@/src/layout/Header.module.css";
import Link from "next/link";

type MobileNavProps = { className?: string };

export default function NoramNav({ className }: MobileNavProps) {
  return (
    <>
      <nav className={className}>
        <ul>
          <li>
            <a href="/shop">SHOP</a>
          </li>
          <li>
            <a href="/contact">CONTACT</a>
          </li>
          <li>
            <a href="/account">MY PAGE</a>
          </li>
        </ul>
      </nav>
    </>
  );
}
