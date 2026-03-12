const pool = require('../config/db');

exports.getWeeklyActiveUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      WITH weekly AS (
        SELECT DATE_TRUNC('week', occurred_at) AS week,
               COUNT(DISTINCT user_id) AS active_users
        FROM events
        WHERE user_id = $1
        GROUP BY week
      ),
      growth AS (
        SELECT week,
               active_users,
               LAG(active_users) OVER (ORDER BY week) AS prev_active_users
        FROM weekly
      )
      SELECT week,
             active_users,
             ROUND(
               CASE WHEN prev_active_users IS NULL OR prev_active_users = 0 THEN NULL
                    ELSE ((active_users::float - prev_active_users) / prev_active_users) * 100
               END, 2
             ) AS wow_growth_percent
      FROM growth
      ORDER BY week;
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getEventFrequency = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      SELECT event_name,
        COUNT(*) AS event_count
      FROM events
      WHERE user_id = $1
      GROUP BY event_name
      ORDER BY event_count DESC;
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getDeviceUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      SELECT device,
        COUNT(*) AS count
      FROM events
      WHERE user_id = $1
      GROUP BY device
      ORDER BY count DESC;
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getSessionDuration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      SELECT DATE_TRUNC('week', occurred_at) AS week,
        AVG(session_duration) AS avg_session_duration
      FROM events
      WHERE user_id = $1
      GROUP BY week
      ORDER BY week;
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
