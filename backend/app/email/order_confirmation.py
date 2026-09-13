from dataclasses import dataclass
from datetime import datetime
from email.message import EmailMessage

import aiosmtplib

from app.core.config import settings

# 注文記録として店主にも必ず控えを残す（本文はお客様宛と同一）
RECORD_EMAIL = "bmflower2001@gmail.com"


@dataclass
class OrderConfirmationItem:
    name: str
    unit_price: int
    quantity: int


def _format_price(amount: int) -> str:
    return f"¥{amount:,}"


async def send_order_confirmation_email(
    to_email: str,
    order_id: str,
    items: list[OrderConfirmationItem],
    total_amount: int,
    order_date: datetime,
) -> None:
    item_lines = "\n".join(
        f"・{item.name} × {item.quantity}　{_format_price(item.unit_price * item.quantity)}"
        for item in items
    )
    date_label = order_date.strftime("%Y年%m月%d日 %H:%M")

    body = f"""この度はBlue Millefeuilleにてお買い上げいただき、誠にありがとうございます。

ご注文内容は以下の通りです。

ご注文日時：{date_label}
注文番号：{order_id}

{item_lines}

合計：{_format_price(total_amount)}（送料別）

商品は一つひとつ手作業でお仕立てするため、発送まで今しばらくお待ちください。
ご不明な点がございましたら、このメールにご返信いただくか、下記までお気軽にお問い合わせください。

Blue Millefeuille
{RECORD_EMAIL}
"""

    message = EmailMessage()
    message["From"] = f"Blue Millefeuille <{settings.smtp_from or settings.smtp_user}>"
    message["To"] = to_email
    message["Cc"] = RECORD_EMAIL
    message["Subject"] = "【Blue Millefeuille】ご注文ありがとうございます"
    message.set_content(body)

    # ポート465はSSL/TLS、587等はSTARTTLSとして扱う（Next.js版のnodemailer設定と同じ判定）
    use_tls = settings.smtp_port == 465
    await aiosmtplib.send(
        message,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_user,
        password=settings.smtp_password,
        use_tls=use_tls,
        start_tls=not use_tls,
    )
