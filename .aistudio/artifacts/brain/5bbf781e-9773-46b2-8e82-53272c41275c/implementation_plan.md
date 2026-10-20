# Database & API Architecture Guide & Migration Plan

This plan explains the current data architecture in GemTrail, answers what database is currently used, and details step-by-step how to call real backend databases and external REST APIs.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **What Database We Currently Use**:
> GemTrail currently uses the browser's built-in **`localStorage` (Client-Side Key-Value Store)** alongside default bundled seed datasets (`src/data/ratnapuraPlaces.js`). It allows adding, editing, and deleting landmarks offline directly in your browser without needing an external database server or credentials.
>
> When you are ready to transition to a shared, multi-user database, we have two primary architectural paths:
> 1. **Option A (Cloud Serverless — Recommended)**: **Google Cloud Firestore**. Serverless NoSQL document database with real-time multi-device sync, secure rules, and built-in auth.
> 2. **Option B (Full-Stack REST API)**: **Node.js / Express Server + PostgreSQL or MongoDB**. An Express backend with custom `/api/places` endpoints and standard SQL/NoSQL connection pools.

- **Confirmed Goal**: Learn the architecture, data flow, and concepts before writing code.
- **Current Database**: Browser `localStorage` (client-side) initialized from seed JSON.
- **Future Database Recommendation**: Cloud Firestore (fastest serverless sync) or Express REST API (traditional client-server architecture).

---

## 1. Overview & Core Concept

### What It Does Today (Current Architecture)
In the current setup, all 44 Ratnapura landmarks, itinerary bookmarks, admin session states, and district metadata live directly inside the client's web browser:
1. When the app loads, `placesStorage.js` checks if `localStorage.getItem('gemtrail_places_v2')` has data.
2. If empty, it populates `localStorage` with the default landmark records from `ratnapuraPlaces.js`.
3. When an admin creates, edits, or deletes a landmark in the Admin Panel, the app writes back to `localStorage` and triggers a state update in React.
4. Changes stay saved across browser refreshes on that specific device, and users can export or import JSON backup files.

### What Changes With a Real Database & API
When connecting a real database:
- **Shared Persistence**: When an administrator adds a new gem pit or waterfall, every visitor across any phone or laptop immediately sees the new landmark.
- **Security**: Database credentials, private admin tokens, and write validation live securely on the backend rather than in browser memory.
- **External API Integrations**: The app can call live third-party APIs (e.g., Open-Meteo for Ratnapura rainfall/weather, Google Maps elevation/routing, or currency rates for gem pricing).

---

## 2. How Calling Databases and APIs Works (Concepts)

### Concept 1: The Three Architectural Layers

```
┌────────────────────────────────────────────────────────┐
│                   1. FRONTEND (Client)                 │
│      React Components (MapView, ExploreView, Admin)     │
│   - Triggers `fetch()` or SDK calls on user action     │
│   - Holds UI loading, error, and optimistic states     │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTP / JSON  │  REST API Calls:
               Requests     │  GET /api/places
                            │  POST /api/places
                            ▼
┌────────────────────────────────────────────────────────┐
│                   2. BACKEND (Server / API)            │
│          Express.js / Cloud Function / Serverless      │
│   - Authenticates admin requests (JWT / API tokens)    │
│   - Validates payload fields (lat, lng, category)      │
│   - Safely communicates with the database              │
└───────────────────────────┬────────────────────────────┘
                            │
               Database     │  SQL Queries (SELECT, INSERT)
               Connection   │  or NoSQL Document Operations
                            ▼
┌────────────────────────────────────────────────────────┐
│                  3. DATABASE (Data Store)              │
│       PostgreSQL, MySQL, MongoDB, or Cloud Firestore   │
│   - Stores permanent records on persistent disks       │
│   - Handles indexes, transactions, and backups         │
└────────────────────────────────────────────────────────┘
```

---

### Concept 2: Anatomy of Calling an API in React

In React, calling an API typically involves four lifecycle states:
1. **Idle / Initial**: Component mounts, triggers a `useEffect` hook.
2. **Loading**: Component sets `isLoading = true` to display skeletons or spinners.
3. **Success**: Data arrives as JSON via `await response.json()`, stored in `useState(data)`.
4. **Error**: Network or HTTP error caught in `try...catch` block, displayed to the user via toast/alert.

#### Example: Client-Side Fetch Hook Pattern
```javascript
// Example: Fetching places from a REST API endpoint
useEffect(() => {
  async function loadLandmarks() {
    try {
      setLoading(true);
      const res = await fetch('/api/places');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  loadLandmarks();
}, []);
```

---

### Concept 3: Database Choices for GemTrail

| Criteria | 1. LocalStorage (Current) | 2. Cloud Firestore (Serverless) | 3. PostgreSQL / Express API |
| :--- | :--- | :--- | :--- |
| **Setup Effort** | Zero setup (already active) | Minimal (SDK + cloud configuration) | Moderate (backend routes + DB setup) |
| **Multi-user Sync** | No (single browser only) | Yes (real-time live listeners) | Yes (via HTTP endpoints / WebSockets) |
| **Offline Support** | Yes (in that browser) | Yes (built-in offline cache) | Requires Service Worker |
| **Data Schema** | Flexible JSON | Flexible Document collections | Rigid relational tables with types |
| **Best Used For** | Fast prototyping, local demos | Collaborative web & mobile apps | Complex relational queries, SQL reporting |

---

## 3. Step-by-Step Transition Roadmap

### Phase 1: Understanding & API Mocking (Current Phase)
- Review the current `src/utils/placesStorage.js` service methods: `getStoredPlaces()`, `saveStoredPlaces()`, and `resetStoredPlaces()`.
- Identify the exact JSON schema required for each landmark (ID, name, category, coordinates, description, entry fee, tags).

### Phase 2: Adding Backend REST Endpoints (Express Server)
If choosing a traditional Node.js/Express backend:
1. Create `server.ts` or `server.js` running Express.
2. Mount REST endpoints:
   - `GET /api/places`: Returns all active landmarks.
   - `GET /api/places/:id`: Returns single landmark details.
   - `POST /api/places`: Protected admin route to create a landmark.
   - `PUT /api/places/:id`: Protected admin route to update a landmark.
   - `DELETE /api/places/:id`: Protected admin route to remove a landmark.
3. Connect the endpoints to a database driver (e.g., `pg` for PostgreSQL or `mongoose` for MongoDB).

### Phase 3: Integrating Third-Party External APIs
For dynamic live data:
1. **Weather API (Open-Meteo)**: Free, keyless API to query Ratnapura weather, rainfall, and gem mining suitability conditions.
2. **Routing / Distance API (OSRM)**: OpenStreetMap routing engine to calculate real travel time between Adam's Peak, Bopath Ella, and Ratnapura town.

---

## 4. Technical Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GemTrail Client Application                      │
│                                                                        │
│  ┌────────────────┐    ┌─────────────────┐    ┌─────────────────────┐  │
│  │   MapView.jsx  │    │ ExploreView.jsx │    │ AdminPanelView.jsx  │  │
│  └───────┬────────┘    └────────┬────────┘    └──────────┬──────────┘  │
│          │                      │                        │             │
│          ▼                      ▼                        ▼             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              API Client Service (`src/services/api.js`)           │  │
│  │     - Handles fetch(), headers, token injection, error handling  │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │ HTTP / JSON
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Backend & Database Integration                     │
│                                                                        │
│   ┌───────────────────────────┐      ┌──────────────────────────────┐  │
│   │   Internal REST / DB      │      │     External APIs (3P)       │  │
│   │                           │      │                              │  │
│   │  • /api/places (CRUD)     │      │  • Open-Meteo Weather API    │  │
│   │  • /api/auth/login        │      │  • OpenStreetMap Tile Server │  │
│   │  • PostgreSQL / Firestore │      │  • Distance / Routing API    │  │
│   └───────────────────────────┘      └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Next Steps
When you are ready to implement:
1. Let us know if you would like to proceed with connecting **Cloud Firestore**, building an **Express REST API backend**, or integrating a **Live Weather / Routing API**.
2. We can implement real endpoints while keeping full backward compatibility with your current local landmarks!
