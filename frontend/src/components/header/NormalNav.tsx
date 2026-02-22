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
            <a href="/">HOME</a>
          </li>
          <li>
            <a href="/about">ABOUT</a>
          </li>
          <li>
            <a href="https://mdfshop.base.shop/" target="_blank">
              SHOP
            </a>
          </li>
          <li>
            <a href="/contact">CONTACT</a>
          </li>
        </ul>
      </nav>
    </>
  );
}
