require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const analyticsRoutes = require('./routes/analytics');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure tables exist
const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      country TEXT,
      plan_type TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      event_name TEXT,
      device TEXT,
      platform TEXT,
      session_duration INTEGER,
      occurred_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

createTables().then(() => {
  app.use('/api/analytics', analyticsRoutes);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
