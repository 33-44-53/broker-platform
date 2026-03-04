<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestProductsSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Handcrafted Wooden Chair',
                'description' => 'Beautiful handcrafted wooden chair made from mahogany. Perfect for dining rooms.',
                'price' => 150.00,
                'discount' => 10,
                'category' => 'Furniture',
                'images' => json_encode(['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400']),
                'artisan_id' => 1,
                'artisan_name' => 'John Artisan',
                'artisan_location' => 'Nairobi, Kenya',
                'stock' => 10,
                'rating' => 4.5,
                'reviews' => 20,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Carved Wooden Bowl',
                'description' => 'Intricately carved wooden bowl perfect for serving or decoration.',
                'price' => 45.00,
                'discount' => 0,
                'category' => 'Decor',
                'images' => json_encode(['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400']),
                'artisan_id' => 1,
                'artisan_name' => 'John Artisan',
                'artisan_location' => 'Nairobi, Kenya',
                'stock' => 25,
                'rating' => 4.8,
                'reviews' => 35,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Wooden Sculpture',
                'description' => 'Hand-carved wooden sculpture depicting African wildlife.',
                'price' => 200.00,
                'discount' => 15,
                'category' => 'Art',
                'images' => json_encode(['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400']),
                'artisan_id' => 1,
                'artisan_name' => 'John Artisan',
                'artisan_location' => 'Nairobi, Kenya',
                'stock' => 5,
                'rating' => 5.0,
                'reviews' => 12,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Handwoven Basket',
                'description' => 'Traditional handwoven basket using natural fibers.',
                'price' => 35.00,
                'discount' => 5,
                'category' => 'Crafts',
                'images' => json_encode(['https://images.unsplash.com/photo-1589820296156-2454bb8a6d54?w=400']),
                'artisan_id' => 1,
                'artisan_name' => 'John Artisan',
                'artisan_location' => 'Nairobi, Kenya',
                'stock' => 50,
                'rating' => 4.2,
                'reviews' => 45,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert($product);
        }
    }
}
