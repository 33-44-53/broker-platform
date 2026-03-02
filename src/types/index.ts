export type UserRole = 'artisan' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  location?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  images: string[];
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  stock: number;
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  artisanId: string;
  products: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'telebirr' | 'cbe' | 'bank' | 'cash';
  createdAt: string;
  deliveryAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Auction {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  artisanId: string;
  artisanName: string;
  startingBid: number;
  currentBid: number;
  endTime: string;
  bids: Bid[];
  status: 'active' | 'ended';
}

export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Analytics {
  revenue: number;
  orders: number;
  products: number;
  growth: number;
}

export interface Dispute {
  id: string;
  buyerId: string;
  buyerName: string;
  artisanId: string;
  artisanName: string;
  orderId: string;
  issueType: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}
