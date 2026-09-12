"use client";

import { useActionState } from "react";
import Link from "next/link";
import styles from "../account.module.css";
import { signIn, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Login</span>
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
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <Link href="/account/signup" className={styles.switchLink}>
        アカウントをお持ちでない方はこちら
      </Link>
    </div>
  );
}
