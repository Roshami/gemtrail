const db = require('../db');
const { validateId } = require('../utils');
exports.listForPlace = async (req, res) => {
  const id = validateId(req.params.placeId, 'placeId');
  const [rows] = await db.execute(
    `SELECT r.id,r.user_id,r.tourist_place_id,r.rating,r.review_text,r.created_at,r.updated_at,u.name AS reviewer_name FROM place_reviews r JOIN users u ON u.id=r.user_id WHERE r.tourist_place_id=? ORDER BY r.created_at DESC`,
    [id],
  );
  res.json({ success: true, data: rows });
};
exports.upsertForPlace = async (req, res) => {
  const id = validateId(req.params.placeId, 'placeId'),
    rating = Number(req.body?.rating),
    reviewText = req.body?.review_text ?? null;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return res
      .status(400)
      .json({
        success: false,
        message: 'Rating must be an integer from 1 to 5.',
      });
  if (
    reviewText !== null &&
    (typeof reviewText !== 'string' || reviewText.length > 5000)
  )
    return res
      .status(400)
      .json({
        success: false,
        message: 'Review must be 5000 characters or fewer.',
      });
  const [p] = await db.execute(
    'SELECT id FROM tourist_places WHERE id=? AND is_active=1',
    [id],
  );
  if (!p.length)
    return res
      .status(404)
      .json({ success: false, message: 'Tourist place not found.' });
  await db.execute(
    `INSERT INTO place_reviews(user_id,tourist_place_id,rating,review_text) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE rating=VALUES(rating),review_text=VALUES(review_text),updated_at=CURRENT_TIMESTAMP`,
    [req.user.id, id, rating, reviewText],
  );
  const [rows] = await db.execute(
    'SELECT * FROM place_reviews WHERE user_id=? AND tourist_place_id=?',
    [req.user.id, id],
  );
  res.status(201).json({ success: true, data: rows[0] });
};
exports.remove = async (req, res) => {
  const id = validateId(req.params.id);
  const [r] = await db.execute(
    'DELETE FROM place_reviews WHERE id=? AND user_id=?',
    [id, req.user.id],
  );
  if (!r.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: 'Review not found.' });
  res.json({ success: true, message: 'Review deleted.' });
};
