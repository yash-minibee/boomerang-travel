# Boomerang Travel — API Reference

All endpoints live in the `/api/` folder. Call them directly by filename.

**Base URL (production)**
```
https://krishivlimo.com.au/boomerang-backend/api
```

**Base URL (local dev)**
```
http://localhost/boomerang-travel/backend/api
```

**Request format:** `Content-Type: application/json`  
**Auth header (protected routes):** `Authorization: Bearer <token>`

---

## Response envelope

Every response follows this shape:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "pagination": {}
}
```

On error:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

---

## Auth — `auth.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| POST | `?action=login` | — | Login and receive JWT token |
| POST | `?action=logout` | ✓ | Invalidate session |
| GET | `?action=me` | ✓ | Get current logged-in user |

**Login request body:**
```json
{ "email": "admin@example.com", "password": "secret" }
```

**Login response data:**
```json
{ "token": "eyJ...", "user": { "id": 1, "email": "...", "role": "admin" } }
```

---

## Packages — `packages.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | _(none)_ | — | List all packages (paginated) |
| GET | `?id=5` | — | Get package by ID (includes itinerary + hotels) |
| GET | `?slug=bali-escape` | — | Get package by slug (includes itinerary + hotels) |
| POST | _(none)_ | ✓ | Create package |
| PUT | `?id=5` | ✓ | Update package |
| DELETE | `?id=5` | ✓ | Soft-delete package |
| PATCH | `?id=5&action=featured` | ✓ | Toggle featured status |

**List query filters** (append to GET with no id/slug):
```
?search=bali&destination=1&status=active&category=beach&featured=1&sort=created_at&order=desc&page=1&limit=10
```

**Create / Update body fields:**
```json
{
  "title": "Bali Escape",
  "slug": "bali-escape",
  "description": "...",
  "starting_price": 1200,
  "duration_days": 7,
  "destination_id": 1,
  "category": "beach",
  "status": "active",
  "featured": 0,
  "cover_image": "uploads/packages/abc.jpg"
}
```

---

## Itinerary — `itinerary.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | `?package_id=5` | — | Get all itinerary days for a package |
| POST | `?package_id=5` | ✓ | Bulk replace itinerary days for a package |
| DELETE | `?id=3` | ✓ | Delete a single itinerary day |

**Bulk save body:**
```json
{
  "days": [
    { "day_number": 1, "title": "Arrival", "description": "..." },
    { "day_number": 2, "title": "City Tour", "description": "..." }
  ]
}
```

---

## Hotels — `hotels.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | `?package_id=5` | — | Get all hotels for a package |
| POST | `?package_id=5` | ✓ | Bulk replace hotels for a package |
| DELETE | `?id=3` | ✓ | Delete a single hotel |

**Bulk save body:**
```json
{
  "hotels": [
    { "name": "Alaya Resort", "stars": 5, "location": "Ubud", "image": "..." }
  ]
}
```

---

## Destinations — `destinations.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | _(none)_ | — | List all destinations (paginated) |
| GET | `?id=5` | — | Get destination by ID |
| POST | _(none)_ | ✓ | Create destination |
| PUT | `?id=5` | ✓ | Update destination |
| DELETE | `?id=5` | ✓ | Soft-delete destination |

**List query filters:**
```
?search=bali&region=asia&featured=1&page=1&limit=10
```

**Create / Update body fields:**
```json
{
  "name": "Bali",
  "region": "Asia",
  "description": "...",
  "image": "uploads/destinations/bali.jpg",
  "featured": 1
}
```

---

## Inquiries — `inquiries.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| POST | _(none)_ | — | Submit an inquiry (public) |
| GET | _(none)_ | ✓ | List all inquiries (paginated) |
| GET | `?id=5` | ✓ | Get inquiry by ID |
| PATCH | `?id=5&action=status` | ✓ | Update inquiry status |

**Submit body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+61400000000",
  "package_id": 5,
  "message": "I'd like more info...",
  "travel_date": "2026-09-01",
  "num_travelers": 2
}
```

**Update status body:**
```json
{ "status": "Contacted" }
```
Allowed values: `New` · `Contacted` · `Proposal Sent` · `Confirmed` · `Closed`

**List query filters:**
```
?status=New&type=package&search=john&page=1&limit=10
```

---

## Customers — `customers.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | _(none)_ | ✓ | List all customers (paginated) |
| GET | `?id=5` | ✓ | Get customer by ID |

**List query filters:**
```
?search=john&page=1&limit=10
```

> Customers are auto-created when an inquiry is submitted.

---

## Testimonials — `testimonials.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | _(none)_ | — | List approved testimonials (public) |
| GET | `?scope=all` | ✓ | List all testimonials (admin) |
| POST | _(none)_ | — | Submit a testimonial (public) |
| PATCH | `?id=5&action=status` | ✓ | Update testimonial status |
| DELETE | `?id=5` | ✓ | Delete testimonial |

**Submit body:**
```json
{
  "customer_name": "Jane Smith",
  "review_text": "Amazing trip, highly recommend!",
  "rating": 5,
  "package_id": 3
}
```

**Update status body:**
```json
{ "status": "Approved" }
```
Allowed values: `Pending` · `Approved` · `Rejected`

---

## Media — `media.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | _(none)_ | ✓ | List all uploaded media |
| POST | _(none)_ | ✓ | Upload an image file |
| DELETE | `?id=5` | ✓ | Delete media record + file |

**Upload:** `multipart/form-data`
```
file   → image file (jpg, png, webp — max 5MB)
type   → packages | hotels | destinations | media  (optional, defaults to "media")
```

**Upload response data:**
```json
{
  "id": 12,
  "filename": "abc123.jpg",
  "file_path": "uploads/packages/abc123.jpg",
  "url": "https://krishivlimo.com.au/boomerang-backend/uploads/packages/abc123.jpg",
  "mime_type": "image/jpeg",
  "file_size": 204800
}
```

---

## Content (CMS) — `content.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | `?page=home` | — | Get page content blocks |
| PUT | `?page=home` | ✓ | Update page content blocks |

Allowed page values: `home` · `about` · `contact`

**Update body** (key-value pairs of content blocks):
```json
{
  "hero_title": "Discover the World",
  "hero_subtitle": "Unforgettable journeys await",
  "about_text": "We are a boutique travel agency..."
}
```

---

## Settings — `settings.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | _(none)_ | ✓ | Get all site settings |
| PUT | _(none)_ | ✓ | Update site settings |

**Update body** (key-value pairs):
```json
{
  "site_name": "Boomerang Travel",
  "contact_email": "hello@example.com",
  "contact_phone": "+61400000000",
  "social_facebook": "https://facebook.com/...",
  "social_instagram": "https://instagram.com/..."
}
```

---

## Dashboard — `dashboard.php`

| Method | Query | Auth | Description |
|--------|-------|------|-------------|
| GET | _(none)_ | ✓ | Summary stats |
| GET | `?view=revenue` | ✓ | Monthly revenue + inquiry chart |

**Stats response data:**
```json
{
  "total_packages": 24,
  "active_packages": 18,
  "total_destinations": 12,
  "total_inquiries": 340,
  "new_inquiries": 15,
  "total_customers": 210,
  "total_testimonials": 48,
  "pending_testimonials": 3,
  "monthly_inquiries": [
    { "month": "2026-01", "count": 42 }
  ]
}
```

**Revenue response data:**
```json
[
  { "month": "2026-01", "inquiries": 42, "confirmed": 18, "revenue": 21600.00 }
]
```

---

## Error codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / missing body |
| 401 | Missing or invalid JWT token |
| 403 | Forbidden |
| 404 | Resource not found |
| 405 | Method not allowed for this endpoint |
| 422 | Validation failed (see `errors` object) |
| 429 | Too many requests (rate limit) |
| 500 | Server error |
