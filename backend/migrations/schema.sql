-- Boomerang Global Travel — SQLite Schema
-- Run via migrate.php

CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'editor',
    avatar_url    TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login    DATETIME
);

CREATE TABLE IF NOT EXISTS packages (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    title                TEXT NOT NULL,
    slug                 TEXT NOT NULL UNIQUE,
    category             TEXT,
    destination_region   TEXT,
    duration             TEXT,
    starting_price       REAL DEFAULT 0,
    status               TEXT NOT NULL DEFAULT 'draft',
    featured             INTEGER NOT NULL DEFAULT 0,
    rating               REAL DEFAULT 0,
    review_count         INTEGER DEFAULT 0,
    cover_image          TEXT,
    gallery              TEXT DEFAULT '[]',
    highlights           TEXT DEFAULT '[]',
    tags                 TEXT DEFAULT '[]',
    inclusions           TEXT DEFAULT '[]',
    exclusions           TEXT DEFAULT '[]',
    policy_cancellation  TEXT,
    policy_refund        TEXT,
    policy_payment       TEXT,
    meta_title           TEXT,
    meta_description     TEXT,
    meta_keywords        TEXT,
    created_by           INTEGER REFERENCES admin_users(id),
    updated_by           INTEGER REFERENCES admin_users(id),
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at           DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS itinerary_days (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id  INTEGER NOT NULL REFERENCES packages(id),
    day_number  INTEGER NOT NULL,
    title       TEXT,
    city        TEXT,
    description TEXT,
    hotel       TEXT,
    meals       TEXT DEFAULT '[]',
    transport   TEXT DEFAULT '[]',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS package_hotels (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id  INTEGER NOT NULL REFERENCES packages(id),
    name        TEXT NOT NULL,
    city        TEXT,
    star_rating INTEGER DEFAULT 5,
    image_url   TEXT,
    amenities   TEXT DEFAULT '[]',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destinations (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    country       TEXT,
    region        TEXT,
    hero_image    TEXT,
    description   TEXT,
    highlights    TEXT DEFAULT '[]',
    gallery       TEXT DEFAULT '[]',
    featured      INTEGER DEFAULT 0,
    package_count INTEGER DEFAULT 0,
    created_by    INTEGER REFERENCES admin_users(id),
    updated_by    INTEGER REFERENCES admin_users(id),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at    DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name  TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    package_id     INTEGER DEFAULT NULL,
    package_name   TEXT,
    travel_date    DATE,
    travellers     INTEGER,
    budget_range   TEXT,
    message        TEXT,
    status         TEXT NOT NULL DEFAULT 'New',
    type           TEXT NOT NULL DEFAULT 'package',
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT,
    email         TEXT NOT NULL UNIQUE,
    phone         TEXT,
    avatar_url    TEXT,
    status        TEXT NOT NULL DEFAULT 'Active',
    total_spent   REAL DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name     TEXT NOT NULL,
    customer_location TEXT,
    avatar_url        TEXT,
    rating            INTEGER DEFAULT 5,
    package_name      TEXT,
    review_text       TEXT NOT NULL,
    status            TEXT NOT NULL DEFAULT 'Pending',
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    filename      TEXT NOT NULL,
    original_name TEXT,
    file_path     TEXT NOT NULL,
    file_size     INTEGER,
    mime_type     TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    page       TEXT NOT NULL,
    key        TEXT NOT NULL,
    value      TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, key)
);

CREATE TABLE IF NOT EXISTS settings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    key        TEXT NOT NULL UNIQUE,
    value      TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_packages_slug        ON packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_status      ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_featured    ON packages(featured);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_status     ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created    ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_email      ON customers(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_email    ON admin_users(email);
