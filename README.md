# Harar City Artisans Digital Broker Marketplace

A modern, responsive web-based marketplace platform connecting artisans in Harar City with buyers through a digital broker system.

## 🎨 Features

### Public Pages
- **Landing Page**: Premium hero section with featured artisans and trending products
- **Marketplace**: Advanced filtering, search, and product browsing
- **Product Details**: Image gallery, reviews, and artisan profiles
- **Live Auctions**: Real-time bidding with countdown timers

### Authentication
- Login/Register with role selection (Buyer/Artisan)
- Password reset functionality
- Role-based routing

### Dashboards

#### Artisan Dashboard
- Revenue analytics with interactive charts
- Product management (CRUD operations)
- Order tracking and management
- Sales analytics and insights

#### Buyer Dashboard
- Order history and tracking
- Wishlist management
- Spending analytics
- Purchase insights

#### Admin Dashboard
- Platform overview and analytics
- Artisan verification system
- Commission management
- Dispute resolution panel

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── artisan/           # Artisan dashboard
│   ├── auction/           # Live auction page
│   ├── auth/              # Authentication pages
│   ├── buyer/             # Buyer dashboard
│   ├── marketplace/       # Product marketplace
│   └── product/           # Product details
├── components/
│   └── ui/                # Reusable UI components
├── charts/                # Chart components
├── mock-data/             # Mock JSON data
├── types/                 # TypeScript interfaces
└── utils/                 # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

Use these emails to test different roles:
- **Artisan**: artisan@test.com
- **Buyer**: buyer@test.com
- **Admin**: admin@test.com

Password: any password (mock authentication)

## 🎨 Design System

### Color Palette (Harar Theme)
- **Clay**: #C4956C
- **Terracotta**: #D4704B
- **Sand**: #E8D5B7
- **Gold**: #D4AF37
- **Brown**: #6B4423
- **Cream**: #F5EFE7
- **Rust**: #B7410E

### Typography
- Font: Inter
- Responsive sizing with clear hierarchy

### Components
- Rounded corners (2xl)
- Soft shadows
- Smooth transitions
- Micro-animations

## 📊 Features Breakdown

### Charts & Analytics
- Pie charts for category distribution
- Bar charts for monthly sales
- Line graphs for revenue trends
- Area charts for order trends

### Interactive Elements
- Product cards with hover effects
- Real-time auction countdown
- Toast notifications
- Modal dialogs
- Loading states

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interfaces

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📦 Mock Data

All data is simulated using local JSON files:
- Products: 6 sample artisan products
- Orders: 3 sample orders
- Auctions: 1 active auction
- Disputes: 2 sample disputes
- Users: Multiple artisans and buyers

## 🎯 Key Pages

### Public
- `/` - Landing page
- `/marketplace` - Product marketplace
- `/product` - Product details
- `/auction` - Live auction

### Authentication
- `/auth/login` - Login page
- `/auth/register` - Registration
- `/auth/forgot-password` - Password reset

### Dashboards
- `/artisan` - Artisan dashboard
- `/buyer` - Buyer dashboard
- `/admin` - Admin dashboard

## 🌟 UI Components

### Reusable Components
- MetricCard - Analytics metric display
- Toast - Notification system
- Modal - Dialog boxes
- Badge - Status indicators
- PaymentMethod - Payment selection
- LoadingSpinner - Loading states

### Chart Components
- CategoryPieChart
- SalesBarChart
- RevenueLineChart
- OrderAreaChart

## 🎨 Styling

Custom Tailwind classes:
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.card` - Content card
- `.input-field` - Form input
- `.metric-card` - Analytics card

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Security Features (UI)

- Password visibility toggle
- Secure payment method selection
- Order verification UI
- Dispute resolution system

## 🚀 Performance

- Optimized images
- Lazy loading
- Code splitting
- Minimal bundle size

## 📄 License

This project is for educational purposes.

## 👥 Contributors

Harar Artisan Marketplace Team

---

Built with ❤️ for Harar City Artisans
