import express from 'express';
import dotenv from 'dotenv';
import { testConnection, getPlaces, savePlace, deletePlace, verifyAdmin } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 5000;

app.use(express.json());

// Enable CORS for development frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health & DB status check
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// GET all places from MySQL
app.get('/api/places', async (req, res) => {
  try {
    const places = await getPlaces();
    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places from MySQL', message: error.message });
  }
});

// POST create/update place in MySQL
app.post('/api/places', async (req, res) => {
  try {
    const place = req.body;
    if (!place.id || !place.name) {
      return res.status(400).json({ error: 'Missing required place fields: id and name' });
    }
    await savePlace(place);
    res.json({ success: true, message: 'Place saved to MySQL database successfully', id: place.id });
  } catch (error) {
    console.error('Error saving place:', error);
    res.status(500).json({ error: 'Failed to save place to MySQL', message: error.message });
  }
});

// DELETE place from MySQL
app.delete('/api/places/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deletePlace(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Place not found in database' });
    }
    res.json({ success: true, message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ error: 'Failed to delete place from MySQL', message: error.message });
  }
});

// POST Admin login with MySQL
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await verifyAdmin(username, password);
    if (admin) {
      res.json({
        success: true,
        user: {
          username: admin.username,
          displayName: admin.display_name,
          role: admin.role
        },
        token: `mock-jwt-token-${Date.now()}`
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Authentication failed', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GemTrail MySQL API server running at http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - GET    /api/health`);
  console.log(`   - GET    /api/places`);
  console.log(`   - POST   /api/places`);
  console.log(`   - DELETE /api/places/:id`);
  console.log(`   - POST   /api/auth/login`);
});
