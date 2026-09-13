"use client";

import { useActionState } from "react";
import { createAdminAccount, type CreateAdminState } from "./actions";
import styles from "./page.module.css";

const initialState: CreateAdminState = {};

export default function CreateAdminForm() {
  const [state, formAction, isPending] = useActionState(
    createAdminAccount,
    initialState
  );

  return (
    <div>
      <form action={formAction} className={styles.createForm}>
        <label className={styles.field}>
          <span>メールアドレス</span>
          <input type="email" name="email" required autoComplete="off" />
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
        <button type="submit" className={styles.button} disabled={isPending}>
          {isPending ? "作成中..." : "管理者アカウントを作成"}
        </button>
      </form>
      {state.error && <p className={styles.error}>{state.error}</p>}
      {state.message && <p className={styles.message}>{state.message}</p>}
    </div>
  );
}
