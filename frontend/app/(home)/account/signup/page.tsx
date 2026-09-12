"use client";

import { useActionState } from "react";
import Link from "next/link";
import styles from "../account.module.css";
import { signUp, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Sign Up</span>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          <span>メールアドレス</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label className={styles.field}>
          <span>パスワード（8文字以上）</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {state.error && <p className={styles.error}>{state.error}</p>}
        {state.message && <p className={styles.message}>{state.message}</p>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "登録中..." : "登録する"}
        </button>
      </form>
      <Link href="/account/login" className={styles.switchLink}>
        すでにアカウントをお持ちの方はこちら
      </Link>
    </div>
  );
}
