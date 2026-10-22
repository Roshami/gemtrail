# GemTrail Backend (Node.js + Express + MySQL)

REST API for **GemTrail: A Web-Based One-Day Itinerary Planner for Ratnapura**. It uses the existing `gemtrail.sql` schema and keeps the React/Tailwind frontend separate.

## Features
- Public tourist-place listing, search, category/district/rating filters, radius filtering from latitude/longitude, top-rated places and place details.
- Category listing and admin category management.
- Visitor registration/login with bcrypt password hashes and JWT authentication.
- Admin-only tourist-place create/update/deactivate endpoints.
- Authenticated favorites and place reviews (one review per user/place; posting again updates it).
- Authenticated itinerary CRUD and adding, editing, and removing itinerary stops.
- Health check, request rate limiting, Helmet security headers, parameterized SQL queries, JSON error responses.


## Project structure (Routes and Controllers separated)

```text
src/
├── controllers/       # Request handling and business/database logic
│   ├── auth.js
│   ├── categories.js
│   ├── favorites.js
│   ├── itineraries.js
│   ├── places.js
│   └── reviews.js
├── routes/            # URL definitions and middleware only
│   ├── auth.js
│   ├── categories.js
│   ├── favorites.js
│   ├── itineraries.js
│   ├── places.js
│   └── reviews.js
├── middleware/        # Authentication, authorization and errors
├── db.js              # MySQL connection pool
├── utils.js           # Shared validation/async helpers
└── server.js          # Express app and route mounting
```

Each route imports the matching controller and wraps controller functions with `asyncHandler`. Keep endpoint paths and authentication/admin middleware in `routes/`; put request processing and SQL operations in `controllers/`.

## Requirements
- Node.js 18+
- MySQL 8 or MariaDB compatible with the supplied dump
- npm

## Setup (Windows / XAMPP)
1. Create/open the `gemtrail-backend` folder.
2. In phpMyAdmin, create/import the database using the supplied `gemtrail.sql` file. The dump includes `CREATE TABLE` statements but may expect the database `gemtrail` to exist first. Create a database named `gemtrail` using `utf8mb4_general_ci`, select it, then import the SQL.
3. Copy `.env.example` to `.env` and set the database username/password. Set `JWT_SECRET` to a random secret at least 32 characters long. Set `CLIENT_ORIGIN=http://localhost:5173` for a Vite React frontend.
4. Open a terminal in this directory:
   ```bash
   npm install
   npm run dev
   ```
5. Test `http://localhost:5000/api/health`. It should return `database: "connected"`.

## Create the first administrator
Do not expose an admin registration endpoint. Add these temporary variables to `.env`:
```env
ADMIN_NAME=GemTrail Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-unique-password-of-at-least-12-chars
```
Then run:
```bash
node scripts/create-admin.js
```
Remove the `ADMIN_*` variables after creation. Admin login uses the normal `POST /api/auth/login` endpoint. The script promotes the configured email to admin if it already exists.

## Run
```bash
npm install
npm run dev       # development with auto-reload
npm start         # normal start
```

## API conventions
- Base URL: `http://localhost:5000/api`
- JSON response success: `{ "success": true, "data": ... }`
- Errors: `{ "success": false, "message": "..." }`
- Send authenticated requests with `Authorization: Bearer <token>`.
- IDs must be positive integers. Page size defaults to 12 and is capped at 100.
- All routes use `/api`; the server accepts JSON bodies up to 1 MB.

## Endpoints

### Health and authentication
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API/database health |
| POST | `/auth/register` | Public | Register visitor (name, email, password; password min 8) |
| POST | `/auth/login` | Public | Login; returns JWT and user |
| GET | `/auth/me` | JWT | Current user profile |

Example login:
```json
{"email":"admin@example.com","password":"your-password"}
```

### Tourist places
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/places` | Public | List/search/filter/paginate |
| GET | `/places/top-rated?limit=6` | Public | Highest-rated active places |
| GET | `/places/:id` | Public | Place details |
| POST | `/places` | Admin | Create place |
| PATCH | `/places/:id` | Admin | Update supplied fields |
| DELETE | `/places/:id` | Admin | Soft-delete/deactivate place |

`GET /places` query parameters:
- `q`: search name, descriptions, or location
- `category_id`: category ID
- `district`: exact district
- `min_rating`: 0–5
- `latitude` and `longitude`: together, decimal coordinates
- `radius_km`: 0.1–500, only meaningful with coordinates
- `sort`: `name` (default), `rating`, or `newest`
- `page`: page number; `limit`: 1–100

Example: `/api/places?q=waterfall&category_id=1&sort=rating&page=1&limit=12`
Radius example: `/api/places?latitude=6.6828&longitude=80.3992&radius_km=25`

Create place body uses SQL column names, e.g.:
```json
{
  "category_id": 1,
  "name": "Example Attraction",
  "short_description": "A short summary",
  "location": "Ratnapura, Sri Lanka",
  "latitude": 6.68,
  "longitude": 80.40,
  "opening_hours": "8:00 AM - 5:00 PM",
  "entrance_fee": "LKR 100",
  "rating": 4.5,
  "district": "Ratnapura",
  "image_url": "https://example.com/image.jpg",
  "is_active": 1
}
```
The `visiting_tips` field may be a JSON string or an array/object (it is stored as JSON text in MySQL).

### Categories
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/categories` | Public | List categories with active place counts |
| POST | `/categories` | Admin | Create category |
| PATCH | `/categories/:id` | Admin | Update name/description |
| DELETE | `/categories/:id` | Admin | Delete category; linked places remain with NULL category |

### Favorites
All require JWT.
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/favorites` | Current user's favorites |
| POST | `/favorites/:placeId` | Add favorite |
| DELETE | `/favorites/:placeId` | Remove favorite |

### Reviews
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/reviews/place/:placeId` | Public | List reviews |
| POST | `/reviews/place/:placeId` | JWT | Create/update current user's review; body `{ "rating": 5, "review_text": "..." }` |
| DELETE | `/reviews/:id` | JWT | Delete own review |

### Itineraries
All require JWT; users can only access their own itineraries.
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/itineraries` | List own itineraries |
| POST | `/itineraries` | Create itinerary |
| GET | `/itineraries/:id` | Get itinerary including ordered stops |
| PATCH | `/itineraries/:id` | Update itinerary fields |
| DELETE | `/itineraries/:id` | Delete itinerary |
| POST | `/itineraries/:id/places` | Add stop |
| PATCH | `/itineraries/:id/places/:stopId` | Update stop |
| DELETE | `/itineraries/:id/places/:stopId` | Remove stop |

Create itinerary:
```json
{
  "title": "Ratnapura Day Trip",
  "trip_date": "2026-11-01",
  "start_time": "08:00:00",
  "start_location": "Ratnapura Town",
  "radius_km": 25,
  "transport_method": "Car",
  "estimated_cost": 2500,
  "notes": "Start early",
  "status": "draft"
}
```
Add a stop:
```json
{
  "tourist_place_id": 1,
  "stop_order": 1,
  "planned_arrival": "09:00:00",
  "planned_duration_minutes": 60,
  "estimated_travel_minutes": 20,
  "notes": "Bring water"
}
```

## Frontend integration
Set your React frontend base URL to `http://localhost:5000/api`. For example:
```js
const response = await fetch('http://localhost:5000/api/places?q=waterfall');
const result = await response.json();
```
For a protected route:
```js
fetch('http://localhost:5000/api/itineraries', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Important notes
- The SQL dump's `users` table already has `role ENUM('visitor','admin')`; only the setup script creates/promotes an admin.
- Public visitors do not need an account to browse places or categories.
- Deleting a place through the API sets `is_active=0` rather than physically deleting it, to preserve itinerary/history references.
- The database dump contains seed tourism content. Confirm attraction facts, contact details, image rights, opening hours and fees before production use.
- This backend does not implement bookings, payments, transport reservations, or hotel reservations because those are outside the SRS scope.
