-- 1. Update an existing Max walk request to completed (if any)
UPDATE WalkRequests wr
JOIN Dogs d ON wr.dog_id = d.dog_id
SET wr.status = 'completed'
WHERE d.name = 'Max'
LIMIT 1;

-- 2. If no rows updated, insert a new completed walk request for Max
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
SELECT dog_id, '2025-06-15 08:00:00', 30, 'Central Park', 'completed'
FROM Dogs
WHERE name = 'Max'
AND NOT EXISTS (
  SELECT 1 FROM WalkRequests wr
  JOIN Dogs d ON wr.dog_id = d.dog_id
  WHERE d.name = 'Max' AND wr.status = 'completed'
)
LIMIT 1;

-- 3. Insert or update WalkApplications linking bobwalker to Max's completed walk
INSERT INTO WalkApplications (request_id, walker_id, status)
SELECT
  wr.request_id,
  u.user_id,
  'accepted'
FROM WalkRequests wr
JOIN Dogs d ON wr.dog_id = d.dog_id
JOIN Users u ON u.username = 'bobwalker'
WHERE d.name = 'Max' AND wr.status = 'completed'
ON DUPLICATE KEY UPDATE status = 'accepted';

-- 4. Insert WalkRating for bobwalker on Max's walk (optional)
INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments, rated_at)
SELECT
  wr.request_id,
  u.user_id,
  o.user_id,
  5,
  'Great walk!',
  NOW()
FROM WalkRequests wr
JOIN Dogs d ON wr.dog_id = d.dog_id
JOIN Users u ON u.username = 'bobwalker'
JOIN Users o ON o.username = 'alice123'
WHERE d.name = 'Max' AND wr.status = 'completed'
AND NOT EXISTS (
  SELECT 1 FROM WalkRatings r WHERE r.request_id = wr.request_id
)
LIMIT 1;
