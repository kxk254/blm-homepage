"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import clsx from "clsx";
import { updateProductImages } from "@/app/admin/products/actions";
import type { MediaImage } from "@/src/lib/api/types";
import styles from "./ProductImagePicker.module.css";

const MAX_IMAGES = 8;

interface ProductImagePickerProps {
  productId: string;
  availableImages: MediaImage[];
  initialSelected: string[];
}

// アップロード済み画像のプール(商品ごとのフォルダ)から1〜8枚選び、
// クリックした順を表示順として保存する。1枚目が一覧・カート・SNS共有等で
// 使われるカバー画像になる
export default function ProductImagePicker({
  productId,
  availableImages,
  initialSelected,
}: ProductImagePickerProps) {
  const [pool, setPool] = useState<MediaImage[]>(availableImages);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggle = (url: string) => {
    setMessage(null);
    setSelected((prev) => {
      if (prev.includes(url)) {
        return prev.filter((item) => item !== url);
      }
      if (prev.length >= MAX_IMAGES) {
        return prev;
      }
      return [...prev, url];
    });
  };

  const remove = (url: string) => {
    setMessage(null);
    setSelected((prev) => prev.filter((item) => item !== url));
  };

  const handleSave = () => {
    if (selected.length === 0) {
      setMessage("画像を1枚以上選択してください");
      return;
    }
    startTransition(async () => {
      await updateProductImages(productId, selected);
      setMessage("保存しました");
    });
  };

  const handleFilesChosen = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setMessage(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append("files", file);
      }
      const res = await fetch(`/api/admin/products/${productId}/media`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail ?? "アップロードに失敗しました");
      }
      const uploaded: MediaImage[] = await res.json();

      // 新しくアップロードした画像を一覧の先頭に加え、空きがあれば選択にも自動で足す
      setPool((prev) => [...uploaded, ...prev]);
      setSelected((prev) => {
        const room = MAX_IMAGES - prev.length;
        if (room <= 0) return prev;
        return [...prev, ...uploaded.slice(0, room).map((img) => img.url)];
      });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    handleFilesChosen(e.dataTransfer.files);
  };

  // このフォルダのプールに無い(旧/asset配下など)画像も、選択済みとしては表示する
  const poolUrls = new Set(pool.map((img) => img.url));
  const hasSelectedOutsidePool = selected.some((url) => !poolUrls.has(url));

  return (
    <div className={styles.wrapper}>
      <div
        className={clsx(styles.uploadRow, isDraggingOver && styles.uploadRowDragging)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFilesChosen(e.target.files)}
          disabled={isUploading}
        />
        <span className={styles.hint}>
          {isUploading ? "アップロード中..." : "ここに画像をドラッグ＆ドロップもできます"}
        </span>
      </div>

      <p className={styles.hint}>
        画像をクリックして選択してください（クリックした順が表示順になり、1枚目が一覧・カート等のカバー画像になります）。最大{MAX_IMAGES}枚。
      </p>

      {selected.length > 0 && (
        <div className={styles.selectedRow}>
          {selected.map((url, index) => (
            <div key={url} className={styles.selectedThumb}>
              <span className={styles.orderBadge}>{index + 1}</span>
              <div className={styles.thumbImageWrap}>
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="72px"
                  className={styles.thumbImage}
                />
              </div>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => remove(url)}
                aria-label="この画像を選択から外す"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {hasSelectedOutsidePool && (
        <p className={styles.hint}>
          ※選択中の画像の一部はこの商品のフォルダに見つかりません（旧形式のパスの可能性があります）。
        </p>
      )}

      <div className={styles.pool}>
        {pool.map((img) => {
          const isSelected = selected.includes(img.url);
          const order = selected.indexOf(img.url);
          return (
            <button
              key={img.url}
              type="button"
              className={clsx(
                styles.poolThumb,
                isSelected && styles.poolThumbSelected
              )}
              onClick={() => toggle(img.url)}
              disabled={!isSelected && selected.length >= MAX_IMAGES}
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                sizes="80px"
                className={styles.thumbImage}
              />
              {isSelected && <span className={styles.orderBadge}>{order + 1}</span>}
            </button>
          );
        })}
        {pool.length === 0 && (
          <p className={styles.hint}>
            まだこの商品用の画像がありません。上のフォームからアップロードしてください。
          </p>
        )}
      </div>

      <button
        type="button"
        className={styles.saveButton}
        onClick={handleSave}
        disabled={isPending}
      >
        {isPending ? "保存中..." : "画像を保存"}
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
