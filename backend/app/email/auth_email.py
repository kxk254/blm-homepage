from email.message import EmailMessage

import aiosmtplib

from app.core.config import settings


async def send_password_reset_email(to_email: str, reset_url: str) -> None:
    body = f"""パスワード再設定のリクエストを受け付けました。

以下のリンクから新しいパスワードを設定してください（{settings.site_url}）。
このリンクの有効期限は30分です。

{reset_url}

心当たりがない場合は、このメールを破棄してください。

Blue Millefeuille
"""
    message = EmailMessage()
    message["From"] = f"Blue Millefeuille <{settings.smtp_from or settings.smtp_user}>"
    message["To"] = to_email
    message["Subject"] = "【Blue Millefeuille】パスワード再設定"
    message.set_content(body)

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
