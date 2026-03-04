-- SQL to insert test users into the database
-- Run this with: php artisan db:seed --class=TestUsersSeeder
-- Or execute directly in MySQL

-- Artisan User
INSERT INTO users (name, email, password, role, is_verified, is_active, bio, location, skills, phone, created_at, updated_at)
VALUES (
    'John Artisan',
    'artisan@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'artisan',
    1,
    1,
    'Experienced craftsman specializing in wooden furniture and carvings',
    'Nairobi, Kenya',
    'Woodworking, Carving, Furniture Making, Sculpting',
    '+254712345678',
    NOW(),
    NOW()
);

-- Buyer User
INSERT INTO users (name, email, password, role, is_verified, is_active, bio, location, phone, created_at, updated_at)
VALUES (
    'Jane Buyer',
    'buyer@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'buyer',
    1,
    1,
    'Art enthusiast and collector',
    'Mombasa, Kenya',
    '+254798765432',
    NOW(),
    NOW()
);

-- Admin User
INSERT INTO users (name, email, password, role, is_verified, is_active, location, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'admin',
    1,
    1,
    'System Administrator',
    NOW(),
    NOW()
);
