export interface ContactProps {
  id: number;
  email: string;
  instagram: string;
}

export interface CardProps {
  id: number;
  productType: string;
  productColor: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  imageSrc: string;
  link: string;
}

export interface DescriptionItem {
  id: number;
  serviceId: string;
  typeChoice: string;
  content: string;
  href: string;
  icon: string;
}
export interface ServiceCardProps {
  id: number;
  service: string;
  imageSrc1?: string;
  imageSrc2?: string;
  imageSrc3?: string;
  content: string;
  link: string;
  icon: string;
  description: DescriptionItem[];
}
