-- Run these one by one in phpMyAdmin SQL tab:

-- 1. Add description
ALTER TABLE auctions ADD COLUMN description TEXT AFTER min_increment;

-- 2. Add duration  
ALTER TABLE auctions ADD COLUMN duration INT NOT NULL DEFAULT 24 AFTER description;

-- 3. Add scheduled_date
ALTER TABLE auctions ADD COLUMN scheduled_date DATETIME AFTER duration;

-- 4. Add end_time
ALTER TABLE auctions ADD COLUMN end_time DATETIME AFTER scheduled_date;

-- 5. Add winner_id
ALTER TABLE auctions ADD COLUMN winner_id INT AFTER status;

-- 6. Add winner_name
ALTER TABLE auctions ADD COLUMN winner_name VARCHAR(255) AFTER winner_id;
