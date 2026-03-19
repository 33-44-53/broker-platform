# Order Flow Testing Guide

## Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- MySQL database `artisan_broker_db` with migrations applied
- User logged in (buyer account)

## Step-by-Step Testing

### 1. Add Products to Cart
```
1. Navigate to http://localhost:3000/marketplace
2. Click "Add to Cart" on any product
3. Repeat for 2-3 products from different artisans
4. Verify cart count increases in sidebar
```

### 2. Place Order
```
1. Navigate to http://localhost:3000/cart
2. Review items in cart
3. Click "Review Order"
4. Click "Continue to Checkout"
5. Fill in shipping information:
   - Full Name: Test Buyer
   - Phone: +251912345678
   - Address: 123 Main Street
   - City: Addis Ababa
6. Select payment method (e.g., Telebirr)
7. Click "Place Order"
8. Verify confirmation page shows order ID
```

### 3. Verify Order in Buyer Dashboard
```
1. Navigate to http://localhost:3000/buyer
2. Click "My Orders" tab
3. Verify order appears with:
   - Order ID
   - Date
   - Total amount
   - Status: "pending"
4. Click "Track Orders" tab
5. Verify order shows progress bar
```

### 4. Verify Order in Artisan Dashboard
```
1. Log out and log in as artisan
2. Navigate to http://localhost:3000/artisan
3. Click "Orders" tab
4. Verify orders appear with:
   - Buyer name
   - Order items
   - Total amount
   - Status
5. Can update status if needed
```

### 5. Database Verification
```
MySQL Commands:
SELECT * FROM orders;
SELECT * FROM order_items;

Expected Results:
- Orders table has new order with order_number, buyer_id, total, status='pending'
- Order_items table has entries for each product in order
```

## API Testing with cURL

### Create Order
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_id": 1,
    "buyer_name": "Test Buyer",
    "total": 1500,
    "status": "pending",
    "payment_method": "telebirr",
    "delivery_address": "123 Main St",
    "order_items": [
      {
        "product_id": 1,
        "product_name": "Basket",
        "quantity": 2,
        "price": 750
      }
    ]
  }'
```

### Get Buyer Orders
```bash
curl http://localhost:8000/api/orders?buyer_id=1
```

### Get Artisan Orders
```bash
curl http://localhost:8000/api/orders?artisan_id=1
```

### Update Order Status
```bash
curl -X PUT http://localhost:8000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing",
    "payment_status": "paid"
  }'
```

## Expected Behavior

### Order Creation
- ✅ Order saved to database with unique order_number
- ✅ Order items saved to order_items table
- ✅ Response includes order_number
- ✅ Cart cleared after successful order
- ✅ Confirmation page displays order ID

### Order Retrieval
- ✅ Buyer sees only their orders
- ✅ Artisan sees only orders with their products
- ✅ Orders display with all items
- ✅ Status updates reflect in real-time

### Data Persistence
- ✅ Orders persist after page refresh
- ✅ Orders visible across different sessions
- ✅ Order history maintained in database

## Troubleshooting

### Order Not Appearing in Dashboard
1. Check browser console for errors
2. Verify user is logged in with correct ID
3. Check database: `SELECT * FROM orders WHERE buyer_id = {id};`
4. Verify API endpoint is returning data

### Order Not Saving to Database
1. Check Laravel logs: `backend/storage/logs/laravel.log`
2. Verify database connection in `.env`
3. Run migrations: `php artisan migrate`
4. Check order_items table exists

### API Returning Error
1. Verify all required fields are sent
2. Check payment_method is a string
3. Verify order_items array format
4. Check buyer_id exists in users table

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 Not Found | Verify backend is running on port 8000 |
| CORS Error | Check backend CORS configuration |
| Order not saved | Verify database migrations ran successfully |
| Artisan not seeing orders | Verify product artisan_id matches logged-in user |
| Cart not clearing | Check clearCart() is called after success |

## Performance Notes

- Order creation: ~100-200ms
- Order retrieval: ~50-100ms
- Database queries optimized with eager loading (with('items'))
- No N+1 query problems

## Next Steps

After successful testing:
1. ✅ Implement email notifications
2. ✅ Add order cancellation logic
3. ✅ Implement payment gateway integration
4. ✅ Add order analytics
5. ✅ Implement dispute resolution
