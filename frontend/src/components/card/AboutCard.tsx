import ServiceCard from "@/src/components/ui/ServiceCard";
import styles from "./AboutCard.module.css";
import { service } from "@/data/ServiceCard";

export default function AboutCard() {
  return (
    <section>
      <div>
        <span>Out Services</span>
        {service.map((item) => (
          <ServiceCard
            key={item.id}
            id={item.id}
            service={item.service}
            imageSrc1={item.imageSrc1}
            imageSrc2={item.imageSrc2}
            imageSrc3={item.omageSrc3}
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
