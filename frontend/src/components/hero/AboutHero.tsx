import styles from "./AboutHero.module.css";

export default function AboutHero() {
  return (
    <section className={styles.conceptBox}>
      <span className={styles.sectionTitle}>About Us</span>
      <div>
        <p className={styles.sectionLead}>
          「毎日を、昨日より少しだけ華やかに。」
        </p>
        <p>
          Blue Millefeuilleは、お花・アクセサリー・美容という
          <br />
          3つのエッセンスを重ね合わせ、心豊かなライフスタイルを提案しています。
          <br />
          ミルフィーユの層が重なり合って一つの美味しさを作るように、
          <br />
          耳元に輝くイヤリング、部屋を彩る季節の花、そして内側から美しさを育む食習慣。
          <br />
          それらが調和したとき、あなたの日常には心地よい「きらめき」が生まれます。
        </p>
        <div className={styles.thinLine}></div>
        <p className={styles.sectionBottom}>
          {" "}
          完璧ではないからこその美しさ。
          <br />
          シャビーシックな思想を背景に、自然体な特別感を演出します。
        </p>
      </div>
    </section>
  );
}
