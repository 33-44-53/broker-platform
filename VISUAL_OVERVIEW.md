# 📸 Visual Project Overview

## 🎨 Application Structure

```
Harar Artisan Marketplace
│
├── 🏠 PUBLIC PAGES
│   ├── Landing Page (/)
│   │   ├── Hero Section
│   │   ├── Featured Products
│   │   ├── Statistics
│   │   └── Testimonials
│   │
│   ├── Marketplace (/marketplace)
│   │   ├── Search Bar
│   │   ├── Filter Sidebar
│   │   └── Product Grid
│   │
│   ├── Product Details (/product)
│   │   ├── Image Gallery
│   │   ├── Product Info
│   │   └── Reviews
│   │
│   └── Live Auction (/auction)
│       ├── Countdown Timer
│       ├── Bid System
│       └── Bid History
│
├── 🔐 AUTHENTICATION
│   ├── Login (/auth/login)
│   ├── Register (/auth/register)
│   └── Forgot Password (/auth/forgot-password)
│
└── 📊 DASHBOARDS
    ├── Artisan (/artisan)
    │   ├── Overview (Charts & Metrics)
    │   ├── Products (CRUD Table)
    │   ├── Orders (Management)
    │   └── Analytics (Insights)
    │
    ├── Buyer (/buyer)
    │   ├── Overview (Stats)
    │   ├── Orders (History)
    │   └── Wishlist (Saved Items)
    │
    └── Admin (/admin)
        ├── Overview (Platform Stats)
        ├── Artisans (Verification)
        ├── Commission (Tracking)
        └── Disputes (Resolution)
```

## 🎨 Color Palette

```
┌─────────────────────────────────────┐
│  HARAR ARTISAN COLOR SCHEME         │
├─────────────────────────────────────┤
│  🟡 Gold      #D4AF37  Primary      │
│  🟤 Brown     #6B4423  Text         │
│  🟫 Clay      #C4956C  Accent       │
│  🟨 Sand      #E8D5B7  Background   │
│  ⬜ Cream     #F5EFE7  Surface      │
│  🟠 Terracotta #D4704B Highlight    │
│  🔴 Rust      #B7410E  Alert        │
└─────────────────────────────────────┘
```

## 📱 Responsive Breakpoints

```
┌──────────────────────────────────────┐
│  DEVICE SUPPORT                      │
├──────────────────────────────────────┤
│  📱 Mobile    < 768px   ✅ Optimized │
│  📱 Tablet    768-1024  ✅ Optimized │
│  💻 Desktop   > 1024px  ✅ Optimized │
└──────────────────────────────────────┘
```

## 🗂️ File Structure

```
fyp/
│
├── 📄 Documentation
│   ├── README.md           (Main guide)
│   ├── QUICKSTART.md       (Quick setup)
│   ├── FEATURES.md         (Feature list)
│   ├── PROJECT_SUMMARY.md  (Overview)
│   ├── TESTING.md          (Test guide)
│   └── VISUAL_OVERVIEW.md  (This file)
│
├── ⚙️ Configuration
│   ├── package.json        (Dependencies)
│   ├── tsconfig.json       (TypeScript)
│   ├── tailwind.config.ts  (Tailwind)
│   ├── next.config.js      (Next.js)
│   └── postcss.config.js   (PostCSS)
│
└── 📁 src/
    │
    ├── 📄 app/             (Pages - Next.js App Router)
    │   ├── page.tsx                    (Landing)
    │   ├── layout.tsx                  (Root layout)
    │   ├── globals.css                 (Global styles)
    │   │
    │   ├── marketplace/page.tsx        (Marketplace)
    │   ├── product/page.tsx            (Product details)
    │   ├── auction/page.tsx            (Live auction)
    │   │
    │   ├── auth/
    │   │   ├── login/page.tsx          (Login)
    │   │   ├── register/page.tsx       (Register)
    │   │   └── forgot-password/page.tsx (Reset)
    │   │
    │   ├── artisan/page.tsx            (Artisan dashboard)
    │   ├── buyer/page.tsx              (Buyer dashboard)
    │   └── admin/page.tsx              (Admin dashboard)
    │
    ├── 🧩 components/
    │   └── ui/
    │       ├── MetricCard.tsx          (Analytics card)
    │       ├── Toast.tsx               (Notifications)
    │       ├── Modal.tsx               (Dialogs)
    │       ├── Badge.tsx               (Status tags)
    │       ├── PaymentMethod.tsx       (Payment UI)
    │       └── LoadingSpinner.tsx      (Loading)
    │
    ├── 📊 charts/
    │   └── Charts.tsx                  (All chart types)
    │
    ├── 💾 mock-data/
    │   ├── products.ts                 (6 products)
    │   ├── orders.ts                   (Orders, auctions)
    │   └── users.ts                    (Artisans, buyers)
    │
    ├── 📝 types/
    │   └── index.ts                    (TypeScript types)
    │
    └── 🛠️ utils/
        └── helpers.ts                  (Utility functions)
```

## 🎯 User Flow Diagram

```
┌─────────────────────────────────────────────────┐
│              USER JOURNEY                        │
└─────────────────────────────────────────────────┘

    START
      │
      ▼
┌─────────────┐
│ Landing (/) │
└─────────────┘
      │
      ├─────────────────┬─────────────────┐
      ▼                 ▼                 ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│Marketplace│    │ Auction  │    │  Login   │
└──────────┘    └──────────┘    └──────────┘
      │                               │
      ▼                               ▼
┌──────────┐              ┌──────────────────┐
│ Product  │              │  Role Selection  │
│ Details  │              └──────────────────┘
└──────────┘                        │
      │                   ┌─────────┼─────────┐
      ▼                   ▼         ▼         ▼
┌──────────┐      ┌─────────┐ ┌──────┐ ┌──────┐
│Add to Cart│      │ Artisan │ │Buyer │ │Admin │
└──────────┘      │Dashboard│ │ Dash │ │ Dash │
                  └─────────┘ └──────┘ └──────┘
```

## 📊 Dashboard Features

### Artisan Dashboard
```
┌────────────────────────────────────┐
│  ARTISAN DASHBOARD                 │
├────────────────────────────────────┤
│  📊 Overview                       │
│     ├─ Revenue Metrics             │
│     ├─ Order Count                 │
│     ├─ Product Stats               │
│     └─ Charts (Pie, Bar, Line)     │
│                                    │
│  📦 Products                       │
│     ├─ Product Table               │
│     ├─ Add/Edit/Delete             │
│     └─ Stock Management            │
│                                    │
│  🛍️ Orders                         │
│     ├─ Order List                  │
│     ├─ Status Updates              │
│     └─ Customer Info               │
│                                    │
│  📈 Analytics                      │
│     ├─ Revenue Trends              │
│     ├─ Category Performance        │
│     └─ Sales Insights              │
└────────────────────────────────────┘
```

### Buyer Dashboard
```
┌────────────────────────────────────┐
│  BUYER DASHBOARD                   │
├────────────────────────────────────┤
│  📊 Overview                       │
│     ├─ Total Orders                │
│     ├─ Total Spent                 │
│     ├─ Wishlist Count              │
│     └─ Spending Charts             │
│                                    │
│  📦 Orders                         │
│     ├─ Order History               │
│     ├─ Tracking Info               │
│     └─ Reorder Option              │
│                                    │
│  ❤️ Wishlist                       │
│     ├─ Saved Products              │
│     ├─ Add to Cart                 │
│     └─ Remove Items                │
└────────────────────────────────────┘
```

### Admin Dashboard
```
┌────────────────────────────────────┐
│  ADMIN DASHBOARD                   │
├────────────────────────────────────┤
│  📊 Overview                       │
│     ├─ Platform Revenue            │
│     ├─ Commission Earned           │
│     ├─ User Counts                 │
│     └─ Growth Charts               │
│                                    │
│  👥 Artisans                       │
│     ├─ Verification Queue          │
│     ├─ Approve/Reject              │
│     └─ Artisan Profiles            │
│                                    │
│  💰 Commission                     │
│     ├─ Rate Management             │
│     ├─ Earnings Tracking           │
│     └─ Payment Reports             │
│                                    │
│  ⚖️ Disputes                       │
│     ├─ Case Management             │
│     ├─ Resolution Tools            │
│     └─ Communication               │
└────────────────────────────────────┘
```

## 🎨 Component Library

```
┌─────────────────────────────────────┐
│  REUSABLE COMPONENTS                │
├─────────────────────────────────────┤
│  📊 MetricCard                      │
│     Display analytics metrics       │
│                                     │
│  🔔 Toast                           │
│     Show notifications              │
│                                     │
│  📦 Modal                           │
│     Dialog boxes                    │
│                                     │
│  🏷️ Badge                           │
│     Status indicators               │
│                                     │
│  💳 PaymentMethod                   │
│     Payment selection UI            │
│                                     │
│  ⏳ LoadingSpinner                  │
│     Loading states                  │
└─────────────────────────────────────┘
```

## 📈 Chart Types

```
┌─────────────────────────────────────┐
│  DATA VISUALIZATION                 │
├─────────────────────────────────────┤
│  🥧 Pie Chart                       │
│     Category distribution           │
│     Payment methods                 │
│                                     │
│  📊 Bar Chart                       │
│     Monthly sales                   │
│     Comparisons                     │
│                                     │
│  📈 Line Chart                      │
│     Revenue trends                  │
│     Growth over time                │
│                                     │
│  📉 Area Chart                      │
│     Order trends                    │
│     Volume tracking                 │
└─────────────────────────────────────┘
```

## 🎯 Key Metrics

```
┌─────────────────────────────────────┐
│  PROJECT STATISTICS                 │
├─────────────────────────────────────┤
│  📄 Pages:           10             │
│  🧩 Components:      16+            │
│  📊 Charts:          4 types        │
│  💾 Mock Data:       20+ items      │
│  🎨 Colors:          7 theme        │
│  📱 Breakpoints:     3 sizes        │
│  ⚡ Animations:      Smooth         │
│  ✅ TypeScript:      100%           │
│  📐 Responsive:      100%           │
│  🎯 Complete:        100%           │
└─────────────────────────────────────┘
```

## 🚀 Quick Navigation

```
Home            →  /
Marketplace     →  /marketplace
Product         →  /product
Auction         →  /auction
Login           →  /auth/login
Register        →  /auth/register
Artisan Dash    →  /artisan
Buyer Dash      →  /buyer
Admin Dash      →  /admin
```

---

**🎉 Your complete visual guide to the Harar Artisan Marketplace!**
