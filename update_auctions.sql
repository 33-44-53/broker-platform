USE artisan_broker_db;

ALTER TABLE auctions 
ADD COLUMN IF NOT EXISTS bid_count INT DEFAULT 0 AFTER current_bid;
