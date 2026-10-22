const db = require('../db');
const { validateId } = require('../utils');
exports.list = async (req, res) => {
  const [rows] = await db.execute(
    `SELECT c.id,c.name,c.description,c.created_at, COUNT(p.id) AS place_count FROM categories c LEFT JOIN tourist_places p ON p.category_id=c.id AND p.is_active=1 GROUP BY c.id ORDER BY c.name`,
  );
  res.json({ success: true, data: rows });
};
exports.create = async (req, res) => {
  const { name, description = null } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100)
    return res
      .status(400)
      .json({
        success: false,
        message: 'Category name is required (max 100 characters).',
      });
  const [r] = await db.execute(
    'INSERT INTO categories(name,description) VALUES(?,?)',
    [name.trim(), description],
  );
  res
    .status(201)
    .json({
      success: true,
      data: { id: r.insertId, name: name.trim(), description },
    });
};
exports.update = async (req, res) => {
  const id = validateId(req.params.id);
  const { name, description } = req.body || {};
  if (name === undefined && description === undefined)
    return res
      .status(400)
      .json({ success: false, message: 'Provide name or description.' });
  if (
    name !== undefined &&
    (typeof name !== 'string' || !name.trim() || name.trim().length > 100)
  )
    return res
      .status(400)
      .json({ success: false, message: 'Invalid category name.' });
  const fields = [],
    values = [];
  if (name !== undefined) {
    fields.push('name=?');
    values.push(name.trim());
  }
  if (description !== undefined) {
    fields.push('description=?');
    values.push(description);
  }
  values.push(id);
  const [r] = await db.execute(
    `UPDATE categories SET ${fields.join(',')} WHERE id=?`,
    values,
  );
  if (!r.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: 'Category not found.' });
  const [rows] = await db.execute('SELECT * FROM categories WHERE id=?', [id]);
  res.json({ success: true, data: rows[0] });
};
exports.remove = async (req, res) => {
  const id = validateId(req.params.id);
  const [r] = await db.execute('DELETE FROM categories WHERE id=?', [id]);
  if (!r.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: 'Category not found.' });
  res.json({
    success: true,
    message:
      'Category deleted. Places in this category are retained without a category.',
  });
};
