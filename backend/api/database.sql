CREATE DATABASE IF NOT EXISTS artisan_broker_db;
USE artisan_broker_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('artisan', 'buyer', 'admin') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(50),
    national_id VARCHAR(50),
    national_id_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount INT DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    images TEXT NOT NULL,
    artisan_id INT NOT NULL,
    artisan_name VARCHAR(255) NOT NULL,
    artisan_location VARCHAR(255) NOT NULL,
    stock INT NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 0,
    reviews INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id INT NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    artisan_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    payment_method ENUM('telebirr', 'cbe', 'bank', 'cash') NOT NULL,
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (buyer_id, product_id)
);

CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (buyer_id, product_id)
);

CREATE TABLE IF NOT EXISTS auctions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(255) NOT NULL,
    artisan_id INT NOT NULL,
    artisan_name VARCHAR(255) NOT NULL,
    starting_bid DECIMAL(10, 2) NOT NULL,
    current_bid DECIMAL(10, 2) NOT NULL,
    min_increment DECIMAL(10, 2) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    scheduled_date DATETIME,
    end_time DATETIME,
    status ENUM('pending', 'approved', 'live', 'ended') DEFAULT 'pending',
    winner_id INT,
    winner_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auction_id INT NOT NULL,
    bidder_id INT NOT NULL,
    bidder_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dispute_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id INT NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    artisan_id INT NOT NULL,
    artisan_name VARCHAR(255) NOT NULL,
    order_id INT NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in-progress', 'resolved') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Insert demo users
INSERT INTO users (name, email, password, role, is_verified, location, phone) VALUES
('Fatima Ahmed', 'artisan@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'artisan', TRUE, 'Jugol, Harar', '+251911234567'),
('John Doe', 'buyer@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer', TRUE, 'Addis Ababa', '+251922345678'),
('Admin User', 'admin@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE, 'Harar', '+251933456789');

-- Insert demo products
INSERT INTO products (name, description, price, discount, category, images, artisan_id, artisan_name, artisan_location, stock, rating, reviews, is_active) VALUES
('Traditional Harari Basket', 'Handwoven basket with traditional Harari patterns, perfect for storage or decoration.', 850.00, 10, 'Baskets', '["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500"]', 1, 'Fatima Ahmed', 'Jugol, Harar', 15, 4.8, 24, TRUE),
('Handcrafted Coffee Set', 'Traditional Ethiopian coffee ceremony set with jebena and cups.', 1200.00, 0, 'Pottery', '["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500"]', 1, 'Fatima Ahmed', 'Jugol, Harar', 8, 4.9, 31, TRUE),
('Woven Wall Hanging', 'Beautiful wall art featuring geometric Harari designs.', 650.00, 15, 'Textiles', '["https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=500"]', 1, 'Fatima Ahmed', 'Jugol, Harar', 20, 4.7, 18, TRUE);
