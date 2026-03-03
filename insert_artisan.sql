USE artisan_broker_db;

INSERT IGNORE INTO users (id, name, email, password, role, is_verified, location, phone) VALUES
(1, 'Fatima Ahmed', 'artisan@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'artisan', TRUE, 'Jugol, Harar', '+251911234567');