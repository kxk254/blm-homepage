"use client";
import React from "react";

type MobileNavProps = { className?: string; isAdmin?: boolean };

export default function NoramNav({ className, isAdmin }: MobileNavProps) {
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
          {isAdmin && (
            <li>
              <a href="/admin/products">ADMIN</a>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
