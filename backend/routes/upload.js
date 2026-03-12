const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const { AppError } = require('../middleware/errorHandler');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/csv', authMiddleware, upload.single('file'), async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));
  const userId = req.user.id;
  const results = [];
  try {
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(csv())
      .on('data', (row) => {
        // Attach user_id to each row
        row.user_id = userId;
        results.push(row);
      })
      .on('end', async () => {
        // Insert rows into events table
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          for (const row of results) {
            await client.query(
              'INSERT INTO events (user_id, event_name, device, platform, session_duration, occurred_at) VALUES ($1, $2, $3, $4, $5, $6)',
              [row.user_id, row.event_name, row.device, row.platform, row.session_duration, row.occurred_at]
            );
          }
          await client.query('COMMIT');
          res.json({ status: 'success', inserted: results.length });
        } catch (err) {
          await client.query('ROLLBACK');
          next(err);
        } finally {
          client.release();
        }
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
