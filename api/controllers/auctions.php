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
        if(isset($_GET['pending'])) {
            // Get pending auctions for admin
            $stmt = $db->prepare("SELECT a.*, p.images FROM auctions a JOIN products p ON a.product_id = p.id WHERE a.status = 'pending' ORDER BY a.created_at DESC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif(isset($_GET['approved'])) {
            // Get approved/live auctions for buyers
            $stmt = $db->prepare("SELECT a.*, p.images FROM auctions a JOIN products p ON a.product_id = p.id WHERE a.status IN ('approved', 'live') ORDER BY a.scheduled_date ASC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif(isset($_GET['artisan_id'])) {
            // Get artisan's auctions
            $stmt = $db->prepare("SELECT * FROM auctions WHERE artisan_id = ? ORDER BY created_at DESC");
            $stmt->execute([$_GET['artisan_id']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif(isset($_GET['id'])) {
            // Get single auction with bids
            $stmt = $db->prepare("SELECT a.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', b.id, 'bidder_name', b.bidder_name, 'amount', b.amount, 'created_at', b.created_at)) FROM bids b WHERE b.auction_id = a.id ORDER BY b.amount DESC) as bids FROM auctions a WHERE a.id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($data->action) && $data->action === 'request') {
            // Artisan requests auction
            $stmt = $db->prepare("INSERT INTO auctions (product_id, product_name, product_image, artisan_id, artisan_name, starting_bid, current_bid, min_increment, description, duration, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
            
            if($stmt->execute([
                $data->product_id,
                $data->product_name,
                $data->product_image,
                $data->artisan_id,
                $data->artisan_name,
                $data->starting_bid,
                $data->starting_bid,
                $data->min_increment,
                $data->description,
                $data->duration
            ])) {
                echo json_encode(["success" => true, "id" => $db->lastInsertId()]);
            } else {
                echo json_encode(["success" => false]);
            }
        } elseif(isset($data->action) && $data->action === 'bid') {
            // Place bid
            $db->beginTransaction();
            try {
                // Check current bid
                $stmt = $db->prepare("SELECT current_bid, min_increment FROM auctions WHERE id = ? AND status = 'live'");
                $stmt->execute([$data->auction_id]);
                $auction = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if(!$auction || $data->amount < ($auction['current_bid'] + $auction['min_increment'])) {
                    throw new Exception("Bid too low");
                }
                
                // Update auction
                $stmt = $db->prepare("UPDATE auctions SET current_bid = ? WHERE id = ?");
                $stmt->execute([$data->amount, $data->auction_id]);
                
                // Insert bid
                $stmt = $db->prepare("INSERT INTO bids (auction_id, bidder_id, bidder_name, amount) VALUES (?, ?, ?, ?)");
                $stmt->execute([$data->auction_id, $data->bidder_id, $data->bidder_name, $data->amount]);
                
                $db->commit();
                echo json_encode(["success" => true]);
            } catch(Exception $e) {
                $db->rollBack();
                echo json_encode(["success" => false, "error" => $e->getMessage()]);
            }
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($data->action) && $data->action === 'approve') {
            // Admin approves and schedules auction
            $stmt = $db->prepare("UPDATE auctions SET status = 'approved', scheduled_date = ? WHERE id = ?");
            if($stmt->execute([$data->scheduled_date, $data->auction_id])) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        } elseif(isset($data->action) && $data->action === 'reject') {
            $stmt = $db->prepare("DELETE FROM auctions WHERE id = ? AND status = 'pending'");
            if($stmt->execute([$data->auction_id])) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        } elseif(isset($data->action) && $data->action === 'start') {
            // Admin starts auction
            $end_time = date('Y-m-d H:i:s', strtotime("+{$data->duration} hours"));
            $stmt = $db->prepare("UPDATE auctions SET status = 'live', end_time = ? WHERE id = ?");
            if($stmt->execute([$end_time, $data->auction_id])) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        } elseif(isset($data->action) && $data->action === 'end') {
            // End auction and declare winner
            $stmt = $db->prepare("SELECT bidder_id, bidder_name FROM bids WHERE auction_id = ? ORDER BY amount DESC LIMIT 1");
            $stmt->execute([$data->auction_id]);
            $winner = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($winner) {
                $stmt = $db->prepare("UPDATE auctions SET status = 'ended', winner_id = ?, winner_name = ? WHERE id = ?");
                $stmt->execute([$winner['bidder_id'], $winner['bidder_name'], $data->auction_id]);
            } else {
                $stmt = $db->prepare("UPDATE auctions SET status = 'ended' WHERE id = ?");
                $stmt->execute([$data->auction_id]);
            }
            echo json_encode(["success" => true, "winner" => $winner]);
        }
        break;
}
?>
