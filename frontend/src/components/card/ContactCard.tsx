import Link from "next/link";
import styles from "./ContactCard.module.css";

interface Contact {
  email: string;
  instagram: string;
}

export default function ContactCard({ email, instagram }: Contact) {
  return (
    <main className={styles.mainContents}>
      <div className={styles.directContact}>
        <p>お問い合わせはこちら</p>
        <div>
          Email:
          <Link href={`mailto:${email}`}>{email}</Link>
        </div>
        <div>
          Instagram:
          <Link href={`https://www.instagram.com/${instagram}`} target="_blank">
            @{instagram}
          </Link>
        </div>
      </div>
    </main>
  );
}
