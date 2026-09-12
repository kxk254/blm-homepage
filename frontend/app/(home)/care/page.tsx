import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Care & Repair | Blue Millefeuille",
  description:
    "Blue Millefeuilleのアクセサリーの修理・メンテナンスについてのご案内です。パーツの破損や片方紛失時のご相談も承っております。",
  alternates: {
    canonical: "/care",
  },
};

const REPAIR_EMAIL = "bmflower2001@gmail.com";

export default function CarePage() {
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Care & Repair</span>
      <h1 className={styles.title}>大切なアクセサリーを、これからも。</h1>

      <div className={styles.body}>
        <p>
          お気に入りのイヤリングを、できるだけ長く楽しんでいただけるよう、
          修理やメンテナンスにも対応しています。
        </p>
        <p>
          パーツの外れや破損など、状態に合わせて可能な限り修理いたします。
        </p>
        <p>
          また、片方を紛失された場合も、パーツの在庫があれば対応できる場合がございます。
          「片方だけなくしてしまった」という場合も、どうぞお気軽にお問い合わせください。
        </p>
        <p>
          一点ずつ手作業で仕立てているため、
          修理やパーツの交換については、商品の状態やパーツの在庫状況によって
          対応内容が異なります。
        </p>
        <p>
          これからもお気に入りのアクセサリーを長く使っていただけるよう、
          ひとつひとつ丁寧にケアしてまいります。
        </p>
      </div>

      <section className={styles.contactSection}>
        <h2 className={styles.subheading}>Repair & Contact</h2>
        <p>
          修理・パーツ交換についてのお問い合わせは、
          商品の状態がわかる写真を添えて、下記メールアドレスまでお気軽にご連絡ください。
        </p>
        <a href={`mailto:${REPAIR_EMAIL}`} className={styles.emailLink}>
          {REPAIR_EMAIL}
        </a>
        <p className={styles.note}>
          ※修理内容や使用するパーツによって、修理費用が発生する場合がございます。
        </p>
        <p className={styles.note}>
          ※商品価格に対して修理費用が高額になる場合がございます。あらかじめご了承のうえお問い合わせください。
        </p>
        <p className={styles.note}>
          ※修理対応は、ご購入から1ヶ月以内のお客様を対象とさせていただいております。
        </p>
        <p className={styles.note}>
          ※片方を紛失された場合の対応は、実費にて承ります。
        </p>
        <p className={styles.note}>
          ※修理の可否、費用、納期については、商品の状態やパーツの在庫を確認したうえでご案内いたします。
        </p>
      </section>
    </div>
  );
}
