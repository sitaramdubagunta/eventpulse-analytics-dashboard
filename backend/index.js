require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const { helmet } = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');



const app = express();
app.use(helmet());
// app.use(limiter); // Rate limiter disabled for development
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
}));
app.options('*', cors());
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
  const uploadRoutes = require('./routes/upload');
  app.use('/api/auth', authRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/analytics', authMiddleware, analyticsRoutes);
  // Global error handler (should be last)
  app.use(errorHandler);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
