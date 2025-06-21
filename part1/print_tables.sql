INSERT INTO WalkApplications (request_id, walker_id, status)
VALUES (
  (SELECT wr.request_id FROM WalkRequests wr
    JOIN Dogs d ON wr.dog_id = d.dog_id
    WHERE d.name = 'Max' AND wr.status = 'completed'
    LIMIT 1),
  (SELECT user_id FROM Users WHERE username = 'bobwalker' LIMIT 1),
  'accepted'
);