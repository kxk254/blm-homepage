import Link from "next/link";

export default function ContactCard() {
  return (
    <main>
      <div>
        <p>お問い合わせはこちら</p>
        <div>
          Email:
          <Link href="mailto:bmflower2001@gmail.com">
            bmflower2001@gmail.com
          </Link>
        </div>
        <div>
          Instagram:
          <Link
            href="https://www.instagram.com/bluemillefeuille2001"
            target="_blank"
          >
            @bluemillefeuille2001
          </Link>
        </div>
      </div>
    </main>
  );
}
