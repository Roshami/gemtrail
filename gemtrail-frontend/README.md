# GemTrail — Ratnapura District Heritage & Tourism Explorer

An interactive travel guide and landmark explorer for Ratnapura District (Sabaragamuwa Province, Sri Lanka), featuring dynamic Leaflet maps, category filtering, itinerary planner, dark/light theme, and a protected Admin CMS for maintaining landmarks.

---

## Prerequisites

Make sure you have installed on your computer:
- **Node.js**: v18 or higher (v20+ recommended) — [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js) or **pnpm** / **yarn** / **bun**

---

## Quick Start on Localhost

### 1. Clone or Download the Repository
If you downloaded the ZIP file, extract it and open your terminal inside the project directory:
```bash
cd gemtrail
```

### 2. Install Dependencies
```bash
npm install
```
*(or `pnpm install` / `yarn install` / `bun install`)*

### 3. Start Development Server
```bash
npm run dev
```

The terminal will display the local server URL:
```text
  VITE v8.x.x  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://<your-ip>:3000/
```

### 4. Open in Your Browser
Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## Admin Portal Login Credentials

To access the Admin Control Panel (Maintenance CMS):
1. Click **Admin** in the top navigation bar (or mobile menu).
2. Enter the default administrator credentials:
   - **Username**: `admin`
   - **Password**: `GemTrail#2025` *(or `admin`)*
3. Once logged in, you can:
   - Add, edit, and delete landmarks
   - Customize district statistics and coordinates
   - Export and import JSON backups
   - Update admin credentials and password

---

## Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `http://localhost:3000` with hot reload |
| `npm run build` | Compiles and builds production-ready static assets into the `dist/` folder |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type checking |
| `npm run clean` | Removes build artifacts |
| `npm run server:mysql` | Runs the Express + MySQL REST API backend at `http://localhost:5000` |

---

## 🗄️ MySQL Database Setup (Localhost / XAMPP / Docker)

The repository includes a ready-to-use MySQL database schema and Express API backend!

### Step 1: Start your MySQL Server
- **XAMPP / WampServer**: Start the MySQL service from the XAMPP Control Panel.
- **Docker**: Run `docker run --name mysql-gemtrail -e MYSQL_ROOT_PASSWORD= -e MYSQL_DATABASE=gemtrail_db -p 3306:3306 -d mysql:8.0`
- **Native MySQL**: Start MySQL Community Server via Services or `brew services start mysql`.

### Step 2: Import the Database Schema
1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`) or **MySQL Workbench**.
2. Create or import the file:
   - File path: `database/schema.sql`
   - Or via command line:
     ```bash
     mysql -u root -p < database/schema.sql
     ```
3. This creates the `gemtrail_db` database, with tables:
   - `places` (all landmark coordinates, descriptions, photos, and ratings)
   - `categories` (Waterfalls, Heritage, Gem Mines, Hiking)
   - `visiting_tips` (pro-tips for visitors)
   - `admins` (admin credentials for CMS maintenance)
   - `district_stats` (Ratnapura geographical and cultural metrics)

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` (or set environment variables):
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=gemtrail_db
MYSQL_PORT=3306
API_PORT=5000
```

### Step 4: Run the MySQL Backend
In a separate terminal window:
```bash
npm run server:mysql
```
The API server will listen on `http://localhost:5000` with endpoints:
- `GET /api/health` — Check MySQL connection status
- `GET /api/places` — Query all landmarks from MySQL
- `POST /api/places` — Save or update landmark in MySQL
- `DELETE /api/places/:id` — Delete landmark from MySQL
- `POST /api/auth/login` — Authenticate admin credentials with MySQL

---

## Tech Stack
- **React 19** + **Vite 8**
- **Material UI (MUI v9)** & **Tailwind CSS v4**
- **Leaflet & OpenStreetMap** for interactive Sri Lanka maps
- **Lucide & MUI Icons**
- **MySQL Database Integration** (`mysql2/promise` + Express API)
- **Local Persistence Fallback** via browser LocalStorage with automatic seed data

