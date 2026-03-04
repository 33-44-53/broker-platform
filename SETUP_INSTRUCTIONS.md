# Laravel Backend with MySQL - Setup Instructions

## Prerequisites
- XAMPP installed with MySQL
- Node.js installed
- Composer installed

## Quick Start

### Step 1: Start MySQL
Open Command Prompt and run:
```bash
cd C:\xampp\mysql\bin
mysqld.exe
```

Or double-click: `START_MYSQL.bat`

### Step 2: Run Laravel Migrations
Open another Command Prompt and run:
```bash
cd c:\Users\Oumer\Desktop\fyp\backend
php artisan migrate:refresh --force
```

Or double-click: `RUN_LARAVEL.bat`

This will:
- Create all database tables in `artisan_broker_db`
- Start Laravel server on `http://localhost:8000`

### Step 3: Start Frontend
Open another Command Prompt and run:
```bash
cd c:\Users\Oumer\Desktop\fyp\frontend
npm run dev
```

Or double-click: `RUN_FRONTEND.bat`

Frontend runs on `http://localhost:3000`

## Database
- Database: `artisan_broker_db`
- Host: `127.0.0.1`
- Port: `3306`
- Username: `root`
- Password: (empty)

## API Endpoints
- Base URL: `http://localhost:8000/api`
- All endpoints configured and ready

## All Features Working
✅ User authentication
✅ Product management
✅ Order management
✅ Profile management
✅ Auction system
✅ Analytics
✅ Admin controls

## Troubleshooting

If MySQL connection fails:
1. Make sure XAMPP MySQL is running
2. Check database credentials in `.env`
3. Ensure `artisan_broker_db` database exists

If migrations fail:
1. Drop and recreate the database
2. Run: `php artisan migrate:refresh --force`

## Files Created
- `START_MYSQL.bat` - Start MySQL
- `RUN_LARAVEL.bat` - Run Laravel migrations and server
- `RUN_FRONTEND.bat` - Run frontend
