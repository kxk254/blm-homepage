import { ReactNode } from "react";
import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Header from "@/src/layout/Header";
import Footer from "@/src/layout/Footer";
import styles from "./Root.module.css";
import Script from "next/script";
import { CartProvider } from "@/src/lib/cart/CartContext";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

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
        // 旧Django構成の /media/ プレフィックスが残っていたバグを修正
        // (public/asset配下はNext.jsが /asset/ で配信する)
        url: "https://blmf.jp/asset/main.jpg",
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
    images: ["https://blmf.jp/asset/main.jpg"],
  },
  metadataBase: new URL("https://blmf.jp"),
  alternates: {
    canonical: "/",
  },
};

// Organization構造化データ。sameAsでInstagram/Facebook/BASEを同一エンティティとして
// 明示することで、検索エンジンのナレッジパネルやLLMのエンティティ解決に活用される
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Blue Millefeuille",
  alternateName: "ブルーミルフィーユ",
  url: "https://blmf.jp",
  logo: "https://blmf.jp/asset/main.jpg",
  description:
    "Blue Millefeuilleは、日常にそっときらめきを添えるハンドメイドアクセサリーショップ。ストーンフラワーシリーズのイヤリングなど、一点一点手作業で仕立てています。",
  sameAs: [
    "https://www.instagram.com/bluemillefeuille2001",
    "https://www.facebook.com/profile.php?id=100070949671198",
    "https://mdfshop.base.shop/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSerifJP.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider>
          <div className={styles.pageContainer}>
            <Header />
            <main className={styles.content}>{children}</main>
            <Footer />
          </div>
        </CartProvider>

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
