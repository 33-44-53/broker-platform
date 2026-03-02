<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

// Delete existing admin
$stmt = $db->prepare("DELETE FROM users WHERE role = 'admin'");
$stmt->execute();

// Create new admin
$password = password_hash('admin1234', PASSWORD_DEFAULT);
$stmt = $db->prepare("INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)");
$stmt->execute(['Admin', 'admin@gmail.com', $password, 'admin', 1]);

echo "Admin created successfully!\n";
echo "Email: admin@gmail.com\n";
echo "Password: admin1234\n";
?>
