# Database Collaboration Guide

## Overview
This project uses Laravel migrations to manage database structure. Never manually create/modify tables in phpMyAdmin!

## Current Database Structure

### Tables
- `users` - User accounts (artisans, buyers, admins)
- `products` - Product listings
- `orders` - Customer orders
- `order_items` - Items in each order
- `cart` - Shopping cart items
- `wishlist` - User wishlists
- `auctions` - Auction listings
- `bids` - Auction bids
- `disputes` - Order disputes

## Migration Workflow

### 1. Creating New Table
```bash
# Create migration
php artisan make:migration create_reviews_table

# Edit the migration file
# database/migrations/2024_01_15_create_reviews_table.php
```

Example migration:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('rating')->min(1)->max(5);
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
```

### 2. Adding Column to Existing Table
```bash
# Create migration
php artisan make:migration add_status_to_orders_table

# Edit migration file
```

Example:
```php
public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->string('status')->default('pending')->after('total');
        $table->timestamp('shipped_at')->nullable()->after('status');
    });
}

public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropColumn(['status', 'shipped_at']);
    });
}
```

### 3. Test and Commit
```bash
# Test migration
php artisan migrate

# If it works, commit
git add database/migrations/
git commit -m "Add status and shipped_at columns to orders"
git push origin feature/order-status
```

## Team Member Setup

### First Time Setup
```bash
# After cloning repository
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env
# Then run migrations
php artisan migrate

# Optional: Add test data
php artisan db:seed
```

### Daily Workflow
```bash
# Before starting work
git pull origin main
php artisan migrate  # Run any new migrations

# After pulling changes with migrations
php artisan migrate
```

## Common Migration Commands

```bash
# Create migration
php artisan make:migration migration_name

# Run all pending migrations
php artisan migrate

# Rollback last batch of migrations
php artisan migrate:rollback

# Rollback specific number of batches
php artisan migrate:rollback --step=2

# Reset all migrations (WARNING: Deletes all data)
php artisan migrate:reset

# Refresh migrations (reset + migrate)
php artisan migrate:refresh

# Check migration status
php artisan migrate:status
```

## Seeder Usage

### Creating Seeders
```bash
# Create seeder
php artisan make:seeder ProductSeeder

# Edit seeder file
# database/seeders/ProductSeeder.php
```

Example seeder:
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Traditional Basket',
            'description' => 'Handwoven traditional basket',
            'price' => 150.00,
            'category' => 'Baskets',
            'artisan_id' => 1,
            'artisan_name' => 'Ahmed Hassan',
            'artisan_location' => 'Harar',
            'stock' => 10,
            'images' => json_encode(['basket1.jpg']),
        ]);
    }
}
```

### Running Seeders
```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=ProductSeeder
```

## Best Practices

### ✅ DO:
- Always use migrations for database changes
- Write descriptive migration names
- Test migrations before committing
- Include rollback logic in `down()` method
- Commit migration files to Git
- Run `php artisan migrate` after pulling changes

### ❌ DON'T:
- Manually create tables in phpMyAdmin
- Edit existing migration files after they're committed
- Commit `.env` files
- Commit actual database files
- Skip testing migrations locally

## Troubleshooting

### Migration Failed
```bash
# Check what went wrong
php artisan migrate:status

# Rollback and try again
php artisan migrate:rollback
# Fix the migration file
php artisan migrate
```

### Database Connection Issues
```bash
# Check .env file settings
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=broker_platform
DB_USERNAME=root
DB_PASSWORD=your_password

# Test connection
php artisan tinker
>>> DB::connection()->getPdo();
```

### Migration Conflicts
If two people create migrations at the same time:
1. Laravel handles this automatically
2. Both migrations will run in timestamp order
3. No manual intervention needed

## Emergency Procedures

### Reset Everything (WARNING: Deletes all data)
```bash
php artisan migrate:reset
php artisan migrate
php artisan db:seed
```

### Backup Database
```bash
# Export database
mysqldump -u root -p broker_platform > backup.sql

# Import database
mysql -u root -p broker_platform < backup.sql
```

## Schema Reference

### Users Table
- `id` - Primary key
- `name` - Full name
- `email` - Email address
- `role` - artisan/buyer/admin
- `phone` - Phone number
- `location` - User location
- `bio` - User biography
- `skill` - Artisan skills
- `national_id` - ID number
- `national_id_photo` - ID photo
- `is_verified` - Account verification status

### Products Table
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `discount` - Discount percentage
- `category` - Product category
- `images` - JSON array of images
- `artisan_id` - Foreign key to users
- `stock` - Available quantity
- `rating` - Average rating
- `is_active` - Product status

### Orders Table
- `id` - Primary key
- `buyer_id` - Foreign key to users
- `total` - Order total
- `status` - Order status
- `payment_status` - Payment status
- `shipping_address` - Delivery address

This structure ensures everyone on the team has the same database schema!