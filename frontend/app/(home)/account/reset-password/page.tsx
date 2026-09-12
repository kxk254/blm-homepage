"use client";

import { useActionState } from "react";
import styles from "../account.module.css";
import { updatePassword, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState
  );

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>New Password</span>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          <span>新しいパスワード（8文字以上）</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {state.error && <p className={styles.error}>{state.error}</p>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "更新中..." : "パスワードを更新する"}
        </button>
      </form>
    </div>
  );
}
