const pool = require('../config/db');

exports.getWeeklyActiveUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE_TRUNC('week', occurred_at) AS week,
        COUNT(DISTINCT user_id) AS active_users
      FROM events
      GROUP BY week
      ORDER BY week;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventFrequency = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT event_name,
        COUNT(*) AS event_count
      FROM events
      GROUP BY event_name
      ORDER BY event_count DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeviceUsage = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT device,
        COUNT(*) AS count
      FROM events
      GROUP BY device
      ORDER BY count DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSessionDuration = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE_TRUNC('week', occurred_at) AS week,
        AVG(session_duration) AS avg_session_duration
      FROM events
      GROUP BY week
      ORDER BY week;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
