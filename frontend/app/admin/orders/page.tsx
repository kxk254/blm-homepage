import Link from "next/link";
import { desc, inArray } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { orderItems, orders } from "@/src/lib/db/schema";
import { signOutAdmin } from "@/app/admin/products/actions";
import { updateOrderStatus } from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  paid: "支払い済み",
  shipped: "発送済み",
  cancelled: "キャンセル",
  refunded: "返金済み",
};

export default async function AdminOrdersPage() {
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

  const orderIds = allOrders.map((order) => order.id);
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

  const formatPrice = (amount: number) => `¥${amount.toLocaleString()}`;

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>注文管理</h1>
        <form action={signOutAdmin}>
          <button type="submit" className={styles.button}>
            ログアウト
          </button>
        </form>
      </div>

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
        <Link href="/admin/orders">注文管理</Link>
        <Link href="/admin/customers">顧客一覧</Link>
      </nav>

      {allOrders.length === 0 ? (
        <p className={styles.hint}>まだ注文はありません。</p>
      ) : (
        <ul className={styles.orderList}>
          {allOrders.map((order) => (
            <li key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderDate}>
                    {order.createdAt.toLocaleString("ja-JP")}
                  </span>
                  <span className={styles.orderEmail}>
                    {order.customerEmail ?? "（メール不明）"}
                  </span>
                </div>
                <span className={styles.orderTotal}>
                  {formatPrice(order.totalAmount)}
                </span>
              </div>

              <ul className={styles.itemList}>
                {(itemsByOrder.get(order.id) ?? []).map((item) => (
                  <li key={item.id}>
                    {item.productName} × {item.quantity}（
                    {formatPrice(item.unitPrice)}）
                  </li>
                ))}
              </ul>

              <form action={updateOrderStatus} className={styles.statusForm}>
                <input type="hidden" name="orderId" value={order.id} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className={styles.statusSelect}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button type="submit" className={styles.button}>
                  更新
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
