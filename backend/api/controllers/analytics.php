<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = $_GET['user_id'] ?? null;
$role = $_GET['role'] ?? null;

if (!$user_id || !$role) {
    echo json_encode(["error" => "user_id and role are required"]);
    exit();
}

$analytics = [];

if ($role === 'artisan') {
    // Total products
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM products WHERE artisan_id = ?");
    $stmt->execute([$user_id]);
    $analytics['totalProducts'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Active products
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM products WHERE artisan_id = ? AND is_active = 1");
    $stmt->execute([$user_id]);
    $analytics['activeProducts'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Total orders
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM orders WHERE artisan_id = ?");
    $stmt->execute([$user_id]);
    $analytics['totalOrders'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Total revenue
    $stmt = $db->prepare("SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE artisan_id = ?");
    $stmt->execute([$user_id]);
    $analytics['totalRevenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'];
    
    // Category distribution
    $stmt = $db->prepare("SELECT category, COUNT(*) as count FROM products WHERE artisan_id = ? GROUP BY category");
    $stmt->execute([$user_id]);
    $analytics['categoryDistribution'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Monthly sales (last 6 months)
    $stmt = $db->prepare("
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COALESCE(SUM(total), 0) as sales 
        FROM orders 
        WHERE artisan_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
    ");
    $stmt->execute([$user_id]);
    $analytics['monthlySales'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} else if ($role === 'buyer') {
    // Total orders
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM orders WHERE buyer_id = ?");
    $stmt->execute([$user_id]);
    $analytics['totalOrders'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Total spent
    $stmt = $db->prepare("SELECT COALESCE(SUM(total), 0) as spent FROM orders WHERE buyer_id = ?");
    $stmt->execute([$user_id]);
    $analytics['totalSpent'] = $stmt->fetch(PDO::FETCH_ASSOC)['spent'];
    
    // Pending deliveries
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM orders WHERE buyer_id = ? AND status = 'shipped'");
    $stmt->execute([$user_id]);
    $analytics['pendingDeliveries'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Category spending
    $stmt = $db->prepare("
        SELECT p.category, COALESCE(SUM(o.total), 0) as spent 
        FROM orders o
        JOIN products p ON JSON_CONTAINS(o.products, JSON_OBJECT('id', p.id))
        WHERE o.buyer_id = ?
        GROUP BY p.category
    ");
    $stmt->execute([$user_id]);
    $analytics['categorySpending'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Monthly spending (last 6 months)
    $stmt = $db->prepare("
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COALESCE(SUM(total), 0) as spent 
        FROM orders 
        WHERE buyer_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
    ");
    $stmt->execute([$user_id]);
    $analytics['monthlySpending'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode($analytics);
?>
