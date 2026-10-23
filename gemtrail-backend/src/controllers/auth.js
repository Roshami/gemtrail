const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (
    typeof name !== 'string' ||
    name.trim().length < 2 ||
    name.trim().length > 120
  )
    return res
      .status(400)
      .json({ success: false, message: 'Name must be 2–120 characters.' });
  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 190
  )
    return res
      .status(400)
      .json({ success: false, message: 'A valid email is required.' });
  if (
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 128
  )
    return res
      .status(400)
      .json({ success: false, message: 'Password must be 8–128 characters.' });
  const normalizedEmail = email.trim().toLowerCase();
  const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [
    normalizedEmail,
  ]);
  if (existing.length)
    return res
      .status(409)
      .json({ success: false, message: 'Email is already registered.' });
  const hash = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_ROUNDS || 12),
  );
  const [result] = await db.execute(
    'INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)',
    [name.trim(), normalizedEmail, hash, 'visitor'],
  );
  res
    .status(201)
    .json({
      success: true,
      data: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        role: 'visitor',
      },
    });
};
exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string')
    return res
      .status(400)
      .json({ success: false, message: 'Email and password are required.' });
  const [rows] = await db.execute(
    'SELECT id,name,email,password_hash,role FROM users WHERE email = ? LIMIT 1',
    [email.trim().toLowerCase()],
  );
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash)))
    return res
      .status(401)
      .json({ success: false, message: 'Invalid email or password.' });
  const user = rows[0];
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  );
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};
exports.me = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id,name,email,role,created_at FROM users WHERE id = ?',
    [req.user.id],
  );
  if (!rows.length)
    return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, data: rows[0] });
};


//change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (
    typeof currentPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    newPassword.length < 3 ||
    newPassword.length > 128
  )
    return res.status(400).json({
      success: false,
      message: 'Current and new passwords are required. New password must be 3–128 characters.',
    });

  const [rows] = await db.execute(
    'SELECT password_hash FROM users WHERE id = ?',
    [req.user.id],
  );
  if (!rows.length)
    return res.status(404).json({ success: false, message: 'User not found.' });

  const user = rows[0];
  if (!(await bcrypt.compare(currentPassword, user.password_hash)))
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

  const newHash = await bcrypt.hash(
    newPassword,
    Number(process.env.BCRYPT_ROUNDS || 12),
  );
  await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [
    newHash,
    req.user.id,
  ]);

  res.json({ success: true, message: 'Password changed successfully.' });
};