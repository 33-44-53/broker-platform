# Order Flow Implementation - Complete Guide

## Overview
The order placement system has been fully implemented with database persistence, real-time updates across buyer and artisan dashboards, and GitHub integration.

## Architecture

### Frontend Flow
1. **Cart Page** (`frontend/src/app/cart/page.tsx`)
   - Multi-step checkout: Cart → Review → Checkout → Confirmation
   - Collects shipping info and payment method
   - Sends JSON payload to backend API

2. **Buyer Dashboard** (`frontend/src/app/buyer/page.tsx`)
   - **My Orders Tab**: Displays all buyer orders from database
   - **Track Orders Tab**: Shows order status with progress bar
   - **Cart Tab**: Integrated shopping cart with checkout

3. **Artisan Dashboard** (`frontend/src/app/artisan/page.tsx`)
   - **Orders Tab**: Shows orders containing their products
   - Real-time order updates from database

### Backend API Endpoints

#### Order Management
- `POST /api/orders` - Create new order
  - Accepts: `buyer_id`, `buyer_name`, `total`, `status`, `payment_method`, `delivery_address`, `order_items[]`
  - Returns: Order with auto-generated `order_number`
  
- `GET /api/orders?buyer_id={id}` - Get buyer's orders
  - Returns: Array of orders with items
  
- `GET /api/orders?artisan_id={id}` - Get artisan's orders
  - Returns: Orders containing products from that artisan

- `PUT /api/orders/{id}` - Update order status
  - Accepts: `status`, `payment_status`

### Database Schema

#### Orders Table
```sql
- id (primary key)
- order_number (unique, auto-generated: ORD-{timestamp}-{random})
- buyer_id (foreign key → users)
- buyer_name
- total (decimal)
- status (pending, processing, shipped, delivered, cancelled)
- payment_status (pending, paid, failed)
- payment_method (string)
- delivery_address (text)
- created_at, updated_at
```

#### Order Items Table
```sql
- id (primary key)
- order_id (foreign key → orders)
- product_id (foreign key → products)
- product_name
- quantity
- price (decimal)
```

## Data Flow

### 1. Order Placement
```
Buyer fills cart → Reviews order → Enters shipping info → Selects payment → Places order
                                                                              ↓
                                                    POST /api/orders (JSON payload)
                                                                              ↓
                                                    Backend creates Order + OrderItems
                                                                              ↓
                                                    Returns order_number
                                                                              ↓
                                                    Frontend shows confirmation
                                                                              ↓
                                                    Cart cleared, redirects to buyer dashboard
```

### 2. Order Retrieval

**For Buyers:**
```
Buyer Dashboard → My Orders Tab
                        ↓
        GET /api/orders?buyer_id={id}
                        ↓
        Display all orders with status
```

**For Artisans:**
```
Artisan Dashboard → Orders Tab
                        ↓
        GET /api/orders?artisan_id={id}
                        ↓
        Backend queries orders where products belong to artisan
                        ↓
        Display orders with buyer details
```

## Key Implementation Details

### Order Number Generation
- Format: `ORD-{timestamp}-{random}`
- Example: `ORD-1709556789-4521`
- Ensures uniqueness and readability

### Order Items Structure
```json
{
  "order_items": [
    {
      "product_id": 1,
      "product_name": "Basket",
      "quantity": 2,
      "price": 500
    }
  ]
}
```

### API Request Example
```javascript
const orderData = {
  buyer_id: 1,
  buyer_name: "John Doe",
  total: 1500,
  status: "pending",
  payment_method: "telebirr",
  delivery_address: "123 Main St, Addis Ababa",
  order_items: [
    {
      product_id: 5,
      product_name: "Traditional Basket",
      quantity: 2,
      price: 750
    }
  ]
};

fetch('http://localhost:8000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

## Files Modified

### Backend
1. `backend/app/Http/Controllers/Api/OrderController.php`
   - Updated `store()` to generate order_number and create order_items
   - Updated `index()` to fetch orders with items and filter by artisan

2. `backend/app/Models/Order.php`
   - Added `items()` relationship
   - Removed `artisan_id` from fillable (orders can have multiple artisans)

3. `backend/database/migrations/2026_03_04_094940_create_orders_table.php`
   - Removed `artisan_id` foreign key
   - Changed `payment_method` to string

### Frontend
1. `frontend/src/app/cart/page.tsx`
   - Updated to use `/api/orders` endpoint
   - Changed to JSON payload format
   - Includes `order_items` array

2. `frontend/src/app/buyer/page.tsx`
   - Updated all endpoints to use `/api/` routes
   - Fetches orders from database
   - Displays in My Orders and Track Orders tabs

3. `frontend/src/app/artisan/page.tsx`
   - Updated to fetch orders from `/api/orders?artisan_id={id}`
   - Displays orders with buyer details

## Testing the Flow

### 1. Place an Order
1. Go to `/marketplace`
2. Add products to cart
3. Go to `/cart`
4. Complete checkout with shipping info and payment method
5. Confirm order placement

### 2. View as Buyer
1. Go to `/buyer`
2. Click "My Orders" tab → See placed order
3. Click "Track Orders" tab → See order status

### 3. View as Artisan
1. Go to `/artisan`
2. Click "Orders" tab → See orders containing your products
3. Update order status if needed

## GitHub Integration

All changes have been committed and pushed to GitHub:
```
Commit: "Fix order placement: update API endpoints to Laravel, implement order_items structure, and enable database persistence"
Branch: main
```

## Status Workflow

Orders progress through these statuses:
1. **pending** - Order placed, awaiting processing
2. **processing** - Artisan preparing order
3. **shipped** - Order in transit
4. **delivered** - Order received by buyer
5. **cancelled** - Order cancelled

## Future Enhancements

- [ ] Email notifications on order status changes
- [ ] SMS notifications for delivery
- [ ] Order cancellation with refund logic
- [ ] Dispute resolution system
- [ ] Order history export (PDF/CSV)
- [ ] Bulk order management for artisans
- [ ] Order analytics dashboard
