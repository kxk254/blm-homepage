import styles from "./Hero.module.css";
import Image from "next/image";

export default function Hero() {
  return (
    <div>
      <section className={styles.hero}>
        <Image
          src="/asset/main.jpg"
          alt="Blue Mille Feuille のハンドメイドアクセサリー"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroText}>
          <span className={styles.heroAccent} />
          <h1>日常に、そっときらめきを・・・・</h1>
          <p>Your "Everyday" with a hint of special.</p>
        </div>
      </section>
      <section className={styles.sectionPadding}>
        <span className={styles.conceptTitle}>Concept</span>
        <div className={styles.conceptBody}>
          <p>
            どんなお洋服にも自然になじみながら、
            <br />
            耳元に小さな幸せを運ぶイヤリング。
            <br />
            毎日を少しだけ華やかにしてくれる、
            <br />
            きらめくお守りのような存在です。
          </p>
          <p className={styles.conceptBody2}>
            {" "}
            あなたの“いつも”に、さりげない特別を・・・・
          </p>
        </div>
      </section>
      <section className={styles.craftSection}>
        <span className={styles.conceptTitle}>Craftsmanship</span>
        <div className={styles.conceptBody}>
          <p>世界から集めた、心惹かれるビーズやパーツ。</p>
          <p>
            色、かたち、質感。
            <br />
            ひとつひとつ異なる素材を自由に組み合わせ、
            <br />
            手作業でひとつのかたちに仕立てています。
          </p>
          <p>
            思いがけない組み合わせから生まれる、
            <br />
            そのアクセサリーだけの表情。
          </p>
          <p className={styles.conceptBody2}>
            選ぶこと、組み合わせること。
            <br />
            そこから生まれる、小さなきらめきを。
          </p>
        </div>
      </section>
    </div>
  );
}
