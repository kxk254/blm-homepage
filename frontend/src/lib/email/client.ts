import "server-only";
import nodemailer from "nodemailer";

// 自前のメールサーバー(Mailcow等)を含む任意のSMTPサーバーに対応させるため
// 特定のメール送信サービスにロックインしない汎用実装にしている
export function createMailer() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !password) {
    throw new Error(
      "SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD is not set. Add them to .env.local."
    );
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // 465はSSL/TLS、587等はSTARTTLS
    auth: { user, pass: password },
  });
}
