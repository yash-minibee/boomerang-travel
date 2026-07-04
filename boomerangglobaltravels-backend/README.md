# Boomerang Global Travel — Backend API

Pure PHP 8.3 REST API with SQLite, JWT auth, and MVC architecture.

## Requirements

- PHP 8.3+
- Apache with `mod_rewrite` enabled
- SQLite3 PHP extension (`php-sqlite3`)
- `php-pdo` and `php-pdo_sqlite` extensions

## Setup

1. Clone or copy the `backend/` folder to your server root.

2. Configure `.env`:
```
APP_ENV=development
APP_URL=http://localhost:8000
APP_DEBUG=true
DB_PATH=storage/database.sqlite
JWT_SECRET=your_random_secret_min_32_characters
JWT_EXPIRY=86400
UPLOAD_PATH=uploads
UPLOAD_MAX_SIZE=5242880
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60
```

3. Run the migration to create tables and seed data:
```bash
php migrate.php
```

4. Start the local development server:
```bash
php -S localhost:8000
```

5. The API is now available at:
```
http://localhost:8000/api/v1/
```

## Default Admin Credentials

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@boomerang.com      |
| Password | admin123                 |
| Role     | super_admin              |

## Apache Deployment

Ensure `mod_rewrite` is enabled and `AllowOverride All` is set for the document root. The included `.htaccess` handles URL rewriting.

## Folder Structure

```
backend/
├── config/          Env, Database, JWT
├── controllers/     Request handlers
├── middleware/      Auth, CORS, Rate Limiting, Validation
├── models/          Database access layer
├── routes/          Route definitions
├── helpers/         Response, Paginator, Sanitizer, SlugHelper
├── migrations/      schema.sql
├── uploads/         Uploaded files
├── storage/         SQLite database file
├── .env             Environment config
├── .htaccess        Apache URL rewrite rules
├── index.php        Entry point / router
└── migrate.php      DB migration + seeding
```

## CORS

Allowed origins: `http://localhost:5173` and `http://localhost:5174`

## Authentication

All admin endpoints require:
```
Authorization: Bearer <token>
```

Obtain a token via `POST /api/v1/auth/login`.
