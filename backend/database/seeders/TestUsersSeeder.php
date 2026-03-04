<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Artisan User
        DB::table('users')->insert([
            'name' => 'John Artisan',
            'email' => 'artisan@example.com',
            'password' => Hash::make('password'),
            'role' => 'artisan',
            'is_verified' => true,
            'is_active' => true,
            'bio' => 'Experienced craftsman specializing in wooden furniture and carvings',
            'location' => 'Nairobi, Kenya',
            'skills' => 'Woodworking, Carving, Furniture Making, Sculpting',
            'phone' => '+254712345678',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Buyer User
        DB::table('users')->insert([
            'name' => 'Jane Buyer',
            'email' => 'buyer@example.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
            'is_verified' => true,
            'is_active' => true,
            'bio' => 'Art enthusiast and collector',
            'location' => 'Mombasa, Kenya',
            'phone' => '+254798765432',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Admin User
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true,
            'is_active' => true,
            'location' => 'System Administrator',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
