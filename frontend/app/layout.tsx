import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/src/layout/Header";
import Footer from "@/src/layout/Footer";
import styles from "./Root.module.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blue Millefeuille | きらめくハンドメイドアクセサリー",
  description:
    "Blue Millefeuilleは、日常にそっときらめきを添えるハンドメイドアクセサリーショップ。ストーンフラワーシリーズのイヤリングで、毎日を少し華やかに。",
  keywords:
    "ハンドメイド,イヤリング,アクセサリー,シャビーシック,バロックストーン,パール,ギフト,ナチュラル,Blue Millefeuille",
  openGraph: {
    title: "Blue Millefeuille | きらめくハンドメイドアクセサリー",
    description: "日常にそっときらめきを添えるハンドメイドアクセサリー。",
    url: "https://blmf.jp",
    siteName: "Blue Millefeuille",
    images: [
      {
        url: "https://blmf.jp/media/asset/main.jpg",
        width: 1200,
        height: 630,
        alt: "Blue Millefeuille アクセサリー",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Blue Millefeuille | ハンドメイドアクセサリー",
    description: "日常にそっときらめきを添えるアクセサリー。",
    images: ["https://blmf.jp/media/asset/main.jpg"],
  },
  metadataBase: new URL("https://blmf.jp"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className={styles.pageContainer}>
          <Header />
          <main className={styles.content}>{children}</main>
          <Footer />
        </div>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-Z775PKZ8XR`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z775PKZ8XR');
          `}
        </Script>
      </body>
    </html>
  );
}
