// FastAPIバックエンドのレスポンス型。以前のDrizzleスキーマ由来の型と
// 同じcamelCaseフィールド名になるよう、バックエンド側でエイリアスを揃えてある。

export interface Product {
  id: string;
  productType: string;
  productColor: string;
  productName: string;
  productDescription: string;
  detailDescription: string;
  productPrice: number;
  imageSrc: string;
  stockQuantity: number;
  themeId: number | null;
  createdAt: string;
}

export interface Theme {
  id: number;
  name: string;
  displayOrder: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string | null;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  customerEmail: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  email: string;
  isAdmin: boolean;
  fullName: string | null;
  phone: string | null;
  postalCode: string | null;
  address: string | null;
}

export interface AdminCustomer {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  postalCode: string | null;
  address: string | null;
  createdAt: string;
  orderCount: number;
}

export interface AdminProductListItem {
  id: string;
  productName: string;
  productPrice: number;
  stockQuantity: number;
  imageSrc: string;
  themeName: string | null;
}

export interface MediaImage {
  name: string;
  url: string;
}
