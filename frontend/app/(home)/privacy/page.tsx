import type { Metadata } from "next";
import styles from "./page.module.css";
import { contact } from "@/data/ContactCard";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Blue Millefeuille",
  description: "Blue Millefeuilleのプライバシーポリシー（個人情報の取り扱いについて）です。",
  alternates: {
    canonical: "/privacy",
  },
};

const ESTABLISHED_DATE = "2026年9月12日";

export default function PrivacyPage() {
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Privacy Policy</span>
      <h1 className={styles.title}>プライバシーポリシー</h1>

      <section className={styles.section}>
        <h2 className={styles.subheading}>基本方針</h2>
        <p>
          Blue Millefeuille（以下「当店」）は、お客様からお預かりする個人情報を、
          ご注文の対応やお問い合わせへの返信など、必要な範囲でのみ利用いたします。
        </p>
        <p>
          いただいた情報を、宣伝メールやダイレクトメッセージなどの
          マーケティング目的で利用することはございません。当店からお客様へ
          こちらから連絡することは基本的になく、お客様からお問い合わせ
          いただいた場合や、ご注文・修理対応など必要な場合にのみご連絡いたします。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>取得する情報</h2>
        <p>会員登録・ご注文・お問い合わせの際に、以下の情報をお預かりする場合がございます。</p>
        <ul className={styles.list}>
          <li>お名前、メールアドレス、電話番号、ご住所</li>
          <li>ご注文内容（商品、数量、金額、注文日時）</li>
          <li>お問い合わせ・修理依頼の内容</li>
        </ul>
        <p>
          クレジットカード情報は決済代行会社（Stripe）が直接取り扱い、
          当店のサーバーに保存されることはありません。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>利用目的</h2>
        <ul className={styles.list}>
          <li>ご注文商品の発送、お支払いの確認</li>
          <li>お問い合わせ・修理依頼への対応</li>
          <li>会員アカウントの管理（ログイン、注文履歴の表示）</li>
          <li>サイトの利用状況の把握・改善（アクセス解析）</li>
        </ul>
        <p>上記以外の目的（宣伝・広告配信・第三者への販売など）には利用いたしません。</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>第三者への提供・業務委託</h2>
        <p>
          当店は、以下のサービスを利用して事業を運営しております。
          いずれも情報の取り扱いを委託しているものであり、マーケティング目的での
          第三者提供は行っておりません。
        </p>
        <ul className={styles.list}>
          <li>Stripe（決済処理）</li>
          <li>Supabase（会員情報・注文情報のデータ管理）</li>
          <li>Google Analytics（サイトのアクセス解析）</li>
        </ul>
        <p>
          Google
          Analyticsについて詳しくは、Googleのプライバシーポリシーをご確認ください。
          ブラウザの設定によりCookieを無効にすることで、アクセス解析を制限できます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>安全管理</h2>
        <p>
          お預かりした個人情報は、不正アクセスや漏えいを防ぐため、
          適切な管理のもとで保管いたします。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>開示・訂正・削除等のご請求</h2>
        <p>
          ご自身の個人情報の開示、訂正、削除、利用停止をご希望の場合は、
          下記お問い合わせ先までご連絡ください。ご本人確認のうえ、
          合理的な範囲で対応いたします。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>お問い合わせ窓口</h2>
        <p>
          個人情報の取り扱いに関するお問い合わせは、下記メールアドレスまでお願いいたします。
        </p>
        <a href={`mailto:${contact[0].email}`} className={styles.emailLink}>
          {contact[0].email}
        </a>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>改定について</h2>
        <p>
          本ポリシーは、法令の変更や事業内容の変更に伴い、予告なく改定する場合がございます。
          改定後の内容は、本ページに掲載した時点から効力を生じるものとします。
        </p>
        <p className={styles.date}>制定日：{ESTABLISHED_DATE}</p>
      </section>
    </div>
  );
}
