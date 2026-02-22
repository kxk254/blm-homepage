import styles from "./Hero.module.css";
import Image from "next/image";

export default function Hero() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroText}>
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
    </div>
  );
}
