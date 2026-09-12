import type { Metadata } from "next";
import styles from "./page.module.css";
import { contact } from "@/data/ContactCard";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | Blue Millefeuille",
  description: "Blue Millefeuilleの特定商取引法に基づく表記です。",
  alternates: {
    canonical: "/tokushoho",
  },
};

// 特定商取引法に基づく表記
// 各項目の【 】部分は実際の内容に差し替えてください。
// 参考: https://www.no-trouble.caa.go.jp/what/mailorder/
const entries: { label: string; value: string }[] = [
  {
    label: "販売業者",
    value: "ソリトンキャピタルマネジメント株式会社",
  },
  {
    label: "運営統括責任者",
    value: "紺野　兼司",
  },
  {
    label: "所在地",
    value:
      "東京都港区新橋３−９−１０天翔新橋ビル５階",
  },
  {
    label: "電話番号",
    value: "03-4400-6501",
  },
  {
    label: "メールアドレス",
    value: contact[0]?.email ?? "blm@soliton-cm.com",
  },
  {
    label: "販売価格",
    value: "各商品ページに記載の価格（税込）",
  },
  {
    label: "商品代金以外の必要料金",
    value: "送料 全国一律300円（税込）、消費税",
  },
  {
    label: "お支払い方法",
    value: "クレジットカード決済（Stripe）",
  },
  {
    label: "お支払い時期",
    value: "ご注文確定時（クレジットカード決済）",
  },
  {
    label: "商品の引渡し時期",
    value: "受注生産のため、ご注文確定から14営業日〜3週間以内に発送いたします",
  },
  {
    label: "返品・交換について",
    value:
      "一点ずつ手作業で制作するハンドメイド品のため、お客様都合による返品・交換は原則お受けしておりません。不良品の場合は商品到着後7日以内にご連絡ください（送料弊社負担にて交換対応いたします）。",
  },
  {
    label: "キャンセルについて",
    value: "ご注文当日の18:00まで。18:00以降のご注文は、翌日の14:00までキャンセル可能です。",
  },
];

export default function TokushohoPage() {
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Legal</span>
      <h1 className={styles.title}>特定商取引法に基づく表記</h1>

      <dl className={styles.table}>
        {entries.map((entry) => (
          <div key={entry.label} className={styles.row}>
            <dt className={styles.label}>{entry.label}</dt>
            <dd className={styles.value}>{entry.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
