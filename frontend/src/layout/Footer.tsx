import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div>
        <Link
          href="https://www.instagram.com/bluemillefeuille2001"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/asset/instagram.png"
            width={24}
            height={24}
            alt="Instagram"
          />
        </Link>
        <Link
          href="https://www.facebook.com/profile.php?id=100070949671198"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/asset/facebook.png"
            width={24}
            height={24}
            alt="Facebook"
          />
        </Link>
        <Link
          href="https://mdfshop.base.shop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/asset/base.png" width={24} height={24} alt="Base" />
        </Link>
      </div>
      <div className={styles.footerLinks}>
        <Link href="/about">ABOUT</Link>
        <Link href="/contact">CONTACT</Link>
      </div>
      <p>&copy; {currentYear} Blue Mille Feuille All Rights Reserved.</p>
    </footer>
  );
}
