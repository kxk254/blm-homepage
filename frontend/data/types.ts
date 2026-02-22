export interface ContactProps {
  id: string;
  email: string;
  instagram: string;
}

export interface CardProps {
  id: string;
  productType: string;
  productColor: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  imageSrc: string;
  link: string;
}

export interface DescriptionItem {
  id: string;
  serviceId: string;
  typeChoice: string;
  content: string;
  href: string;
  icon: string;
}
export interface ServiceCardProps {
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
