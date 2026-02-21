import Image from "next/image";
import styles from "./ServiceCard.module.css";
import Link from "next/link";

interface DescriptionItem {
  id: string;
  serviceId: string;
  typeChoice: string;
  content: string;
  href: string;
  icon: string;
}

interface ServiceCardProps {
  id: string;
  service: string;
  imageSrc1?: string;
  imageSrc2?: string;
  imageSrc3?: string;
  content: string;
  link: string;
  icon: string;
  description: DescriptionItem[];
}

export default function ServiceCard({
  id,
  service,
  imageSrc1,
  imageSrc2,
  imageSrc3,
  content,
  link,
  icon,
  description,
}: ServiceCardProps) {
  return (
    <div className={styles.servicesGrid}>
      <h3>{service}</h3>
      <div className={styles.serviceImageGroup}>
        {!imageSrc1 ? (
          <div className={styles.iconWrapper}>
            <Link href={link} target="_blank" className={styles.iconLink}>
              <Image src={icon} alt={service} width={20} height={20} />
              <p>{content}</p>
            </Link>
          </div>
        ) : (
          <>
            {imageSrc1 && (
              <div className={styles.imageWrapper}>
                <Image src={imageSrc1} alt={`${service} image1`} fill />
              </div>
            )}
            {imageSrc2 && (
              <div className={styles.imageWrapper}>
                <Image src={imageSrc2} alt={`${service} image2`} fill />
              </div>
            )}
            {imageSrc3 && (
              <div className={styles.imageWrapper}>
                <Image src={imageSrc3} alt={`${service} image3`} fill />
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.descriptionContainer}>
        {description.map((item) => (
          <div key={item.id} className={styles.description}>
            {item.typeChoice.toLowerCase() === "text" ? (
              <span className={styles.descriptionItem}>{item.content}</span>
            ) : (
              <>
                <Link
                  href={item.href}
                  target="_blank"
                  className={styles.descriptionItem}
                >
                  {item.icon && (
                    <Image src={item.icon} alt="" width={20} height={20} />
                  )}
                  <p>{item.content}</p>
                </Link>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
