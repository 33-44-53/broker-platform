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
        $buyer_id = $_GET['buyer_id'] ?? null;
        $artisan_id = $_GET['artisan_id'] ?? null;
        
        $sql = "SELECT o.*, 
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('product_id', oi.product_id, 'product_name', oi.product_name, 'quantity', oi.quantity, 'price', oi.price))
                FROM order_items oi WHERE oi.order_id = o.id) as products
                FROM orders o WHERE 1=1";
        $params = [];
        
        if($buyer_id) {
            $sql .= " AND buyer_id = ?";
            $params[] = $buyer_id;
        }
        if($artisan_id) {
            $sql .= " AND artisan_id = ?";
            $params[] = $artisan_id;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $db->beginTransaction();
        
        try {
            $order_number = 'ORD-' . time();
            
            $stmt = $db->prepare("INSERT INTO orders (order_number, buyer_id, buyer_name, artisan_id, total, payment_method, delivery_address) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $order_number,
                $data->buyer_id,
                $data->buyer_name,
                $data->artisan_id,
                $data->total,
                $data->payment_method,
                $data->delivery_address
            ]);
            
            $order_id = $db->lastInsertId();
            
            $stmt = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)");
            foreach($data->products as $product) {
                $stmt->execute([
                    $order_id,
                    $product->product_id,
                    $product->product_name,
                    $product->quantity,
                    $product->price
                ]);
            }
            
            $db->commit();
            echo json_encode(["success" => true, "order_number" => $order_number]);
        } catch(Exception $e) {
            $db->rollBack();
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $stmt = $db->prepare("UPDATE orders SET status = ?, payment_status = ? WHERE id = ?");
        
        if($stmt->execute([$data->status, $data->payment_status, $data->id])) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;
}
?>
