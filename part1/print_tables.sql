INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES (
  (SELECT dog_id FROM Dogs WHERE name = 'Max' LIMIT 1),
  '2025-06-15 08:00:00',
  30,
  'Central Park',
  'completed'
);