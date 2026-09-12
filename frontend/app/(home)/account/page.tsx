import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import styles from "./account.module.css";
import { createClient } from "@/src/lib/supabase/server";
import { db } from "@/src/lib/db/client";
import { customers } from "@/src/lib/db/schema";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, user.id))
    .limit(1);

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>My Page</span>
      <p className={styles.email}>{customer?.email ?? user.email}</p>
      <form action={signOut}>
        <button type="submit" className={styles.logoutButton}>
          ログアウト
        </button>
      </form>
    </div>
  );
}
