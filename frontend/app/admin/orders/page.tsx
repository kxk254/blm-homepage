import Link from "next/link";
import { apiFetch } from "@/src/lib/api/client";
import type { Order } from "@/src/lib/api/types";
import { recordRefund, updateOrderStatus } from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  paid: "支払い済み",
  shipped: "発送済み",
  cancelled: "キャンセル",
  refunded: "返金済み",
};

interface SearchParams {
  customerName?: string;
  productId?: string;
  date?: string;
  stripeId?: string;
  saved?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = new URLSearchParams();
  if (params.customerName) query.set("customer_name", params.customerName);
  if (params.productId) query.set("product_id", params.productId);
  if (params.date) query.set("date", params.date);
  if (params.stripeId) query.set("stripe_id", params.stripeId);
  const queryString = query.toString();

  const allOrders = await apiFetch<Order[]>(
    `/api/admin/orders${queryString ? `?${queryString}` : ""}`
  );

  const formatPrice = (amount: number) => `¥${amount.toLocaleString()}`;

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>注文管理</h1>
      </div>

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
        <Link href="/admin/orders">注文管理</Link>
        <Link href="/admin/customers">顧客一覧</Link>
        <Link href="/admin/admins">管理者</Link>
      </nav>

      {params.saved === "1" && (
        <p role="status" className={styles.savedBanner}>
          保存しました
        </p>
      )}

      <form method="get" className={styles.searchForm}>
        <label className={styles.searchField}>
          <span>お名前</span>
          <input type="text" name="customerName" defaultValue={params.customerName} />
        </label>
        <label className={styles.searchField}>
          <span>商品番号</span>
          <input type="text" name="productId" defaultValue={params.productId} />
        </label>
        <label className={styles.searchField}>
          <span>注文日</span>
          <input type="date" name="date" defaultValue={params.date} />
        </label>
        <label className={styles.searchField}>
          <span>Stripe番号</span>
          <input type="text" name="stripeId" defaultValue={params.stripeId} />
        </label>
        <button type="submit" className={styles.button}>
          検索
        </button>
        {queryString && (
          <Link href="/admin/orders" className={styles.button}>
            クリア
          </Link>
        )}
      </form>

      {allOrders.length === 0 ? (
        <p className={styles.hint}>該当する注文がありません。</p>
      ) : (
        <ul className={styles.orderList}>
          {allOrders.map((order) => (
            <li key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleString("ja-JP")}
                  </span>
                  <span className={styles.orderEmail}>
                    {order.customerEmail ?? "（メール不明）"}
                  </span>
                  <span className={styles.orderStripeId}>
                    Stripe: {order.stripeCheckoutSessionId}
                  </span>
                </div>
                <span className={styles.orderTotal}>
                  {formatPrice(order.totalAmount)}
                </span>
              </div>

              <p className={styles.shippingInfo}>
                {order.shippingName ?? "（お名前不明）"}
                {order.shippingPhone ?? "（電話番号不明）"}
                <br />
                {order.shippingPostalCode ? `〒${order.shippingPostalCode} ` : ""}
                {order.shippingAddress ?? "（住所不明）"}
              </p>

              <ul className={styles.itemList}>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productId ?? "（商品削除済み）"} {item.productName} ×{" "}
                    {item.quantity}（{formatPrice(item.unitPrice)}）
                  </li>
                ))}
              </ul>

              {/* defaultValue(非制御)のため、保存後のrevalidateだけでは
                  画面が追従しない。key を内容依存にしてフォームごと
                  再マウントさせる */}
              <form
                key={`${order.id}-${order.status}`}
                action={updateOrderStatus}
                className={styles.statusForm}
              >
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="customerName" value={params.customerName ?? ""} />
                <input type="hidden" name="productId" value={params.productId ?? ""} />
                <input type="hidden" name="date" value={params.date ?? ""} />
                <input type="hidden" name="stripeId" value={params.stripeId ?? ""} />
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

              {order.refundedAt ? (
                <p className={styles.refundInfo}>
                  返金記録: {formatPrice(order.refundAmount ?? 0)}／
                  {new Date(order.refundedAt).toLocaleString("ja-JP")}／理由:{" "}
                  {order.refundReason}
                </p>
              ) : (
                <details className={styles.refundDetails}>
                  <summary>返品・返金を記録する</summary>
                  <form action={recordRefund} className={styles.refundForm}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="customerName" value={params.customerName ?? ""} />
                    <input type="hidden" name="productId" value={params.productId ?? ""} />
                    <input type="hidden" name="date" value={params.date ?? ""} />
                    <input type="hidden" name="stripeId" value={params.stripeId ?? ""} />
                    <label className={styles.searchField}>
                      <span>返金額（円）</span>
                      <input
                        type="number"
                        name="refundAmount"
                        min={0}
                        defaultValue={order.totalAmount}
                        required
                      />
                    </label>
                    <label className={styles.searchField}>
                      <span>理由</span>
                      <input type="text" name="refundReason" required />
                    </label>
                    <button type="submit" className={styles.button}>
                      記録する
                    </button>
                  </form>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
