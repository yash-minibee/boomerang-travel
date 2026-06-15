# Boomerang Global Travel — API Reference

Base URL: `http://localhost:8000/api/v1`

All responses follow this envelope:
```json
{ "success": true, "data": {}, "message": "OK", "pagination": {} }
```

---

## Auth

### POST /auth/login
Public. Rate limited to 10 requests/60s per IP.

**Body:**
```json
{ "email": "admin@boomerang.com", "password": "admin123" }
```
**Response:**
```json
{ "success": true, "data": { "token": "eyJ...", "user": { "id": 1, "name": "Aryan Kapoor", "email": "admin@boomerang.com", "role": "super_admin" } } }
```

### POST /auth/logout
Protected.

**Headers:** `Authorization: Bearer <token>`

### GET /auth/me
Protected. Returns current admin user.

---

## Packages

### GET /packages
Public. Filters: `search`, `destination`, `status`, `category`, `featured`, `page`, `limit`, `sort`, `order`

**Response:**
```json
{ "success": true, "data": [...], "pagination": { "page": 1, "limit": 10, "total": 6, "total_pages": 1 } }
```

### GET /packages/:slug
Public. Returns full package with itinerary and hotels.

**Response:**
```json
{ "success": true, "data": { "id": 1, "title": "European Grand Tour", "itinerary": [...], "hotels": [...] } }
```

### POST /packages
Admin protected.

**Body:**
```json
{
  "title": "New Package",
  "starting_price": 1999,
  "category": "Cultural",
  "destination_region": "Europe",
  "duration": "10 Days / 9 Nights",
  "status": "draft",
  "tags": ["Popular"],
  "highlights": ["Eiffel Tower"],
  "inclusions": ["Breakfast"],
  "exclusions": ["Flights"]
}
```

### PUT /packages/:id
Admin protected. Same body as POST (partial update supported).

### DELETE /packages/:id
Admin protected. Soft delete — sets `deleted_at`.

### PATCH /packages/:id/featured
Admin protected. Toggles featured status.

---

## Itinerary

### GET /packages/:id/itinerary
Public.

### POST /packages/:id/itinerary
Admin protected. Bulk replaces all days.

**Body:**
```json
{
  "days": [
    { "day_number": 1, "title": "Arrival in Rome", "city": "Rome", "description": "...", "meals": ["Breakfast", "Dinner"], "transport": ["Flight"] },
    { "day_number": 2, "title": "Vatican Tour", "city": "Rome", "description": "...", "meals": ["Breakfast"], "transport": ["Bus"] }
  ]
}
```

### DELETE /itinerary/:id
Admin protected.

---

## Hotels

### GET /packages/:id/hotels
Public.

### POST /packages/:id/hotels
Admin protected. Bulk replaces all hotels.

**Body:**
```json
{
  "hotels": [
    { "name": "Hotel de Russie", "city": "Rome", "star_rating": 5, "image_url": "https://...", "amenities": ["Spa", "Pool"] }
  ]
}
```

### DELETE /hotels/:id
Admin protected.

---

## Destinations

### GET /destinations
Public. Filters: `search`, `region`, `featured`, `page`, `limit`

### GET /destinations/:id
Public.

### POST /destinations
Admin protected.

**Body:**
```json
{ "name": "Santorini", "country": "Greece", "region": "Europe", "description": "...", "featured": 1 }
```

### PUT /destinations/:id
Admin protected.

### DELETE /destinations/:id
Admin protected. Soft delete.

---

## Inquiries

### POST /inquiries
Public. Creates inquiry and auto-creates customer record.

**Body:**
```json
{
  "customer_name": "Priya Sharma",
  "customer_email": "priya@email.com",
  "customer_phone": "+91 98765 43210",
  "package_name": "Bali Bliss Retreat",
  "travel_date": "2025-09-15",
  "travellers": 2,
  "budget_range": "$1,000–$2,000",
  "message": "Looking for a honeymoon package.",
  "type": "package"
}
```

### GET /inquiries
Admin protected. Filters: `status`, `type`, `search`, `page`, `limit`

### GET /inquiries/:id
Admin protected.

### PATCH /inquiries/:id/status
Admin protected.

**Body:**
```json
{ "status": "Contacted" }
```
Valid values: `New`, `Contacted`, `Proposal Sent`, `Confirmed`, `Closed`

---

## Customers

### GET /customers
Admin protected. Filters: `search`, `page`, `limit`

### GET /customers/:id
Admin protected.

---

## Testimonials

### GET /testimonials
Public. Returns approved testimonials only.

### GET /testimonials/all
Admin protected. Returns all testimonials.

### POST /testimonials
Public.

**Body:**
```json
{
  "customer_name": "James Chen",
  "customer_location": "Singapore",
  "rating": 5,
  "package_name": "Japan Cherry Blossom Trail",
  "review_text": "Absolutely incredible experience!"
}
```

### PATCH /testimonials/:id/status
Admin protected.

**Body:**
```json
{ "status": "Approved" }
```
Valid values: `Pending`, `Approved`, `Rejected`

### DELETE /testimonials/:id
Admin protected.

---

## Media

### GET /media
Admin protected. Returns all uploaded files with URLs.

### POST /media/upload
Admin protected. `multipart/form-data`

**Fields:**
- `file` — image file (jpg/png/webp, max 5MB)
- `type` — folder: `packages`, `hotels`, `destinations`, or `media`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "abc123_1234567890.jpg",
    "file_path": "uploads/media/abc123_1234567890.jpg",
    "url": "http://localhost:8000/uploads/media/abc123_1234567890.jpg"
  }
}
```

### DELETE /media/:id
Admin protected. Deletes file from disk and database.

---

## CMS Content

### GET /content/:page
Public + Admin. Pages: `home`, `about`, `contact`

**Response:**
```json
{ "success": true, "data": { "hero_title": "The World Awaits", "hero_subtitle": "..." } }
```

### PUT /content/:page
Admin protected.

**Body:**
```json
{ "hero_title": "New Hero Title", "hero_subtitle": "Updated subtitle text" }
```

---

## Settings

### GET /settings
Admin protected.

**Response:**
```json
{ "success": true, "data": { "company_name": "Boomerang Global Travel", "phone": "+91 98765 43210" } }
```

### PUT /settings
Admin protected.

**Body:**
```json
{ "company_name": "Boomerang Travel", "whatsapp_number": "919876543210" }
```

---

## Dashboard

### GET /dashboard/stats
Admin protected.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_packages": 6,
    "active_packages": 6,
    "total_destinations": 8,
    "total_inquiries": 6,
    "new_inquiries": 2,
    "total_customers": 6,
    "total_testimonials": 4,
    "pending_testimonials": 2,
    "monthly_inquiries": [{ "month": "2025-06", "count": 6 }]
  }
}
```

### GET /dashboard/revenue
Admin protected. Last 6 months monthly data.

**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "2025-01", "inquiries": 48, "confirmed": 16, "revenue": 52784.00 }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning              |
|------|----------------------|
| 200  | OK                   |
| 201  | Created              |
| 400  | Bad Request          |
| 401  | Unauthorized         |
| 403  | Forbidden            |
| 404  | Not Found            |
| 422  | Unprocessable Entity |
| 429  | Too Many Requests    |
| 500  | Server Error         |
