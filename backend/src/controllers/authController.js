const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { email, password, full_name, phone, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, email, full_name, role`,
      [email, hashed, full_name, phone, role]
    );
    const user = result.rows[0];

    if (role === 'driver') {
      await pool.query('INSERT INTO drivers (user_id) VALUES ($1)', [user.id]);
    }

    const token = signToken(user.id, user.role);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user.id);
    res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};