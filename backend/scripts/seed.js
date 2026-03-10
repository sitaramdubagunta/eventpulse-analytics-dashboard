const pool = require('../config/db');
const faker = require('faker');

const devices = ['Desktop', 'Mobile', 'Tablet'];
const platforms = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
const eventNames = ['Login', 'Logout', 'Purchase', 'ViewPage', 'Signup', 'Click', 'Download', 'Share'];
const planTypes = ['Free', 'Pro', 'Enterprise'];

async function seed() {
  await pool.query('DELETE FROM events');
  await pool.query('DELETE FROM users');

  // Insert users
  const userIds = [];
  for (let i = 0; i < 100; i++) {
    const name = faker.name.findName();
    const country = faker.address.country();
    const plan = planTypes[Math.floor(Math.random() * planTypes.length)];
    const createdAt = faker.date.past(2);
    const res = await pool.query(
      'INSERT INTO users (name, country, plan_type, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, country, plan, createdAt]
    );
    userIds.push(res.rows[0].id);
  }

  // Insert events
  for (let i = 0; i < 5000; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const eventName = eventNames[Math.floor(Math.random() * eventNames.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const sessionDuration = Math.floor(Math.random() * 3600) + 60; // 1-60 min
    const occurredAt = faker.date.between('2024-01-01', new Date());
    await pool.query(
      'INSERT INTO events (user_id, event_name, device, platform, session_duration, occurred_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, eventName, device, platform, sessionDuration, occurredAt]
    );
  }

  console.log('Seed complete');
  process.exit();
}

seed();
