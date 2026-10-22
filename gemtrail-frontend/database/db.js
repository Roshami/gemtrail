import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MySQL Connection Pool for GemTrail
 * Configured with environment variables or default local parameters
 */
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'gemtrail_db',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

/**
 * Test MySQL connection
 */
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(' Successfully connected to MySQL database:', process.env.MYSQL_DATABASE || 'gemtrail_db');
    connection.release();
    return true;
  } catch (err) {
    console.warn('⚠️ MySQL connection note:', err.message);
    return false;
  }
}

/**
 * Fetch all landmarks with visiting tips
 */
export async function getPlaces() {
  const [placesRows] = await pool.query(`
    SELECT 
      id, name, category, category_label AS categoryLabel,
      rating, distance_km AS distanceKm, entrance_fee AS entranceFee,
      lat, lng, open_status AS openStatus, short_description AS shortDescription,
      detailed_description AS detailedDescription, image, secondary_image AS secondaryImage,
      mining_context AS miningContext, elevation_meters AS elevationMeters,
      best_time AS bestTime, contact
    FROM places
    ORDER BY created_at ASC
  `);

  const [tipsRows] = await pool.query(`
    SELECT place_id, tip FROM visiting_tips ORDER BY sort_order ASC
  `);

  // Group tips by place_id
  const tipsByPlace = {};
  for (const row of tipsRows) {
    if (!tipsByPlace[row.place_id]) tipsByPlace[row.place_id] = [];
    tipsByPlace[row.place_id].push(row.tip);
  }

  // Format into frontend place object structure
  return placesRows.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    categoryLabel: p.categoryLabel,
    rating: Number(p.rating),
    distanceKm: Number(p.distanceKm),
    entranceFee: p.entranceFee,
    coordinates: { lat: Number(p.lat), lng: Number(p.lng) },
    openStatus: p.openStatus,
    shortDescription: p.shortDescription,
    detailedDescription: p.detailedDescription,
    image: p.image,
    secondaryImage: p.secondaryImage,
    miningContext: p.miningContext,
    elevationMeters: p.elevationMeters,
    visitingTips: tipsByPlace[p.id] || [],
    bestTime: p.bestTime,
    contact: p.contact
  }));
}

/**
 * Add or update a place in MySQL
 */
export async function savePlace(place) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(`
      INSERT INTO places (
        id, name, category, category_label, rating, distance_km, entrance_fee,
        lat, lng, open_status, short_description, detailed_description,
        image, secondary_image, mining_context, elevation_meters, best_time, contact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        category_label = VALUES(category_label),
        rating = VALUES(rating),
        distance_km = VALUES(distance_km),
        entrance_fee = VALUES(entrance_fee),
        lat = VALUES(lat),
        lng = VALUES(lng),
        open_status = VALUES(open_status),
        short_description = VALUES(short_description),
        detailed_description = VALUES(detailed_description),
        image = VALUES(image),
        secondary_image = VALUES(secondary_image),
        mining_context = VALUES(mining_context),
        elevation_meters = VALUES(elevation_meters),
        best_time = VALUES(best_time),
        contact = VALUES(contact)
    `, [
      place.id,
      place.name,
      place.category,
      place.categoryLabel || place.category,
      place.rating || 4.5,
      place.distanceKm || 0,
      place.entranceFee || 'Free Entry',
      place.coordinates?.lat || 6.7056,
      place.coordinates?.lng || 80.3847,
      place.openStatus || 'Open Daily',
      place.shortDescription || '',
      place.detailedDescription || '',
      place.image || '',
      place.secondaryImage || null,
      place.miningContext || '',
      place.elevationMeters || 0,
      place.bestTime || '',
      place.contact || ''
    ]);

    // Update visiting tips if provided
    if (Array.isArray(place.visitingTips)) {
      await connection.query('DELETE FROM visiting_tips WHERE place_id = ?', [place.id]);
      for (let i = 0; i < place.visitingTips.length; i++) {
        await connection.query(
          'INSERT INTO visiting_tips (place_id, tip, sort_order) VALUES (?, ?, ?)',
          [place.id, place.visitingTips[i], i + 1]
        );
      }
    }

    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Delete a place by ID
 */
export async function deletePlace(id) {
  const [result] = await pool.query('DELETE FROM places WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Verify admin credentials in MySQL
 */
export async function verifyAdmin(username, password) {
  const [rows] = await pool.query(
    'SELECT id, username, display_name, role FROM admins WHERE username = ? AND password_hash = ?',
    [username, password]
  );
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
}
