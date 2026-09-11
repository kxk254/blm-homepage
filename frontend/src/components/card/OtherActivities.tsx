import ServiceCard from "@/src/components/ui/ServiceCard";
import styles from "./OtherActivities.module.css";
import { service } from "@/data/ServiceCard";

const ACCESSORIES_ID = "002";

export default function OtherActivities() {
  const otherActivities = service.filter(
    (item) => item.id !== ACCESSORIES_ID
  );

  return (
    <section className={styles.otherActivities}>
      <span className={styles.otherTitle}>Other Activities</span>
      <p className={styles.otherLead}>
        Blue Millefeuilleを主宰するかたわら、
        <br />
        お花とともにある暮らしや、発酵美容の探求もあわせて続けています。
        <br />
        ミルフィーユの層のように重なり合う、日々の小さなこだわりです。
      </p>
      {otherActivities.map((item) => (
        <div key={item.id} className={styles.serviceItemCompact}>
          <ServiceCard
            id={item.id}
            service={item.service}
            imageSrc1={item.imageSrc1}
            imageSrc2={item.imageSrc2}
            imageSrc3={item.imageSrc3}
            content={item.content}
            link={item.link}
            icon={item.icon}
            description={item.description}
          />
        </div>
      ))}
    </section>
  );
}
