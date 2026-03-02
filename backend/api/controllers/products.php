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

if ($db === null) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $artisan_id = $_GET['artisan_id'] ?? null;
            $category = $_GET['category'] ?? null;
            
            $sql = "SELECT * FROM products WHERE 1=1";
            $params = [];
            
            if($artisan_id) {
                $sql .= " AND artisan_id = ?";
                $params[] = $artisan_id;
            }
            if($category && $category !== 'all') {
                $sql .= " AND category = ?";
                $params[] = $category;
            }
            
            $sql .= " ORDER BY created_at DESC";
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        // Validate required fields
        $required = ['name', 'description', 'price', 'category', 'images', 'artisan_id', 'artisan_name', 'artisan_location', 'stock'];
        $missing = [];
        foreach ($required as $field) {
            if (!isset($data->$field) || empty($data->$field)) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            echo json_encode(["success" => false, "error" => "Missing required fields: " . implode(', ', $missing)]);
            break;
        }
        
        $stmt = $db->prepare("INSERT INTO products (name, description, price, discount, category, images, artisan_id, artisan_name, artisan_location, stock, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $images = json_encode($data->images);
        
        try {
            if($stmt->execute([
                $data->name,
                $data->description,
                $data->price,
                $data->discount ?? 0,
                $data->category,
                $images,
                $data->artisan_id,
                $data->artisan_name,
                $data->artisan_location,
                $data->stock,
                $data->is_active ?? true
            ])) {
                echo json_encode(["success" => true, "id" => $db->lastInsertId()]);
            } else {
                echo json_encode(["success" => false, "error" => "Failed to create product"]);
            }
        } catch(PDOException $e) {
            $errorMsg = $e->getMessage();
            if (strpos($errorMsg, 'foreign key constraint fails') !== false) {
                echo json_encode(["success" => false, "error" => "Invalid artisan_id. The artisan must exist in the users table."]);
            } else {
                echo json_encode(["success" => false, "error" => $errorMsg]);
            }
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $sql = "UPDATE products SET ";
        $params = [];
        $updates = [];
        
        if(isset($data->name)) {
            $updates[] = "name = ?";
            $params[] = $data->name;
        }
        if(isset($data->description)) {
            $updates[] = "description = ?";
            $params[] = $data->description;
        }
        if(isset($data->price)) {
            $updates[] = "price = ?";
            $params[] = $data->price;
        }
        if(isset($data->discount)) {
            $updates[] = "discount = ?";
            $params[] = $data->discount;
        }
        if(isset($data->category)) {
            $updates[] = "category = ?";
            $params[] = $data->category;
        }
        if(isset($data->stock)) {
            $updates[] = "stock = ?";
            $params[] = $data->stock;
        }
        if(isset($data->is_active)) {
            $updates[] = "is_active = ?";
            $params[] = $data->is_active;
        }
        
        $sql .= implode(", ", $updates) . " WHERE id = ?";
        $params[] = $data->id;
        
        $stmt = $db->prepare($sql);
        if($stmt->execute($params)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;
        
    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;
}
?>
