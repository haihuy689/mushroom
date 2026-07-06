export type PiScope = "username" | "payments" | "wallet_address";

export interface PiAuthUser {
  uid: string;
  username?: string;
  wallet_address?: string;
}

export interface PiAuthResult {
  accessToken: string;
  user: PiAuthUser;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

export interface PiPaymentDto {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  from_address: string;
  to_address: string;
  direction: string;
  created_at: string;
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface PiVerifiedUser {
  uid: string;
  username?: string;
  wallet_address?: string;
  credentials?: {
    scopes: PiScope[];
    valid_until?: {
      timestamp: number;
      iso8601: string;
    };
  };
}

export interface Product {
  id: string;
  sourceProductId?: string;
  quantity?: number;
  slug: string;
  name: string;
  sku?: string;
  tagline: string;
  description: string;
  category: string;
  format: string;
  pricePi: number;
  compareAtPi?: number;
  costPi?: number;
  baseSoldCount?: number;
  actualSoldCount?: number;
  badge: string;
  accent: string;
  inventoryCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  lowStockThreshold?: number;
  packaging?: string;
  imageUrl?: string;
  galleryImageUrls?: string[];
  videoUrl?: string;
  mediaNote?: string;
  weightValue?: number;
  weightUnit?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  coverNote: string;
  coverImageUrl?: string;
  body: string[];
}
