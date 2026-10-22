const db = require('../db');
const { validateId } = require('../utils');
exports.list = async (req, res) => {
  const [rows] = await db.execute(
    `SELECT p.*,c.name AS category_name,f.created_at AS favorited_at FROM favorites f JOIN tourist_places p ON p.id=f.tourist_place_id LEFT JOIN categories c ON c.id=p.category_id WHERE f.user_id=? AND p.is_active=1 ORDER BY f.created_at DESC`,
    [req.user.id],
  );
  res.json({ success: true, data: rows });
};
exports.add = async (req, res) => {
  const id = validateId(req.params.placeId, 'placeId');
  const [p] = await db.execute(
    'SELECT id FROM tourist_places WHERE id=? AND is_active=1',
    [id],
  );
  if (!p.length)
    return res
      .status(404)
      .json({ success: false, message: 'Tourist place not found.' });
  await db.execute(
    'INSERT IGNORE INTO favorites(user_id,tourist_place_id) VALUES(?,?)',
    [req.user.id, id],
  );
  res.status(201).json({ success: true, message: 'Place added to favorites.' });
};
exports.remove = async (req, res) => {
  const id = validateId(req.params.placeId, 'placeId');
  const [r] = await db.execute(
    'DELETE FROM favorites WHERE user_id=? AND tourist_place_id=?',
    [req.user.id, id],
  );
  if (!r.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: 'Favorite not found.' });
  res.json({ success: true, message: 'Place removed from favorites.' });
};
