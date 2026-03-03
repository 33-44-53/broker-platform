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
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($data->action) && $data->action === 'register') {
            // Check if email exists
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$data->email]);
            if($stmt->fetch()) {
                echo json_encode(["success" => false, "error" => "Email already exists"]);
                exit();
            }
            
            // Prevent admin registration
            if($data->role === 'admin') {
                echo json_encode(["success" => false, "error" => "Cannot register as admin"]);
                exit();
            }
            
            $password = password_hash($data->password, PASSWORD_DEFAULT);
            $is_verified = $data->role === 'buyer' ? 1 : 0; // Buyers auto-verified, artisans need verification
            
            $stmt = $db->prepare("INSERT INTO users (name, email, password, role, is_verified, location, phone) VALUES (?, ?, ?, ?, ?, ?, ?)");
            
            if($stmt->execute([
                $data->name,
                $data->email,
                $password,
                $data->role,
                $is_verified,
                $data->location ?? '',
                $data->phone ?? ''
            ])) {
                $user_id = $db->lastInsertId();
                echo json_encode([
                    "success" => true,
                    "user" => [
                        "id" => $user_id,
                        "name" => $data->name,
                        "email" => $data->email,
                        "role" => $data->role,
                        "is_verified" => $is_verified
                    ]
                ]);
            } else {
                echo json_encode(["success" => false, "error" => "Registration failed"]);
            }
        }
        
        if(isset($data->action) && $data->action === 'login') {
            $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$data->email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($user && password_verify($data->password, $user['password'])) {
                // Check if artisan is verified
                if($user['role'] === 'artisan' && !$user['is_verified']) {
                    echo json_encode(["success" => false, "error" => "Your account is pending verification"]);
                    exit();
                }
                
                unset($user['password']);
                echo json_encode(["success" => true, "user" => $user]);
            } else {
                echo json_encode(["success" => false, "error" => "Invalid credentials"]);
            }
        }
        break;
        
    case 'GET':
        // Get pending artisans for admin
        if(isset($_GET['pending_artisans'])) {
            $stmt = $db->prepare("SELECT id, name, email, location, phone, national_id, national_id_photo, created_at FROM users WHERE role = 'artisan' AND is_verified = 0");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        // Get all artisans
        elseif(isset($_GET['all_artisans'])) {
            $stmt = $db->prepare("SELECT id, name, email, location, phone, is_verified, is_active, created_at FROM users WHERE role = 'artisan'");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        // Get all buyers
        elseif(isset($_GET['all_buyers'])) {
            $stmt = $db->prepare("SELECT id, name, email, phone, is_active, created_at FROM users WHERE role = 'buyer'");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        // Verify artisan
        if(isset($data->action) && $data->action === 'verify') {
            $stmt = $db->prepare("UPDATE users SET is_verified = 1 WHERE id = ? AND role = 'artisan'");
            if($stmt->execute([$data->user_id])) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        }
        
        // Reject artisan
        if(isset($data->action) && $data->action === 'reject') {
            $stmt = $db->prepare("DELETE FROM users WHERE id = ? AND role = 'artisan' AND is_verified = 0");
            if($stmt->execute([$data->user_id])) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        }
        
        // Toggle user status
        if(isset($data->action) && $data->action === 'toggle_status') {
            $stmt = $db->prepare("UPDATE users SET is_active = ? WHERE id = ?");
            if($stmt->execute([$data->is_active, $data->user_id])) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        }
        break;
}
?>
