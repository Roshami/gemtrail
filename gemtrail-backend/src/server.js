require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const { notFound, errorHandler } = require('./middleware/errors');


if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error(
    'JWT_SECRET must be set in .env and contain at least 32 characters.',
  );
  process.exit(1);
}
const app = express();
app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = (
  process.env.CLIENT_ORIGIN || 'http://localhost:3000'
)
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header (e.g. server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      success: true,
      message: 'GemTrail API is running',
      database: 'connected',
    });
  } catch {
    res
      .status(503)
      .json({
        success: false,
        message: 'API is running but database is unavailable',
        database: 'disconnected',
      });
  }
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/places', require('./routes/places'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/itineraries', require('./routes/itineraries'));
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () =>
  console.log(`GemTrail API listening on http://localhost:${port}`),
);
async function shutdown() {
  console.log('Shutting down...');
  server.close(async () => {
    await db.end();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
