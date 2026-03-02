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
        $user_id = $_GET['user_id'];
        $stmt = $db->prepare("SELECT id, name, email, role, location, phone, national_id, national_id_photo, avatar FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $stmt = $db->prepare("UPDATE users SET name = ?, location = ?, phone = ?, national_id = ?, national_id_photo = ? WHERE id = ?");
        
        if($stmt->execute([
            $data->name,
            $data->location,
            $data->phone,
            $data->national_id,
            $data->national_id_photo,
            $data->user_id
        ])) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;
}
?>
