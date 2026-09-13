// FastAPIバックエンドのレスポンス型。以前のDrizzleスキーマ由来の型と
// 同じcamelCaseフィールド名になるよう、バックエンド側でエイリアスを揃えてある。

export interface Product {
  id: string;
  productType: string;
  productColor: string;
  productName: string;
  productDescription: string;
  detailDescription: string;
  // 商品詳細ページの補足情報。すべて空文字の場合がある(未入力なら非表示にする)
  story: string;
  sizeInfo: string;
  materialInfo: string;
  careInfo: string;
  lostItemNote: string;
  productPrice: number;
  // カバー画像(1枚目)。一覧・カート等、1枚だけでよい箇所向け
  imageSrc: string;
  // 商品詳細ページのギャラリー表示用。1〜8枚、順番が表示順
  imageSrcs: string[];
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
  shippingName: string | null;
  shippingPhone: string | null;
  shippingPostalCode: string | null;
  shippingAddress: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  refundedAt: string | null;
  refundAmount: number | null;
  refundReason: string | null;
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

export interface ProductCategory {
  code: string;
  label: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  createdAt: string;
}

export interface CustomerFieldHistory {
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: string;
}
