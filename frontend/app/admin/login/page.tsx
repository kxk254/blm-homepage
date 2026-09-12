"use client";

import { useActionState } from "react";
import styles from "./page.module.css";
import { signInAdmin, type AdminAuthState } from "./actions";

const initialState: AdminAuthState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    signInAdmin,
    initialState
  );

  return (
    <div className={styles.content}>
      <h1 className={styles.heading}>管理者ログイン</h1>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          <span>メールアドレス</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label className={styles.field}>
          <span>パスワード</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </label>
        {state.error && <p className={styles.error}>{state.error}</p>}
        <button type="submit" className={styles.button} disabled={isPending}>
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
