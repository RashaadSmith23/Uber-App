const pool = require('../config/db');

exports.toggleOnline = async (req, res) => {
  const driverId = req.userId;
  const { online } = req.body;
  try {
    await pool.query('UPDATE drivers SET is_online = $1 WHERE user_id = $2', [online, driverId]);
    res.json({ online });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};