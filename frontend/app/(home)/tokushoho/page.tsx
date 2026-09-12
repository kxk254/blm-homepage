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
    value: "【事業者名（屋号・個人名）を記入】",
  },
  {
    label: "運営統括責任者",
    value: "【責任者氏名を記入】",
  },
  {
    label: "所在地",
    value:
      "【住所を記入】（請求があった場合、遅滞なく開示します／個人事業主の場合は記載省略の可否を要確認）",
  },
  {
    label: "電話番号",
    value: "【電話番号を記入】（請求があった場合、遅滞なく開示します）",
  },
  {
    label: "メールアドレス",
    value: contact[0]?.email ?? "【メールアドレスを記入】",
  },
  {
    label: "販売価格",
    value: "各商品ページに記載の価格（税込）",
  },
  {
    label: "商品代金以外の必要料金",
    value:
      "送料【金額を記入】（全国一律・決済画面にてご確認いただけます）、消費税",
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
    value:
      "受注生産のため、ご注文確定から【◯営業日〜◯週間】以内に発送いたします",
  },
  {
    label: "返品・交換について",
    value:
      "【返品・交換の可否、条件、期限、送料負担などを記入】（一点ずつ手作業で制作するハンドメイド品のため、お客様都合による返品は原則お受けしておりません 等、実際の方針を記載）",
  },
  {
    label: "キャンセルについて",
    value: "【キャンセル可能な期限・条件を記入】",
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
