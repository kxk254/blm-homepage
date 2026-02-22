import styles from "./page.module.css";
import ContactCard from "@/src/components/card/ContactCard";
import { contact } from "@/data/ContactCard";

export default function Contact() {
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
