SELECT wr.request_id FROM WalkRequests wr
JOIN Dogs d ON wr.dog_id = d.dog_id
WHERE d.name = 'Max' AND wr.status = 'completed'
LIMIT 1;