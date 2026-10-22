require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/db');
(async () => {
  try {
    const name = process.env.ADMIN_NAME,
      email = process.env.ADMIN_EMAIL,
      password = process.env.ADMIN_PASSWORD;
    if (!name || !email || !password || password.length < 12) {
      throw new Error(
        'Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) in .env before running this script.',
      );
    }
    const hash = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_ROUNDS || 12),
    );
    await db.execute(
      `INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,'admin')
      ON DUPLICATE KEY UPDATE name=VALUES(name),password_hash=VALUES(password_hash),role='admin'`,
      [name, email.toLowerCase(), hash],
    );
    console.log(`Administrator account ready: ${email.toLowerCase()}`);
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})();
