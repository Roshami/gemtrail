const db = require('../db');
const { positiveInt, optionalNumber, validateId } = require('../utils');
const columns = [
  'category_id',
  'name',
  'short_description',
  'description',
  'location',
  'latitude',
  'longitude',
  'opening_hours',
  'entrance_fee',
  'transport_info',
  'travel_time',
  'visit_duration',
  'rating',
  'district',
  'image_url',
  'secondary_image_url',
  'best_time',
  'contact',
  'elevation_meters',
  'mining_context',
  'visiting_tips',
  'is_active',
];
const allowed = new Set(columns);
function buildValues(body, create = false) {
  const data = { ...body };
  if (
    create &&
    (!data.name || typeof data.name !== 'string' || !data.name.trim())
  )
    throw Object.assign(new Error('Place name is required.'), { status: 400 });
  if (
    data.name !== undefined &&
    (typeof data.name !== 'string' ||
      !data.name.trim() ||
      data.name.length > 180)
  )
    throw Object.assign(new Error('Name must be 1–180 characters.'), {
      status: 400,
    });
  for (const key of ['latitude', 'longitude', 'rating']) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      data[key] = Number(data[key]);
      const [min, max] =
        key === 'latitude'
          ? [-90, 90]
          : key === 'longitude'
            ? [-180, 180]
            : [0, 5];
      if (!Number.isFinite(data[key]) || data[key] < min || data[key] > max)
        throw Object.assign(new Error(`Invalid ${key}.`), { status: 400 });
    } else if (data[key] === '') data[key] = null;
  }
  if (
    data.visiting_tips !== undefined &&
    data.visiting_tips !== null &&
    typeof data.visiting_tips !== 'string'
  )
    data.visiting_tips = JSON.stringify(data.visiting_tips);
  if (data.is_active !== undefined)
    data.is_active =
      data.is_active === true || data.is_active === 1 || data.is_active === '1'
        ? 1
        : 0;
  return Object.fromEntries(
    Object.entries(data).filter(([k, v]) => allowed.has(k) && v !== undefined),
  );
}
exports.list = async (req, res) => {
  const page = positiveInt(req.query.page, 1, 1000000),
    limit = positiveInt(req.query.limit, 12, 100),
    offset = (page - 1) * limit,
    where = ['p.is_active=1'],
    params = [];
  if (req.query.q) {
    where.push(
      '(p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ? OR p.location LIKE ?)',
    );
    const q = `%${String(req.query.q).slice(0, 150)}%`;
    params.push(q, q, q, q);
  }
  if (req.query.category_id) {
    where.push('p.category_id=?');
    params.push(validateId(req.query.category_id, 'category_id'));
  }
  if (req.query.district) {
    where.push('p.district=?');
    params.push(String(req.query.district).slice(0, 100));
  }
  if (req.query.min_rating !== undefined) {
    const n = optionalNumber(req.query.min_rating, 0, 5, 'min_rating');
    where.push('p.rating>=?');
    params.push(n);
  }
  const lat = optionalNumber(req.query.latitude, -90, 90, 'latitude'),
    lng = optionalNumber(req.query.longitude, -180, 180, 'longitude'),
    radius = optionalNumber(req.query.radius_km, 0.1, 500, 'radius_km');
  if ((lat === null) !== (lng === null))
    return res
      .status(400)
      .json({
        success: false,
        message: 'latitude and longitude must be supplied together.',
      });
  let distanceExpr = null;
  if (lat !== null) {
    distanceExpr =
      '(6371 * 2 * ASIN(SQRT(POWER(SIN(RADIANS(p.latitude-?)/2),2) + COS(RADIANS(?))*COS(RADIANS(p.latitude))*POWER(SIN(RADIANS(p.longitude-?)/2),2))))';
    if (radius !== null) {
      where.push(`${distanceExpr} <= ?`);
      params.push(lat, lat, lng, radius);
    }
  }
  const whereSql = where.join(' AND '),
    order = String(req.query.sort || 'name'),
    orderSql =
      order === 'rating'
        ? 'p.rating DESC, p.name ASC'
        : order === 'newest'
          ? 'p.created_at DESC'
          : 'p.name ASC',
    selectDistance = lat !== null ? `, ${distanceExpr} AS distance_km` : '',
    selectParams = lat !== null ? [lat, lat, lng] : [];
  const [countRows] = await db.execute(
    `SELECT COUNT(*) AS total FROM tourist_places p WHERE ${whereSql}`,
    params,
  );
  const [rows] = await db.execute(
    `SELECT p.*,c.name AS category_name${selectDistance} FROM tourist_places p LEFT JOIN categories c ON c.id=p.category_id WHERE ${whereSql} ORDER BY ${orderSql} LIMIT ${limit} OFFSET ${offset}`,
    [...selectParams, ...params],
  );
  res.json({
    success: true,
    data: rows,
    pagination: {
      page,
      limit,
      total: countRows[0].total,
      totalPages: Math.ceil(countRows[0].total / limit),
    },
  });
};
exports.topRated = async (req, res) => {
  const limit = positiveInt(req.query.limit, 6, 50);
  const [rows] = await db.execute(
    `SELECT p.*,c.name AS category_name FROM tourist_places p LEFT JOIN categories c ON c.id=p.category_id WHERE p.is_active=1 AND p.rating IS NOT NULL ORDER BY p.rating DESC,p.name ASC LIMIT ${limit}`,
  );
  res.json({ success: true, data: rows });
};
exports.getOne = async (req, res) => {
  const id = validateId(req.params.id);
  const [rows] = await db.execute(
    `SELECT p.*,c.name AS category_name,(SELECT COUNT(*) FROM place_reviews r WHERE r.tourist_place_id=p.id) AS review_count,(SELECT ROUND(AVG(r.rating),2) FROM place_reviews r WHERE r.tourist_place_id=p.id) AS user_rating FROM tourist_places p LEFT JOIN categories c ON c.id=p.category_id WHERE p.id=? AND p.is_active=1`,
    [id],
  );
  if (!rows.length)
    return res
      .status(404)
      .json({ success: false, message: 'Tourist place not found.' });
  res.json({ success: true, data: rows[0] });
};
exports.create = async (req, res) => {
  const data = buildValues(req.body || {}, true),
    keys = Object.keys(data),
    values = Object.values(data);
  const [r] = await db.execute(
    `INSERT INTO tourist_places (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
    values,
  );
  const [rows] = await db.execute('SELECT * FROM tourist_places WHERE id=?', [
    r.insertId,
  ]);
  res.status(201).json({ success: true, data: rows[0] });
};
exports.update = async (req, res) => {
  const id = validateId(req.params.id),
    data = buildValues(req.body || {}),
    keys = Object.keys(data);
  if (!keys.length)
    return res
      .status(400)
      .json({ success: false, message: 'No valid place fields supplied.' });
  const [r] = await db.execute(
    `UPDATE tourist_places SET ${keys.map((k) => `${k}=?`).join(',')} WHERE id=?`,
    [...Object.values(data), id],
  );
  if (!r.affectedRows) {
    const [exists] = await db.execute(
      'SELECT id FROM tourist_places WHERE id=?',
      [id],
    );
    if (!exists.length)
      return res
        .status(404)
        .json({ success: false, message: 'Tourist place not found.' });
  }
  const [rows] = await db.execute('SELECT * FROM tourist_places WHERE id=?', [
    id,
  ]);
  res.json({ success: true, data: rows[0] });
};
exports.remove = async (req, res) => {
  const id = validateId(req.params.id);
  const [r] = await db.execute(
    'UPDATE tourist_places SET is_active=0 WHERE id=?',
    [id],
  );
  if (!r.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: 'Tourist place not found.' });
  res.json({ success: true, message: 'Tourist place deactivated.' });
};
