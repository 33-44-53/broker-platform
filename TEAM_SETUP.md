# Harar Artisan Marketplace - Team Setup Guide

## Prerequisites
- PHP 8.1+
- Composer
- MySQL 8.0+
- Node.js 18+
- XAMPP (recommended)

## Backend Setup

### 1. Clone Repository
```bash
git clone https://github.com/33-44-53/broker-platform.git
cd broker-platform/backend
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Database Configuration
Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=broker_platform
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### 5. Create Database
In phpMyAdmin or MySQL command line:
```sql
CREATE DATABASE broker_platform;
```

### 6. Run Migrations
```bash
php artisan migrate
```

### 7. Seed Test Data (Optional)
```bash
php artisan db:seed
```

### 8. Start Backend Server
```bash
php artisan serve
```
Backend runs on: `http://localhost:8000`

## Frontend Setup

### 1. Navigate to Frontend
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Frontend runs on: `http://localhost:3000`

## Database Collaboration Rules

### ✅ DO:
- Use migrations for all database changes
- Commit migration files to Git
- Run `php artisan migrate` after pulling changes
- Create descriptive migration names

### ❌ DON'T:
- Manually create tables in phpMyAdmin
- Commit `.env` files
- Commit database files
- Make direct database changes without migrations

## Common Commands

```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Create seeder
php artisan make:seeder TableSeeder

# Run seeders
php artisan db:seed
```

## Team Workflow

1. **Pull latest changes**: `git pull origin main`
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes and test locally**
4. **Run migrations if database changed**: `php artisan migrate`
5. **Commit and push**: `git push origin feature/your-feature`
6. **Create Pull Request on GitHub**
7. **Team reviews and merges**

## Project Structure

```
broker-platform/
├── backend/           # Laravel API
│   ├── app/
│   ├── database/
│   │   ├── migrations/    # Database structure (COMMIT THESE)
│   │   └── seeders/       # Test data (COMMIT THESE)
│   └── .env              # Local config (DON'T COMMIT)
├── frontend/         # Next.js app
│   ├── src/
│   └── package.json
└── README.md
```

## Troubleshooting

### Migration Issues
```bash
# Reset all migrations (WARNING: Deletes all data)
php artisan migrate:reset
php artisan migrate
```

### Permission Issues (Linux/Mac)
```bash
chmod -R 775 storage bootstrap/cache
```

### Common Errors
- **"Access denied for user"**: Check database credentials in `.env`
- **"Database doesn't exist"**: Create database first
- **"Migration not found"**: Run `composer dump-autoload`

## Contact
For setup issues, contact the team lead or create an issue on GitHub.