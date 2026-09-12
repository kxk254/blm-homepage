"use client";

import { useActionState } from "react";
import Link from "next/link";
import styles from "../account.module.css";
import { requestPasswordReset, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Reset Password</span>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          <span>メールアドレス</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
        {state.error && <p className={styles.error}>{state.error}</p>}
        {state.message && <p className={styles.message}>{state.message}</p>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "送信中..." : "再設定メールを送る"}
        </button>
      </form>
      <Link href="/account/login" className={styles.switchLink}>
        ログイン画面に戻る
      </Link>
    </div>
  );
}
