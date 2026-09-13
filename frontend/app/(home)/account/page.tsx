import { redirect } from "next/navigation";
import styles from "./account.module.css";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { Customer, Order } from "@/src/lib/api/types";
import { signOut, updateProfile } from "./actions";

export const dynamic = "force-dynamic";

interface AccountResponse {
  customer: Customer;
  orders: Order[];
}

export default async function AccountPage() {
  let account: AccountResponse;
  try {
    account = await apiFetch<AccountResponse>("/api/account");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/account/login");
    }
    throw err;
  }

  const { customer, orders: customerOrders } = account;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>My Page</span>
      <p className={styles.email}>{customer.email}</p>
      <form action={signOut}>
        <button type="submit" className={styles.logoutButton}>
          ログアウト
        </button>
      </form>

      <section className={styles.profileSection}>
        <h2 className={styles.orderHeading}>お客様情報</h2>
        <form action={updateProfile} className={styles.form}>
          <label className={styles.field}>
            <span>お名前</span>
            <input
              type="text"
              name="fullName"
              defaultValue={customer.fullName ?? ""}
            />
          </label>
          <label className={styles.field}>
            <span>電話番号</span>
            <input type="tel" name="phone" defaultValue={customer.phone ?? ""} />
          </label>
          <label className={styles.field}>
            <span>郵便番号</span>
            <input
              type="text"
              name="postalCode"
              defaultValue={customer.postalCode ?? ""}
            />
          </label>
          <label className={styles.field}>
            <span>ご住所</span>
            <input
              type="text"
              name="address"
              defaultValue={customer.address ?? ""}
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            保存
          </button>
        </form>
      </section>

      <section className={styles.orderSection}>
        <h2 className={styles.orderHeading}>注文履歴</h2>
        {customerOrders.length === 0 ? (
          <p className={styles.noOrders}>まだご注文はありません。</p>
        ) : (
          <ul className={styles.orderList}>
            {customerOrders.map((order) => (
              <li key={order.id} className={styles.orderCard}>
                <div className={styles.orderMeta}>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <ul className={styles.orderItemList}>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
