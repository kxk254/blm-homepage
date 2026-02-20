import Image from "next/image";
import style from "./ItemCard.module.css";
import Link from "next/link";

interface DescriptionItem {
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
    <div>
      <h3>{service}</h3>
      <div>
        {!imageSrc1 ? (
          <div>
            <Link href={link} target="_blank">
              <Image src={icon} alt={service} width={20} height={20} />
              <p>{content}</p>
            </Link>
          </div>
        ) : (
          <>
            {imageSrc1 && (
              <div>
                <Image
                  src={imageSrc1}
                  alt={`${service} image1`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            {imageSrc2 && (
              <div>
                <Image
                  src={imageSrc2}
                  alt={`${service} image2`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            {imageSrc3 && (
              <div>
                <Image
                  src={imageSrc3}
                  alt={`${service} image3`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </>
        )}
      </div>
      {description.map((item) => (
        <div key={item.id}>
          {item.typeChoice.toLowerCase() === "text" ? (
            <p>{item.content}</p>
          ) : (
            <>
              <Link href={item.href} target="_blank">
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
  );
}
