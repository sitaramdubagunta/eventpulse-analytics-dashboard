-- Migration: Add B-Tree indexes for time-series analytics
CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON events (occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events (user_id);
