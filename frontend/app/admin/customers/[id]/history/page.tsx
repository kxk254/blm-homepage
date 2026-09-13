import Link from "next/link";
import { apiFetch } from "@/src/lib/api/client";
import type { CustomerFieldHistory } from "@/src/lib/api/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const FIELD_LABELS: Record<string, string> = {
  email: "メールアドレス",
  full_name: "お名前",
  phone: "電話番号",
  postal_code: "郵便番号",
  address: "ご住所",
};

export default async function CustomerHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const history = await apiFetch<CustomerFieldHistory[]>(
    `/api/admin/customers/${id}/history`
  );

  return (
    <div className={styles.content}>
      <h1 className={styles.heading}>顧客情報の変更履歴</h1>
      <Link href="/admin/customers" className={styles.backLink}>
        ← 顧客一覧へ戻る
      </Link>

      {history.length === 0 ? (
        <p className={styles.hint}>
          変更履歴はありません（登録後、住所・氏名・電話番号・メールアドレスの
          変更があると自動で記録されます）。
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>日時</th>
              <th>項目</th>
              <th>変更前</th>
              <th>変更後</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.changedAt).toLocaleString("ja-JP")}</td>
                <td>{FIELD_LABELS[entry.fieldName] ?? entry.fieldName}</td>
                <td>{entry.oldValue ?? "（未設定）"}</td>
                <td>{entry.newValue ?? "（未設定）"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
