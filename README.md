# Harar Artisan Marketplace - Broker Platform

A digital marketplace platform connecting Harar City artisans with buyers worldwide, featuring artisan dashboards, buyer portals, product management, and order tracking.

## Features

### Buyer Features
- **Product Browsing & Search**: Browse products with filters (category, artisan, location, price)
- **Shopping Cart**: Add/remove items, manage quantities
- **Multi-Step Checkout**: Cart → Review → Checkout → Confirmation
- **Order History & Tracking**: View past purchases and real-time order status
- **Ratings & Reviews**: Leave feedback on products and artisans
- **Wishlist**: Save favorite products
- **Live Auctions**: Participate in product auctions

### Artisan Features
- **Product Management**: Create, update, and manage product listings
- **Sales Analytics**: View earnings, monthly averages, best-selling products
- **Order Management**: Track incoming orders and customer details
- **Profile Management**: Update artisan information and specialties
- **Auction Management**: Create and manage product auctions
- **Customer Feedback**: View ratings and reviews from buyers

### Admin Features
- **User Management**: Manage artisans and buyers
- **Platform Analytics**: Monitor sales, users, and transactions
- **Content Moderation**: Approve/reject listings and auctions

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Language**: PHP
- **Database**: MySQL
- **Server**: Apache (XAMPP)

## Project Structure

```
broker-platform/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Page components
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts (Cart, Products)
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/                 # PHP backend API
│   ├── api/
│   │   └── controllers/     # API endpoints
│   └── database/            # SQL migrations
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- PHP 8+
- MySQL 8+
- XAMPP (for local development)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

### Backend Setup
1. Start XAMPP (Apache + MySQL)
2. Place backend files in `htdocs/api`
3. Create database and import SQL files
4. API runs on `http://localhost/api/controllers/`

## Key Features Implementation

### Shopping Cart & Checkout
- Multi-step checkout flow with progress indicator
- Form-encoded POST requests to PHP API
- Order confirmation with order ID

### Order Tracking
- Real-time order status updates
- Delivery timeline visualization
- Order details and item breakdown

### Ratings & Reviews
- 5-star rating system
- Product and artisan reviews
- Review history for buyers

### Product Filters
- Category, artisan, location, and price filters
- Dynamic filter generation from product data
- Combined filter support

## API Endpoints

### Orders
- `POST /api/controllers/orders.php` - Create order
- `GET /api/controllers/orders.php?buyer_id={id}` - Get buyer orders

### Products
- `GET /api/controllers/products.php` - Get all products
- `POST /api/controllers/products.php` - Create product
- `PUT /api/controllers/products.php` - Update product

### Reviews
- `POST /api/controllers/reviews.php` - Submit review
- `GET /api/controllers/reviews.php?buyer_id={id}` - Get buyer reviews

### Analytics
- `GET /api/controllers/analytics.php?user_id={id}&role={role}` - Get user analytics

## User Roles

- **Buyer**: Browse, purchase, review products
- **Artisan**: Manage products, view sales, track orders
- **Admin**: Manage platform, users, and content

## Database Schema

Key tables:
- `users` - User accounts (artisans, buyers, admins)
- `products` - Product listings
- `orders` - Customer orders
- `order_items` - Items in orders
- `reviews` - Product and artisan reviews
- `auctions` - Auction listings
- `bids` - Auction bids

## Development Notes

- Client-side hydration issues fixed by initializing context with mock data
- Form-encoded POST data for PHP API compatibility
- Error handling for API responses returning HTML instead of JSON
- Minimal code approach - direct implementation without verbose abstractions

## Future Enhancements

- Payment gateway integration (Telebirr, CBE, Bank Transfer)
- Real-time notifications
- Advanced analytics dashboard
- Dispute resolution system
- Seller ratings and reputation system
- Inventory management

## License

MIT

## Contact

For questions or support, contact the development team.
