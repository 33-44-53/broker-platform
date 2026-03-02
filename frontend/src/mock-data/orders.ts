import { Order, Analytics, Auction, Dispute } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    buyerId: 'b1',
    buyerName: 'John Doe',
    artisanId: 'a1',
    products: [
      { productId: '1', productName: 'Traditional Harari Basket', quantity: 2, price: 850 },
    ],
    total: 1700,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'telebirr',
    createdAt: '2024-01-20T10:00:00Z',
    deliveryAddress: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'ORD-002',
    buyerId: 'b2',
    buyerName: 'Sarah Smith',
    artisanId: 'a2',
    products: [
      { productId: '2', productName: 'Handcrafted Coffee Set', quantity: 1, price: 1200 },
    ],
    total: 1200,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'cbe',
    createdAt: '2024-02-15T14:30:00Z',
    deliveryAddress: 'Dire Dawa, Ethiopia',
  },
  {
    id: 'ORD-003',
    buyerId: 'b3',
    buyerName: 'Ahmed Ali',
    artisanId: 'a1',
    products: [
      { productId: '3', productName: 'Woven Wall Hanging', quantity: 1, price: 650 },
    ],
    total: 650,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    createdAt: '2024-02-18T09:15:00Z',
    deliveryAddress: 'Harar, Ethiopia',
  },
];

export const mockAnalytics: Analytics = {
  revenue: 45600,
  orders: 127,
  products: 48,
  growth: 23.5,
};

export const mockAuctions: Auction[] = [
  {
    id: 'AUC-001',
    productId: '7',
    productName: 'Rare Antique Basket',
    productImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500',
    artisanId: 'a1',
    artisanName: 'Fatima Ahmed',
    startingBid: 2000,
    currentBid: 3500,
    endTime: '2024-03-01T18:00:00Z',
    bids: [
      { id: 'b1', bidderId: 'u1', bidderName: 'John Doe', amount: 2500, timestamp: '2024-02-20T10:00:00Z' },
      { id: 'b2', bidderId: 'u2', bidderName: 'Sarah Smith', amount: 3000, timestamp: '2024-02-20T11:30:00Z' },
      { id: 'b3', bidderId: 'u3', bidderName: 'Ahmed Ali', amount: 3500, timestamp: '2024-02-20T14:15:00Z' },
    ],
    status: 'active',
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: 'DIS-001',
    buyerId: 'b1',
    buyerName: 'John Doe',
    artisanId: 'a2',
    artisanName: 'Mohammed Hassan',
    orderId: 'ORD-045',
    issueType: 'Product Quality',
    description: 'Product received was damaged during shipping.',
    status: 'in-progress',
    createdAt: '2024-02-18T10:00:00Z',
  },
  {
    id: 'DIS-002',
    buyerId: 'b4',
    buyerName: 'Lisa Johnson',
    artisanId: 'a3',
    artisanName: 'Aisha Ibrahim',
    orderId: 'ORD-052',
    issueType: 'Wrong Item',
    description: 'Received different product than ordered.',
    status: 'open',
    createdAt: '2024-02-19T15:30:00Z',
  },
];

export const mockChartData = {
  monthlySales: [
    { month: 'Jan', sales: 4200 },
    { month: 'Feb', sales: 5800 },
    { month: 'Mar', sales: 7200 },
    { month: 'Apr', sales: 6500 },
    { month: 'May', sales: 8900 },
    { month: 'Jun', sales: 9500 },
  ],
  categoryDistribution: [
    { name: 'Baskets', value: 35 },
    { name: 'Pottery', value: 25 },
    { name: 'Textiles', value: 20 },
    { name: 'Leather Goods', value: 15 },
    { name: 'Other', value: 5 },
  ],
  revenueByPayment: [
    { name: 'Telebirr', value: 45 },
    { name: 'CBE Birr', value: 30 },
    { name: 'Bank Transfer', value: 15 },
    { name: 'Cash', value: 10 },
  ],
};
