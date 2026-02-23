import styles from "./page.module.css";
import ContactCard from "@/src/components/card/ContactCard";
{
  /* import { contact } from "@/data/ContactCard"; */
}

async function getContact() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/contact`,
    {
      cache: "no-store",
    },
  );
  const contact = await res.json();
  return contact;
}

export default async function Contact() {
  const contact = await getContact();
  return (
    <div className={styles.content}>
      <ContactCard
        id={contact[0].id}
        email={contact[0].email}
        instagram={contact[0].instagram}
      />
    </div>
  );
}
