"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

// 商品詳細ページの画像表示。1枚ならメイン画像だけ、2枚以上ならサムネイル行を出して
// クリックでメイン画像を切り替えられるようにする
export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = images[activeIndex] ?? images[0];

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainImageWrap}>
        <Image
          src={activeSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 90vw, 45vw"
          className={styles.mainImage}
          priority
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbRow}>
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className={clsx(
                styles.thumbButton,
                index === activeIndex && styles.thumbButtonActive
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`${alt} 画像 ${index + 1}/${images.length}`}
              aria-current={index === activeIndex}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
