const db = require('../db');
const { validateId } = require('../utils');
async function getOwnedItinerary(id, userId) {
  const [rows] = await db.execute(
    'SELECT * FROM itineraries WHERE id=? AND user_id=?',
    [id, userId],
  );
  return rows[0];
}
exports.list = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM itineraries WHERE user_id=? ORDER BY updated_at DESC',
    [req.user.id],
  );
  res.json({ success: true, data: rows });
};
exports.create = async (req, res) => {
  const b = req.body || {};
  if (
    typeof b.title !== 'string' ||
    !b.title.trim() ||
    b.title.trim().length > 180
  )
    return res
      .status(400)
      .json({
        success: false,
        message: 'Itinerary title is required (max 180 characters).',
      });
  const status = ['draft', 'saved', 'completed'].includes(b.status)
    ? b.status
    : 'draft';
  const [r] = await db.execute(
    `INSERT INTO itineraries(user_id,title,trip_date,start_time,end_time,start_location,radius_km,transport_method,estimated_cost,notes,status) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    [
      req.user.id,
      b.title.trim(),
      b.trip_date || null,
      b.start_time || null,
      b.end_time || null,
      b.start_location || null,
      b.radius_km ?? null,
      b.transport_method || null,
      b.estimated_cost ?? null,
      b.notes || null,
      status,
    ],
  );
  res
    .status(201)
    .json({
      success: true,
      data: { id: r.insertId, ...b, user_id: req.user.id, status },
    });
};
exports.getOne = async (req, res) => {
  const id = validateId(req.params.id);
  const itinerary = await getOwnedItinerary(id, req.user.id);
  if (!itinerary)
    return res
      .status(404)
      .json({ success: false, message: 'Itinerary not found.' });
  const [places] = await db.execute(
    `SELECT ip.id AS itinerary_place_id,ip.stop_order,ip.planned_arrival,ip.planned_duration_minutes,ip.estimated_travel_minutes,ip.notes AS stop_notes,p.*,c.name AS category_name FROM itinerary_places ip JOIN tourist_places p ON p.id=ip.tourist_place_id LEFT JOIN categories c ON c.id=p.category_id WHERE ip.itinerary_id=? ORDER BY ip.stop_order`,
    [id],
  );
  res.json({ success: true, data: { ...itinerary, places } });
};
exports.update = async (req, res) => {
  const id = validateId(req.params.id),
    b = req.body || {};
  if (!(await getOwnedItinerary(id, req.user.id)))
    return res
      .status(404)
      .json({ success: false, message: 'Itinerary not found.' });
  const allowed = {
    title: 'title',
    trip_date: 'trip_date',
    start_time: 'start_time',
    end_time: 'end_time',
    start_location: 'start_location',
    radius_km: 'radius_km',
    transport_method: 'transport_method',
    estimated_cost: 'estimated_cost',
    notes: 'notes',
    status: 'status',
  };
  const keys = Object.keys(b).filter((k) => allowed[k]);
  if (!keys.length)
    return res
      .status(400)
      .json({ success: false, message: 'No valid itinerary fields supplied.' });
  if (
    b.title !== undefined &&
    (typeof b.title !== 'string' || !b.title.trim() || b.title.length > 180)
  )
    return res.status(400).json({ success: false, message: 'Invalid title.' });
  if (
    b.status !== undefined &&
    !['draft', 'saved', 'completed'].includes(b.status)
  )
    return res
      .status(400)
      .json({
        success: false,
        message: 'Status must be draft, saved, or completed.',
      });
  await db.execute(
    `UPDATE itineraries SET ${keys.map((k) => `${allowed[k]}=?`).join(',')} WHERE id=? AND user_id=?`,
    [...keys.map((k) => (b[k] === '' ? null : b[k])), id, req.user.id],
  );
  const [rows] = await db.execute('SELECT * FROM itineraries WHERE id=?', [id]);
  res.json({ success: true, data: rows[0] });
};
exports.remove = async (req, res) => {
  const id = validateId(req.params.id);
  const [r] = await db.execute(
    'DELETE FROM itineraries WHERE id=? AND user_id=?',
    [id, req.user.id],
  );
  if (!r.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: 'Itinerary not found.' });
  res.json({ success: true, message: 'Itinerary deleted.' });
};
exports.addPlace = async (req, res) => {
  const id = validateId(req.params.id);
  if (!(await getOwnedItinerary(id, req.user.id)))
    return res
      .status(404)
      .json({ success: false, message: 'Itinerary not found.' });
  const b = req.body || {},
    placeId = validateId(b.tourist_place_id, 'tourist_place_id');
  const order = Number(b.stop_order);
  if (!Number.isInteger(order) || order < 1)
    return res
      .status(400)
      .json({
        success: false,
        message: 'stop_order must be a positive integer.',
      });
  const [p] = await db.execute(
    'SELECT id FROM tourist_places WHERE id=? AND is_active=1',
    [placeId],
  );
  if (!p.length)
    return res
      .status(404)
      .json({ success: false, message: 'Tourist place not found.' });
  const [r] = await db.execute(
    `INSERT INTO itinerary_places(itinerary_id,tourist_place_id,stop_order,planned_arrival,planned_duration_minutes,estimated_travel_minutes,notes) VALUES(?,?,?,?,?,?,?)`,
    [
      id,
      placeId,
      order,
      b.planned_arrival || null,
      b.planned_duration_minutes ?? null,
      b.estimated_travel_minutes ?? null,
      b.notes || null,
    ],
  );
  res
    .status(201)
    .json({
      success: true,
      data: {
        id: r.insertId,
        itinerary_id: id,
        tourist_place_id: placeId,
        stop_order: order,
      },
    });
};
exports.updatePlace = async (req, res) => {
  const id = validateId(req.params.id),
    stopId = validateId(req.params.stopId);
  if (!(await getOwnedItinerary(id, req.user.id)))
    return res
      .status(404)
      .json({ success: false, message: 'Itinerary not found.' });
  const allowed = [
    'stop_order',
    'planned_arrival',
    'planned_duration_minutes',
    'estimated_travel_minutes',
    'notes',
  ];
  const keys = Object.keys(req.body || {}).filter((k) => allowed.includes(k));
  if (!keys.length)
    return res
      .status(400)
      .json({ success: false, message: 'No valid stop fields supplied.' });
  const [r] = await db.execute(
    `UPDATE itinerary_places SET ${keys.map((k) => `${k}=?`).join(',')} WHERE id=? AND itinerary_id=?`,
    [...keys.map((k) => req.body[k]), stopId, id],
  );
  if (!r.affectedRows)
    return res
      .status(404)
      .json({
        success: false,
        message: 'Itinerary stop not found or unchanged.',
      });
  res.json({ success: true, message: 'Itinerary stop updated.' });
};
exports.removePlace = async (req, res) => {
  const id = validateId(req.params.id),
    stopId = validateId(req.params.stopId);
  if (!(await getOwnedItinerary(id, req.user.id)))
    return res
      .status(404)
      .json({ success: false, message: 'Itinerary not found.' });
  const [r] = await db.execute(
    'DELETE FROM itinerary_places WHERE id=? AND itinerary_id=?',
    [stopId, id],
  );
  if (!r.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: 'Itinerary stop not found.' });
  res.json({ success: true, message: 'Place removed from itinerary.' });
};
