import "server-only";
import { createMailer } from "./client";

interface OrderConfirmationItem {
  name: string;
  unitPrice: number;
  quantity: number;
}

interface OrderConfirmationParams {
  toEmail: string;
  orderId: string;
  items: OrderConfirmationItem[];
  totalAmount: number;
  orderDate: Date;
}

// 注文記録として店主にも必ず控えを残す（本文はお客様宛と同一）
const RECORD_EMAIL = "bmflower2001@gmail.com";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function sendOrderConfirmationEmail({
  toEmail,
  orderId,
  items,
  totalAmount,
  orderDate,
}: OrderConfirmationParams) {
  const itemLines = items
    .map(
      (item) =>
        `・${item.name} × ${item.quantity}　${formatPrice(
          item.unitPrice * item.quantity
        )}`
    )
    .join("\n");

  const dateLabel = orderDate.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const text = `この度はBlue Millefeuilleにてお買い上げいただき、誠にありがとうございます。

ご注文内容は以下の通りです。

ご注文日時：${dateLabel}
注文番号：${orderId}

${itemLines}

合計：${formatPrice(totalAmount)}（送料別）

商品は一つひとつ手作業でお仕立てするため、発送まで今しばらくお待ちください。
ご不明な点がございましたら、このメールにご返信いただくか、下記までお気軽にお問い合わせください。

Blue Millefeuille
${RECORD_EMAIL}
`;

  const mailer = createMailer();
  await mailer.sendMail({
    from: `"Blue Millefeuille" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: toEmail,
    cc: RECORD_EMAIL,
    subject: "【Blue Millefeuille】ご注文ありがとうございます",
    text,
  });
}
