import { User, Review } from '@/types';

export const mockArtisans: User[] = [
  {
    id: 'a1',
    name: 'Fatima Ahmed',
    email: 'fatima@hararartisan.com',
    role: 'artisan',
    location: 'Jugol, Harar',
    phone: '+251 912 345 678',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'a2',
    name: 'Mohammed Hassan',
    email: 'mohammed@hararartisan.com',
    role: 'artisan',
    location: 'Harar City Center',
    phone: '+251 911 234 567',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'a3',
    name: 'Aisha Ibrahim',
    email: 'aisha@hararartisan.com',
    role: 'artisan',
    location: 'Harar Old Town',
    phone: '+251 913 456 789',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'a4',
    name: 'Zainab Ali',
    email: 'zainab@hararartisan.com',
    role: 'artisan',
    location: 'Jugol, Harar',
    phone: '+251 914 567 890',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

export const mockBuyers: User[] = [
  {
    id: 'b1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'buyer',
    location: 'Addis Ababa, Ethiopia',
    phone: '+251 911 111 111',
  },
  {
    id: 'b2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    role: 'buyer',
    location: 'Dire Dawa, Ethiopia',
    phone: '+251 911 222 222',
  },
  {
    id: 'b3',
    name: 'Ahmed Ali',
    email: 'ahmed@example.com',
    role: 'buyer',
    location: 'Harar, Ethiopia',
    phone: '+251 911 333 333',
  },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    buyerId: 'b1',
    buyerName: 'John Doe',
    rating: 5,
    comment: 'Beautiful craftsmanship! The basket is even more stunning in person.',
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'r2',
    productId: '1',
    buyerId: 'b2',
    buyerName: 'Sarah Smith',
    rating: 5,
    comment: 'Excellent quality and fast delivery. Highly recommend!',
    createdAt: '2024-02-10T14:30:00Z',
  },
  {
    id: 'r3',
    productId: '2',
    buyerId: 'b3',
    buyerName: 'Ahmed Ali',
    rating: 4,
    comment: 'Great coffee set, perfect for traditional ceremonies.',
    createdAt: '2024-02-08T09:15:00Z',
  },
];
