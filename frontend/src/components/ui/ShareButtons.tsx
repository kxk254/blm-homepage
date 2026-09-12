"use client";

import { useState } from "react";
import styles from "./ShareButtons.module.css";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // クリップボードAPIが使えない環境向けのフォールバックは不要
      // (対応ブラウザが極めて限られるため、失敗時は何もしない)
    }
  };

  return (
    <div className={styles.shareButtons}>
      <span className={styles.label}>Share</span>
      <div className={styles.icons}>
        <a
          className={styles.iconLink}
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LINEでシェア"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 5.66 2 10.17c0 4.05 3.56 7.44 8.36 8.08.33.07.77.22.88.5.1.26.07.66.03.93l-.14.86c-.04.26-.2 1 .88.55s5.8-3.42 7.92-5.85c1.46-1.61 2.07-3.24 2.07-5.07C22 5.66 17.52 2 12 2zM8.3 12.9H6.87a.36.36 0 0 1-.36-.36V8.3c0-.2.16-.36.36-.36s.36.16.36.36v3.87h1.07c.2 0 .36.16.36.36s-.16.37-.36.37zm1.72-.36c0 .2-.16.36-.36.36s-.36-.16-.36-.36V8.3c0-.2.16-.36.36-.36s.36.16.36.36zm4.4 0c0 .16-.1.3-.25.34a.35.35 0 0 1-.4-.13l-1.9-2.58v2.37c0 .2-.16.36-.36.36s-.37-.16-.37-.36V8.3c0-.16.1-.3.25-.34a.32.32 0 0 1 .11-.02c.12 0 .23.06.3.15l1.9 2.58V8.3c0-.2.16-.36.36-.36s.36.16.36.36zm3.02-2.87h-1.5v.94h1.5c.2 0 .36.17.36.37s-.16.36-.36.36h-1.5v.94h1.5c.2 0 .36.16.36.36s-.16.36-.36.36h-1.87a.36.36 0 0 1-.36-.36V8.3c0-.2.16-.36.36-.36h1.87c.2 0 .36.16.36.36s-.16.37-.36.37z"
            />
          </svg>
        </a>
        <a
          className={styles.iconLink}
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Xでシェア"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M18.24 2.5h3.03l-6.62 7.57 7.79 10.93h-6.1l-4.78-6.5-5.47 6.5H2.06l7.08-8.1L1.66 2.5h6.25l4.32 5.94zm-1.06 16.66h1.68L7.87 4.24H6.06z"
            />
          </svg>
        </a>
        <a
          className={styles.iconLink}
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebookでシェア"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M14 13.5h2.5l.5-3H14V8.5c0-.9.25-1.5 1.53-1.5H17V4.35A20 20 0 0 0 14.75 4.2c-2.23 0-3.75 1.36-3.75 3.85V10.5H8.5v3H11V21h3z"
            />
          </svg>
        </a>
        <button
          type="button"
          className={styles.iconLink}
          onClick={handleCopyLink}
          aria-label="リンクをコピー"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M10.5 13.5a3.5 3.5 0 0 0 5.28.38l2.25-2.25a3.5 3.5 0 0 0-4.95-4.95l-1.29 1.28M13.5 10.5a3.5 3.5 0 0 0-5.28-.38l-2.25 2.25a3.5 3.5 0 0 0 4.95 4.95l1.28-1.28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {copied && <span className={styles.copiedNote}>リンクをコピーしました</span>}
    </div>
  );
}
