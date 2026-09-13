"use client";
import React from "react";

type NormalNavProps = { className?: string };

// MY PAGEへの導線とADMINへのリンクは、それぞれヘッダー右上のアカウント欄・
// AdminBar(ヘッダー上の専用の帯)に集約したので、ここには置かない
export default function NormalNav({ className }: NormalNavProps) {
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
        </ul>
      </nav>
    </>
  );
}
