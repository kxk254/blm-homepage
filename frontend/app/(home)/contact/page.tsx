import type { Metadata } from "next";
import styles from "./page.module.css";
import ContactCard from "@/src/components/card/ContactCard";
import { contact } from "@/data/ContactCard";

export const metadata: Metadata = {
  title: "Contact | Blue Millefeuille",
  description:
    "Blue Millefeuilleへのお問い合わせはこちらから。ご不明な点はメールまたはInstagramのDMでお気軽にご連絡ください。",
  alternates: {
    canonical: "/contact",
  },
};

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
