"use client";

import { useState } from "react";
import ItemCard from "@/src/components/ui/ItemCard";
import type { Product } from "@/src/lib/db/schema";
import gridStyles from "./HomeCard.module.css";
import styles from "./ExpandableGrid.module.css";

// デスクトップ3列グリッドで2段分。テーマごとの初期表示件数の目安
const PREVIEW_COUNT = 6;

export default function ExpandableGrid({ items }: { items: Product[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > PREVIEW_COUNT;
  const visibleItems = expanded ? items : items.slice(0, PREVIEW_COUNT);

  return (
    <>
      <div className={gridStyles.itemGrid}>
        {visibleItems.map((product) => (
          <ItemCard
            key={product.id}
            id={product.id}
            productType={product.productType}
            productColor={product.productColor}
            productName={product.productName}
            productDescription={product.productDescription}
            productPrice={product.productPrice}
            imageSrc={product.imageSrc}
            stockQuantity={product.stockQuantity}
          />
        ))}
      </div>
      {hasMore && !expanded && (
        <button
          type="button"
          className={styles.moreButton}
          onClick={() => setExpanded(true)}
        >
          もっと見る（残り{items.length - PREVIEW_COUNT}点）
        </button>
      )}
    </>
  );
}
