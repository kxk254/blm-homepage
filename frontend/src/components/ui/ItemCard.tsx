import Image from "next/image";
import Link from "next/link";
import styles from "./ItemCard.module.css";

type CardProps = {
  id: string;
  productType: string;
  productColor: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  imageSrc: string;
  link?: string;
};

export default function ItemCard({
  id,
  productType,
  productColor,
  productName,
  productDescription,
  productPrice,
  imageSrc,
  link,
}: CardProps) {
  return (
    <div>
      <div>
        <Link href={link}>
          <Image />
        </Link>
      </div>
      <div></div>
      <div></div>
    </div>
  );
}
