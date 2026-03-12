const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Email and password required', 400));
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) return next(new AppError('Email already registered', 409));
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hash]);
    res.status(201).json({ status: 'success', user: result.rows[0] });
  } catch (err) { next(err); }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Email and password required', 400));
    const user = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    if (!user.rows.length) return next(new AppError('Invalid credentials', 401));
    const valid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!valid) return next(new AppError('Invalid credentials', 401));
    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ status: 'success', token });
  } catch (err) { next(err); }
});

module.exports = router;
