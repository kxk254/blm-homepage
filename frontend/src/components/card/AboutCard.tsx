import ServiceCard from "@/src/components/ui/ServiceCard";
import styles from "./AboutCard.module.css";
{
  /* import { service } from "@/data/ServiceCard"; */
}
async function getService() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/about`, {
    cache: "no-store",
  });
  const service = await res.json();
  return service;
}
export default async function AboutCard() {
  const service = await getService();
  return (
    <section className={styles.allSection}>
      <div className={styles.serviceItem}>
        <span className={styles.title}>Our Services</span>
        {service.map((item) => (
          <ServiceCard
            key={item.id}
            id={item.id}
            service={item.service}
            imageSrc1={item.image_src1}
            imageSrc2={item.image_src2}
            imageSrc3={item.image_src3}
            content={item.content}
            link={item.link}
            icon={item.icon}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}
