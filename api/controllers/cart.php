<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $buyer_id = $_GET['buyer_id'];
        $stmt = $db->prepare("
            SELECT c.*, p.name, p.price, p.discount, p.images, p.artisan_name, p.artisan_location 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.buyer_id = ?
        ");
        $stmt->execute([$buyer_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $stmt = $db->prepare("INSERT INTO cart (buyer_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?");
        
        if($stmt->execute([$data->buyer_id, $data->product_id, $data->quantity, $data->quantity])) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $stmt = $db->prepare("UPDATE cart SET quantity = ? WHERE buyer_id = ? AND product_id = ?");
        
        if($stmt->execute([$data->quantity, $data->buyer_id, $data->product_id])) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;
        
    case 'DELETE':
        if(isset($_GET['clear'])) {
            $stmt = $db->prepare("DELETE FROM cart WHERE buyer_id = ?");
            $stmt->execute([$_GET['buyer_id']]);
        } else {
            $stmt = $db->prepare("DELETE FROM cart WHERE buyer_id = ? AND product_id = ?");
            $stmt->execute([$_GET['buyer_id'], $_GET['product_id']]);
        }
        echo json_encode(["success" => true]);
        break;
}
?>
