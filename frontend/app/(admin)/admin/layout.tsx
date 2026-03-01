import { ReactNode } from "react";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* Add sidebar or header here if needed later */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
