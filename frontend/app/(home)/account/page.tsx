import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import styles from "./account.module.css";
import { createClient } from "@/src/lib/supabase/server";
import { db } from "@/src/lib/db/client";
import { customers, orderItems, orders } from "@/src/lib/db/schema";
import { signOut, updateProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, user.id))
    .limit(1);

  const customerOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, user.id))
    .orderBy(desc(orders.createdAt));

  const orderIds = customerOrders.map((order) => order.id);
  const items =
    orderIds.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(inArray(orderItems.orderId, orderIds))
      : [];

  const itemsByOrder = new Map<string, typeof items>();
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId);
    if (list) {
      list.push(item);
    } else {
      itemsByOrder.set(item.orderId, [item]);
    }
  }

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
      <p className={styles.email}>{customer?.email ?? user.email}</p>
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
              defaultValue={customer?.fullName ?? ""}
            />
          </label>
          <label className={styles.field}>
            <span>電話番号</span>
            <input
              type="tel"
              name="phone"
              defaultValue={customer?.phone ?? ""}
            />
          </label>
          <label className={styles.field}>
            <span>郵便番号</span>
            <input
              type="text"
              name="postalCode"
              defaultValue={customer?.postalCode ?? ""}
            />
          </label>
          <label className={styles.field}>
            <span>ご住所</span>
            <input
              type="text"
              name="address"
              defaultValue={customer?.address ?? ""}
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
                    {order.createdAt.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <ul className={styles.orderItemList}>
                  {(itemsByOrder.get(order.id) ?? []).map((item) => (
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
