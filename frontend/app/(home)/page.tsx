import Image from "next/image";
import styles from "./page.module.css";
import HeroSection from "@/src/components/hero/Hero";
import HomeCard from "@/src/components/card/HomeCard";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className={styles.items}>
        <HomeCard />
      </div>
    </>
  );
}
